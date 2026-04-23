const API_BASE_URL = 'http://localhost:5000/api';

export interface DocumentType {
  id: string;
  name: string;
  icon: string;
}

export interface VerificationResponse {
  success: boolean;
  data?: {
    score: number;
    status: string;
    isValid: boolean;
    confidence: number;
    explanation: string;
    extractedText: string;
    documentType: string;
    issues: string[];
    timestamp: string;
  };
  error?: string;
}

export const api = {
  async verifyDocument(file: File, documentType: string): Promise<VerificationResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    try {
      const response = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        body: formData,
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },
};
