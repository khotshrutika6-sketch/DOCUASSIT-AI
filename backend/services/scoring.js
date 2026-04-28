export function calculateScore({ textSignals, metadataSignals, aiSignals, forensicsSignals }) {
  let score = 100;
  
  const allIssues = [
    ...(textSignals?.issues || []),
    ...(metadataSignals?.issues || []),
    ...(forensicsSignals?.signals || [])
  ];

  allIssues.forEach(issue => {
    switch (issue) {
      case "image_editing_software_detected": score -= 40; break;
      case "missing_original_timestamps": score -= 15; break;
      case "repetitive_patterns_detected": score -= 25; break;
      case "low_text_density": score -= 20; break;
      case "unusual_casing_detected": score -= 10; break;
      case "no_metadata_found": score -= 5; break;
      case "Low DPI - potential web screenshot, not original document": score -= 20; break;
      case "Low image entropy - potentially heavily compressed or digitally synthesised": score -= 30; break;
      case "Non-standard forensic format (PNG/WebP) detected": score -= 10; break;
      default: break; // don't blindly penalize
    }
  });

  // Penalize for high AI probability
  if (aiSignals?.isAI) {
     score -= 25;
  }

  // Ensure score stays within bounds
  score = Math.max(0, Math.min(100, score));

  let status = "AUTHENTIC";
  if (score < 80) status = "LOW_RISK";
  if (score < 60) status = "SUSPICIOUS";
  if (score < 40) status = "HIGH_RISK";

  // Human-readable labels for the UI
  const issues = allIssues
    .filter(i => i !== "No obvious forensic anomalies detected" && i !== "PDF document - standard structure")
    .map(issue => issue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

  if (aiSignals?.isAI) {
      issues.push("Strong markers of Al-generated content");
  }

  return { 
    authenticityScore: score, 
    status, 
    isValid: score > 60,
    aiProbability: aiSignals?.aiProbability || 0,
    forgeryRisk: forensicsSignals?.riskLevel || "Low",
    issues,
    reasoning: generateReasoning(status, forensicsSignals?.riskLevel, aiSignals?.aiProbability)
  };
}

function generateReasoning(status, riskLevel, aiProb) {
  if (status === "AUTHENTIC" && riskLevel === "Low" && aiProb < 30) {
    return "Document formatting, structure, and text entropy align with typical human-generated authentic files.";
  }
  if (status === "SUSPICIOUS" || status === "HIGH_RISK") {
    return "Multiple anomalies detected across metadata and text analysis. Visual or structural features do not match expected standard document parameters.";
  }
  if (aiProb > 60) {
    return "The text structure (burstiness/perplexity) strongly matches synthetic AI generation patterns instead of natural human dictation.";
  }
  if (riskLevel === "High") {
    return "Image forensics reveal tampered segments or digital synthesis markers typical of manipulated screenshots.";
  }
  return "Minor inconsistencies observed, but generally falls within acceptable tolerance parameters.";
}
