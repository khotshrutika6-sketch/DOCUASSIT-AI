import axios from 'axios';
import Tesseract from 'tesseract.js';

interface OcrResult {
  success: boolean;
  text: string;
  confidence: number;
  error?: string;
}

export class OcrService {
  /**
   * Extract text from image buffer.
   * Tries Google Vision API first (high accuracy), falls back to Tesseract.js.
   */
  async extractText(imageBuffer: Buffer): Promise<OcrResult> {
    // Try Google Vision API if key is configured
    if (process.env.GOOGLE_VISION_API_KEY) {
      try {
        return await this.extractWithGoogleVision(imageBuffer);
      } catch (error) {
        console.warn('⚠️ Google Vision failed, falling back to Tesseract:', error);
      }
    }
    // Fallback: Tesseract.js (local OCR)
    return this.extractWithTesseract(imageBuffer);
  }

  /**
   * Google Cloud Vision API — fast, highly accurate
   */
  private async extractWithGoogleVision(imageBuffer: Buffer): Promise<OcrResult> {
    const base64Image = imageBuffer.toString('base64');
    const apiKey = process.env.GOOGLE_VISION_API_KEY;

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        requests: [
          {
            image: { content: base64Image },
            features: [
              { type: 'TEXT_DETECTION', maxResults: 1 },
              { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 },
            ],
          },
        ],
      },
      { timeout: 15000 }
    );

    const result = response.data.responses?.[0];

    if (result?.error) {
      throw new Error(result.error.message);
    }

    const fullText =
      result?.fullTextAnnotation?.text ||
      result?.textAnnotations?.[0]?.description ||
      '';

    if (!fullText) {
      return {
        success: false,
        text: '',
        confidence: 0,
        error: 'No text detected in image',
      };
    }

    console.log(`✅ Google Vision OCR: ${fullText.length} chars extracted`);

    return {
      success: true,
      text: fullText,
      confidence: 95, // Google Vision is consistently high-confidence
    };
  }

  /**
   * Tesseract.js — local fallback OCR
   */
  private async extractWithTesseract(imageBuffer: Buffer): Promise<OcrResult> {
    try {
      console.log('🔍 Running Tesseract OCR...');
      const {
        data: { text, confidence },
      } = await Tesseract.recognize(imageBuffer, 'eng', {
        logger: () => {}, // suppress verbose logs
      });

      if (!text || text.trim().length < 10) {
        return {
          success: false,
          text: text || '',
          confidence: confidence || 0,
          error: 'Very little text detected. Please upload a clearer image.',
        };
      }

      console.log(`✅ Tesseract OCR complete — Confidence: ${confidence?.toFixed(1)}%`);

      return {
        success: true,
        text: text.trim(),
        confidence: confidence || 70,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown OCR error';
      console.error('❌ Tesseract OCR Error:', message);
      return {
        success: false,
        text: '',
        confidence: 0,
        error: message,
      };
    }
  }
}

export default new OcrService();
