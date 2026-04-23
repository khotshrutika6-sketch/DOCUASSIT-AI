import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "dummy_key" 
});

export async function explainResult(result, text) {
  // If no API key, return a standard rule-based explanation
  if (!process.env.OPENAI_API_KEY) {
    if (result.score >= 80) return "The document structure and metadata align with official protocols. High level of authenticity detected.";
    if (result.score >= 50) return "Certain anomalies in text density or metadata were identified. Manual verification is recommended.";
    return "Significant risk markers detected. The document potentially shows signs of manipulation or non-standard formatting.";
  }

  try {
    const prompt = `
      As an AI Document Security Analyst, explain this verification result to a user:
      Result Status: ${result.status}
      Authenticity Score: ${result.score}%
      Detected Issues: ${result.issues.join(", ")}
      
      The document text starts with: "${text.substring(0, 100)}..."
      
      Provide a professional, clear, and reassuring explanation of why the document received this score. 
      Keep it under 3 sentences.
    `;

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    return res.choices[0].message.content;
  } catch (error) {
    console.error("AI Explanation Failed:", error);
    return "The system identified specific risk signals related to document formatting and metadata. Please review the listed issues for more detail.";
  }
}
