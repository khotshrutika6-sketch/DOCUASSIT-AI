import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

let _openai = null;
function getOpenAI() {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-key-here') return null;
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

// Helper to load document data
const getDocuments = () => {
    try {
        const dataPath = path.join(__dirname, "../src/data/documentGuides.json");
        const data = fs.readFileSync(dataPath, "utf8");
        const parsed = JSON.parse(data);
        return Object.values(parsed);
    } catch (e) {
        console.error("Error loading documents:", e);
        return [];
    }
};

router.get("/documents", (req, res) => {
    res.json({ success: true, data: { documents: getDocuments() } });
});

router.get("/search", (req, res) => {
    const documents = getDocuments();
    const query = req.query.query?.toLowerCase() || '';
    if (!query) return res.json({ success: true, data: { results: documents } });

    const results = documents.filter(doc => 
        doc.name.toLowerCase().includes(query) || 
        doc.category.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query)
    );
    res.json({ success: true, data: { results } });
});

router.get("/guide/:documentId", (req, res) => {
    const documents = getDocuments();
    const doc = documents.find(d => d.id === req.params.documentId);
    if (!doc) return res.status(404).json({ success: false, message: "Document not found" });
    
    let aiMessage = `📋 **${doc.name}**\n\n${doc.description}\n\n**Required Documents:**\n`;
    doc.requiredDocuments.forEach((r, i) => { aiMessage += `${i+1}. ${r}\n`; });
    aiMessage += `\n**Process steps:**\n`;
    doc.steps.forEach(s => { aiMessage += `${s.number}. **${s.title}** - ${s.description}\n`; });

    res.json({ success: true, data: { message: aiMessage, documentInfo: doc } });
});

// POST /ask - Specific question about a document
router.post("/ask", async (req, res) => {
    const { documentId, question } = req.body;
    const documents = getDocuments();
    const doc = documents.find(d => d.id === documentId);
    
    if (!doc) return res.status(404).json({ success: false, message: "Document not found" });
    
    let reply = `That's a great question about the ${doc.name}! While I'm just a simple bot right now, I can tell you that for ${doc.name}, you need: ${doc.requiredDocuments.join(', ')}.`;

    const openai = getOpenAI();
    if (openai) {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: `You're a friendly assistant for India gov docs. Answer about ${doc.name}. Context: ${JSON.stringify(doc)}` },
                    { role: 'user', content: question }
                ],
            });
            reply = response.choices[0].message.content || reply;
        } catch (e) {
            console.error("OpenAI error:", e);
        }
    }
    
    res.json({ success: true, data: { message: reply, documentInfo: doc } });
});

// POST /chat - General friendly chat
router.post("/chat", async (req, res) => {
    const { message, history = [], documentId } = req.body;
    if (!message) return res.status(400).json({ success: false, reply: "Say something!" });
    
    const documents = getDocuments();
    let reply = "";
    let suggestions = documents.slice(0, 3).map(d => ({ id: d.id, name: d.name, icon: d.icon }));
    let documentInfo = null;
    
    const lowerMsg = message.toLowerCase();
    
    // Extract recent topic from history if fallback is used
    let lastTopic = null;
    if (history.length > 0) {
        const lastAsst = [...history].reverse().find(m => m.role === 'assistant');
        if (lastAsst) {
            const foundDocs = documents.filter(d => lastAsst.content.toLowerCase().includes(d.name.toLowerCase()));
            if (foundDocs.length > 0) lastTopic = foundDocs[0];
        }
    }
    
    if (lowerMsg.includes("hello") || lowerMsg.includes("hi ") || lowerMsg === "hi") {
        reply = "Hello there! 👋 I am DocAssist AI, your friendly government document assistant. How can I help you today? Do you need help with a Passport, PAN card, or Aadhaar?";
    } else {
        const foundDocs = documents.filter(d => lowerMsg.includes(d.name.toLowerCase()));
        if (foundDocs.length > 0) {
            documentInfo = foundDocs[0];
            reply = `I can definitely help you with your ${documentInfo.name}! It usually takes about ${documentInfo.estimatedTime} and costs ${documentInfo.fees}. Do you want to see the application process?`;
            suggestions = [];
        } else if (lastTopic && (lowerMsg.includes("yes") || lowerMsg.includes("sure") || lowerMsg.includes("process") || lowerMsg.includes("how"))) {
            // Contextual fallback response
            documentInfo = lastTopic;
            reply = `Great! Here is how you apply for ${lastTopic.name}:\n\nRequired Documents:\n` + lastTopic.requiredDocuments.join(", ") + `\n\nProcess:\n` + lastTopic.steps.map(s => `${s.number}. ${s.title}`).join("\n");
            suggestions = [];
        } else {
            reply = "I'm your friendly DocAssist bot! I'm still learning, but I can help you find out how to apply for Indian government documents. Try asking about a 'Passport' or 'Aadhaar'!";
        }
    }
    
    const openai = getOpenAI();
    if (openai) {
        try {
            // Reformat history for OpenAI
            const openAiMessages = [
                { role: 'system', content: `You are a super friendly, helpful chatbot assisting users with Indian government documents. Keep it short, use emojis, and be extremely welcoming. Connect to previous conversation where relevant.` }
            ];
            
            // Add prior messages to context (last 5)
            const recentHistory = history.slice(-5);
            for (const h of recentHistory) {
                if (h.role && h.content) {
                    openAiMessages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content });
                }
            }
            
            // Add current message
            openAiMessages.push({ role: 'user', content: message });
            
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: openAiMessages,
            });
            reply = response.choices[0].message.content || reply;
        } catch (e) {
            console.error("OpenAI error:", e);
        }
    }
    
    res.json({ success: true, reply, documentInfo, suggestions });
});

// POST /dynamic-guide
router.post("/dynamic-guide", (req, res) => {
    const { document } = req.body;
    res.json({ success: true, result: JSON.stringify({
        steps: [`Visit official portal for ${document}`, `Submit required documents`, `Complete verification`],
        documents: ["Aadhaar", "Identity Proof"]
    })});
});

export default router;
