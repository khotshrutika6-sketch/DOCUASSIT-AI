export function calculateScore({ textSignals, metadataSignals }) {
  let score = 100;
  
  const allIssues = [
    ...textSignals.issues,
    ...metadataSignals.issues
  ];

  allIssues.forEach(issue => {
    switch (issue) {
      case "image_editing_software_detected": score -= 40; break;
      case "missing_original_timestamps": score -= 15; break;
      case "repetitive_patterns_detected": score -= 25; break;
      case "low_text_density": score -= 20; break;
      case "unusual_casing_detected": score -= 10; break;
      case "no_metadata_found": score -= 5; break;
      default: score -= 5;
    }
  });

  // Ensure score stays within bounds
  score = Math.max(0, Math.min(100, score));

  let status = "AUTHENTIC";
  if (score < 80) status = "LOW_RISK";
  if (score < 60) status = "SUSPICIOUS";
  if (score < 40) status = "HIGH_RISK";

  // Human-readable labels for the UI
  const issues = allIssues.map(issue => 
    issue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );

  return { 
    score, 
    status, 
    isValid: score > 60,
    confidence: textSignals.confidenceHint,
    issues 
  };
}
