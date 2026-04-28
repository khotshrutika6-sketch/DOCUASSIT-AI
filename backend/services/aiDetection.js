import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Very basic statistical approximation for perplexity/burstiness
function calculateSentenceStats(text) {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
  const lengths = sentences.map(s => s.trim().split(/\s+/).length);
  
  if (lengths.length === 0) return { perplexity: 0, burstiness: 0 };

  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((a, b) => a + Math.pow(b - avgLength, 2), 0) / lengths.length;
  
  return {
    perplexity: avgLength, 
    burstiness: variance
  };
}

export async function detectAIContent(text) {
  if (!text || text.trim().length < 50) {
    return { aiProbability: 0, reason: "Text too short for AI detection" };
  }

  const { perplexity, burstiness } = calculateSentenceStats(text);
  
  // AI generated text typically has low burstiness (uniform sentence length)
  // and lower perplexity compared to human writing.
  let aiProbability = 0;
  
  if (burstiness < 10) aiProbability += 40;
  else if (burstiness < 20) aiProbability += 20;

  if (perplexity > 10 && perplexity < 20) aiProbability += 30; // very standard sentence lengths
  
  // Repeated patterns hint at hallucination
  if (/(\b\w+\b)( \1){2,}/i.test(text)) {
    aiProbability += 25;
  }
  
  // Words commonly used by AI
  const aiKeywords = /\b(delve|tapestry|moreover|furthermore|in conclusion|testament|crucial|vital|multifaceted)\b/gi;
  const matches = text.match(aiKeywords);
  if (matches) {
    aiProbability += Math.min(20, matches.length * 5);
  }

  aiProbability = Math.min(100, Math.max(0, aiProbability));

  return {
    aiProbability,
    metrics: { perplexity, burstiness },
    isAI: aiProbability > 60
  };
}
