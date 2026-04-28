import express from "express";
import multer from "multer";
import { extractText } from "../services/ocrService.js";
import { analyzeText } from "../services/textAnalysis.js";
import { checkMetadata } from "../services/metadataCheck.js";
import { calculateScore } from "../services/scoring.js";
import { explainResult } from "../services/aiExplain.js";
import { detectAIContent } from "../services/aiDetection.js";
import { detectForgery } from "../services/imageForensics.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file provided" });
    }

    const filePath = req.file.path;
    const documentType = req.body.documentType || 'unknown';

    // 1. Extract Text
    const text = await extractText(filePath);
    
    // 2. Analyze Clues
    const textSignals = analyzeText(text);

    // 2.5 AI Detection
    const aiSignals = await detectAIContent(text);
    
    // 3. Check Metadata
    const metadataSignals = await checkMetadata(filePath);

    // 3.5 Image Forensics
    const forensicsSignals = await detectForgery(filePath);

    // 4. Calculate Risk Identity Score
    const result = calculateScore({
      textSignals,
      metadataSignals,
      aiSignals,
      forensicsSignals
    });

    // 5. Generate AI Strategic Explanation (Wait, we can just use the score reasoning now or combine them. We'll still keep the AI explain but pass the new result.)
    const explanation = await explainResult(result, text);

    res.json({ 
      success: true,
      data: {
        ...result, 
        explanation,
        extractedText: text,
        documentType,
        timestamp: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
