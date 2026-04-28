const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/guidance`;

export interface DocumentGuide {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  applyLink?: string;
  requiredDocuments: string[];
  steps: Array<{
    number: number;
    title: string;
    description: string;
    duration: string;
    online: boolean;
  }>;
  processType: string;
  officeVisitRequired: boolean;
  officeVisitTiming: string;
  estimatedTime: string;
  fees: string;
  tips: string[];
  warnings: string[];
  commonIssues: Array<{
    issue: string;
    solution: string;
  }>;
}

export interface GuidanceResponse {
  success: boolean;
  message: string;
  documentInfo?: DocumentGuide;
  suggestions?: string[];
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  documentInfo?: DocumentGuide;
  suggestions?: Array<{ id: string; name: string; icon: string }>;
}

export const guidanceApi = {
  async getAllDocuments(): Promise<DocumentGuide[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents`);
      const result = await response.json();
      return result.data?.documents || [];
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      return [];
    }
  },

  /** Fuzzy search — handles typos like "pasport" → Passport */
  async searchDocuments(query: string): Promise<DocumentGuide[]> {
    try {
      if (!query || query.trim().length === 0) return this.getAllDocuments();
      const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
      const result = await response.json();
      return result.data?.results || [];
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  },

  async getDocumentGuide(documentId: string): Promise<GuidanceResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/guide/${documentId}`);
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Failed to fetch guide:', error);
      return null;
    }
  },

  async askQuestion(documentId: string, question: string): Promise<GuidanceResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, question }),
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to ask question:', error);
      return null;
    }
  },

  /** Chat agent — general question or document-specific Q&A */
  async chat(message: string, history: any[] = [], documentId?: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, documentId }),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Chat agent failed:', error);
      return {
        success: false,
        reply: 'Chat agent is unavailable. Please make sure the backend is running.',
      };
    }
  },

  async getDynamicGuide(documentName: string, language: string = 'English', simple: boolean = false): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/dynamic-guide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: documentName, language, simple }),
      });
      const result = await response.json();
      if (result.success && result.result) {
        return JSON.parse(result.result);
      }
      return null;
    } catch (error) {
      console.error('Failed to get dynamic guide:', error);
      return null;
    }
  },
};
