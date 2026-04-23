export function analyzeText(text) {
  const issues = [];
  
  if (!text || text.trim().length < 50) {
    issues.push("low_text_density");
  }

  // Detect repeated phrases (typical AI hallucination or tampering)
  if (/(\b\w+\b)( \1){2,}/i.test(text)) {
    issues.push("repetitive_patterns_detected");
  }

  // Basic check for document-specific numeric sequences
  if (!text.match(/\d{4}/)) {
    issues.push("missing_authentication_codes");
  }

  // Statistical anomaly check (inconsistent text casing)
  const upperCount = (text.match(/[A-Z]/g) || []).length;
  if (upperCount > text.length * 0.4) {
    issues.push("unusual_casing_detected");
  }

  return {
    issues,
    length: text.length,
    confidenceHint: issues.length === 0 ? 0.95 : 0.65
  };
}
