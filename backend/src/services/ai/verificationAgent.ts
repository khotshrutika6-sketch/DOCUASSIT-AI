import OpenAI from 'openai';

// Lazy init — only create client when an API key is present
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-key-here') return null;
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

export interface DocumentIssue {
  type: 'missing_field' | 'poor_quality' | 'invalid_format' | 'suspicious';
  severity: 'high' | 'medium' | 'low';
  message: string;
  field?: string;
}

export interface VerificationResult {
  isValid: boolean;
  issues: DocumentIssue[];
  suggestions: string[];
  extractedData: Record<string, any>;
  confidence: number;
}

export class DocumentVerificationAgent {
  /**
   * Main verification method - analyzes document text and metadata
   */
  async verifyDocument(
    extractedText: string,
    documentType: string,
    ocrConfidence: number
  ): Promise<VerificationResult> {
    const issues: DocumentIssue[] = [];
    const suggestions: string[] = [];

    // Check OCR quality first
    if (ocrConfidence < 60) {
      issues.push({
        type: 'poor_quality',
        severity: 'high',
        message: 'Document image quality is too low. Text recognition confidence is below acceptable threshold.',
      });
      suggestions.push('Please upload a clearer, higher resolution image');
      suggestions.push('Ensure good lighting and avoid shadows');
    }

    // Use OpenAI to analyze document content
    const aiAnalysis = await this.analyzeWithAI(extractedText, documentType);

    return {
      isValid: issues.filter((i) => i.severity === 'high').length === 0,
      issues: [...issues, ...aiAnalysis.issues],
      suggestions: [...suggestions, ...aiAnalysis.suggestions],
      extractedData: aiAnalysis.extractedData,
      confidence: Math.min(ocrConfidence, aiAnalysis.confidence),
    };
  }

  /**
   * Use OpenAI to deeply analyze document content
   */
  private async analyzeWithAI(
    text: string,
    documentType: string
  ): Promise<{
    issues: DocumentIssue[];
    suggestions: string[];
    extractedData: Record<string, any>;
    confidence: number;
  }> {
    const openai = getOpenAI();

    // If no API key, return smart basic extraction
    if (!openai) {
      return {
        issues: [],
        suggestions: ['Upload a clear, well-lit image for best results', 'Ensure all text is visible and not blurred'],
        extractedData: this.basicExtraction(text, documentType),
        confidence: 70,
      };
    }

    try {
      const prompt = this.buildVerificationPrompt(text, documentType);

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a document verification AI agent. Analyze documents for completeness, validity, and potential issues.
            Return your analysis in JSON format with: issues (array), suggestions (array), extractedData (object), confidence (0-100).`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return {
        issues: result.issues || [],
        suggestions: result.suggestions || [],
        extractedData: result.extractedData || {},
        confidence: result.confidence || 70,
      };
    } catch (error) {
      console.error('OpenAI Analysis Error:', error);

      return {
        issues: [
          {
            type: 'invalid_format',
            severity: 'medium',
            message: 'AI analysis temporarily unavailable. Basic validation applied.',
          },
        ],
        suggestions: ['Please try again or contact support'],
        extractedData: this.basicExtraction(text, documentType),
        confidence: 50,
      };
    }
  }

  /**
   * Build intelligent prompt for OpenAI
   */
  private buildVerificationPrompt(text: string, documentType: string): string {
    const documentRules: Record<string, string> = {
      aadhar: 'Should contain: 12-digit Aadhar number, full name, DOB, address, photo',
      pan: 'Should contain: 10-character PAN number, full name, father name, DOB',
      income_certificate: 'Should contain: certificate number, income amount, issuing authority, date',
      passport: 'Should contain: passport number, full name, DOB, place of birth, photo',
      driving_license: 'Should contain: DL number, full name, DOB, address, validity dates',
    };

    const rules = documentRules[documentType.toLowerCase()] || 'Verify completeness and authenticity';

    return `
Document Type: ${documentType}
Expected Requirements: ${rules}

Extracted Text:
${text}

Task: Analyze this document and provide:
1. List of issues (missing fields, formatting problems, suspicious content)
2. Actionable suggestions for the user
3. Extracted structured data (name, DOB, numbers, etc.)
4. Overall confidence score (0-100)

Return JSON format:
{
  "issues": [{"type": "missing_field", "severity": "high", "message": "...", "field": "..."}],
  "suggestions": ["..."],
  "extractedData": {"name": "...", "number": "...", ...},
  "confidence": 85
}
`;
  }

  /**
   * Fallback basic extraction if AI fails
   */
  private basicExtraction(text: string, documentType: string): Record<string, any> {
    const data: Record<string, any> = {
      documentType,
      rawText: text.substring(0, 200),
    };

    // Basic regex patterns
    const patterns = {
      aadhar: /\b\d{4}\s?\d{4}\s?\d{4}\b/,
      pan: /[A-Z]{5}\d{4}[A-Z]/,
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
      phone: /\b\d{10}\b/,
    };

    Object.entries(patterns).forEach(([key, regex]) => {
      const match = text.match(regex);
      if (match) {
        data[key] = match[0];
      }
    });

    return data;
  }
}

export default new DocumentVerificationAgent();
