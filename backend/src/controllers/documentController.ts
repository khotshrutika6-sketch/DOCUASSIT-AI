import { Request, Response } from 'express';
import ocrService from '../services/ocrService';
import verificationAgent from '../services/ai/verificationAgent';

export class DocumentController {
  /**
   * Upload and verify document
   */
  async verifyDocument(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      const { documentType = 'general' } = req.body;
      const imageBuffer = req.file.buffer;

      console.log(`📄 Processing document: ${documentType}`);

      // Step 1: Extract text using OCR
      console.log('🔍 Step 1: Running OCR...');
      const ocrResult = await ocrService.extractText(imageBuffer);

      if (!ocrResult.success) {
        return res.status(500).json({
          success: false,
          error: 'OCR processing failed',
          details: ocrResult.error,
        });
      }

      console.log(`✅ OCR Complete - Confidence: ${ocrResult.confidence.toFixed(1)}%`);

      // Step 2: Verify document with AI Agent
      console.log('🤖 Step 2: AI Verification Agent analyzing...');
      const verification = await verificationAgent.verifyDocument(
        ocrResult.text,
        documentType,
        ocrResult.confidence
      );

      console.log(`✅ Verification Complete - Valid: ${verification.isValid}`);

      // Step 3: Return comprehensive result
      return res.json({
        success: true,
        data: {
          documentType,
          isValid: verification.isValid,
          confidence: verification.confidence,
          ocrConfidence: ocrResult.confidence,
          extractedText: ocrResult.text,
          extractedData: verification.extractedData,
          issues: verification.issues,
          suggestions: verification.suggestions,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('❌ Document verification error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get supported document types
   */
  async getSupportedTypes(req: Request, res: Response) {
    res.json({
      success: true,
      data: {
        types: [
          { id: 'aadhar', name: 'Aadhar Card', icon: '🆔' },
          { id: 'pan', name: 'PAN Card', icon: '💳' },
          { id: 'income_certificate', name: 'Income Certificate', icon: '📋' },
          { id: 'passport', name: 'Passport', icon: '🛂' },
          { id: 'driving_license', name: 'Driving License', icon: '🚗' },
          { id: 'general', name: 'General Document', icon: '📄' },
        ],
      },
    });
  }
}

export default new DocumentController();
