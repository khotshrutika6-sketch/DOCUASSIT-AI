import Tesseract from "tesseract.js";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export async function extractText(filePath) {
  try {
    if (filePath.toLowerCase().endsWith(".pdf")) {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    }

    // For images, use Tesseract
    const { data } = await Tesseract.recognize(filePath, "eng");
    return data.text;
  } catch (error) {
    console.error("OCR Extraction Failed:", error);
    return "";
  }
}
