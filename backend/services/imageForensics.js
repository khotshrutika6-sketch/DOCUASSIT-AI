import sharp from "sharp";
import fs from "fs";

export async function detectForgery(filePath) {
  const riskSignals = [];
  let riskLevel = "Low";
  let metadata = {};

  try {
    if (filePath.toLowerCase().endsWith(".pdf")) {
       return { riskLevel: "Low", signals: ["PDF document - standard structure"] };
    }

    const image = sharp(filePath);
    const metadataResult = await image.metadata();
    metadata = metadataResult;

    // Check for unusual DPI
    if (metadataResult.density && metadataResult.density < 72) {
      riskSignals.push("Low DPI - potential web screenshot, not original document");
    }

    // Attempt to calculate some basic image stats to simulate noise/ELA detection
    const stats = await image.stats();
    
    // Check for uniform channel entropy (potential digital generation/tampering)
    if (stats.channels && stats.channels.length >= 3) {
      const gEntropy = stats.channels[1].entropy;
      if (gEntropy < 3) {
         riskSignals.push("Low image entropy - potentially heavily compressed or digitally synthesised");
      }
    }

    // Format analysis (JPEG is typical, WebP/PNG might be screenshots)
    if (metadataResult.format === "png" || metadataResult.format === "webp") {
      riskSignals.push("Non-standard forensic format (PNG/WebP) detected");
    }

  } catch (err) {
    console.error("Image forensics error:", err);
    riskSignals.push("Unable to completely parse image forensics");
  }

  if (riskSignals.length >= 2) riskLevel = "High";
  else if (riskSignals.length === 1) riskLevel = "Medium";

  return {
    riskLevel,
    signals: riskSignals.length > 0 ? riskSignals : ["No obvious forensic anomalies detected"],
    imageInfo: metadata
  };
}
