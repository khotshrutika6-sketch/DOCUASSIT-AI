import express from "express";
import multer from "multer";
import { extractText } from "../services/ocrService.js";
import { analyzeText } from "../services/textAnalysis.js";
import { checkMetadata } from "../services/metadataCheck.js";
import { calculateScore } from "../services/scoring.js";
import { explainResult } from "../services/aiExplain.js";

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
    
    // 3. Check Metadata
    const metadataSignals = await checkMetadata(filePath);

    // 4. Calculate Risk Identity Score
    const result = calculateScore({
      textSignals,
      metadataSignals
    });

    // 5. Generate AI Strategic Explanation
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
