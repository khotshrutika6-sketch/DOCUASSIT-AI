import { Request, Response } from 'express';
import guidanceAgent from '../services/ai/guidanceAgent';

export class GuidanceController {
  /**
   * Fuzzy search — handles typos, partial matches
   */
  async searchDocuments(req: Request, res: Response) {
    try {
      const { query } = req.query;

      if (!query || typeof query !== 'string') {
        // Return all documents if no query
        const all = guidanceAgent.getAllDocuments();
        return res.json({ success: true, data: { query: '', results: all, count: all.length } });
      }

      const results = guidanceAgent.fuzzySearch(query);

      return res.json({
        success: true,
        data: { query, results, count: results.length },
      });
    } catch (error) {
      console.error('Search error:', error);
      return res.status(500).json({ success: false, error: 'Search failed' });
    }
  }

  /**
   * Get all available documents
   */
  async getAllDocuments(req: Request, res: Response) {
    try {
      const documents = guidanceAgent.getAllDocuments();
      return res.json({
        success: true,
        data: { documents, count: documents.length },
      });
    } catch (error) {
      console.error('Get all documents error:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch documents' });
    }
  }

  /**
   * Get guide for specific document
   */
  async getDocumentGuide(req: Request, res: Response) {
    try {
      const { documentId } = req.params;
      const { question } = req.query;

      console.log(`📖 Getting guidance for: ${documentId}`);

      const guidance = await guidanceAgent.getAIGuidance(
        documentId,
        question ? String(question) : undefined
      );

      if (!guidance.success) {
        return res.status(404).json(guidance);
      }

      console.log(`✅ Guidance generated for: ${documentId}`);
      return res.json({ success: true, data: guidance });
    } catch (error) {
      console.error('Get guidance error:', error);
      return res.status(500).json({ success: false, error: 'Failed to generate guidance' });
    }
  }

  /**
   * Ask a question about a document
   */
  async askQuestion(req: Request, res: Response) {
    try {
      const { documentId, question } = req.body;

      if (!documentId || !question) {
        return res.status(400).json({ success: false, error: 'documentId and question are required' });
      }

      console.log(`❓ Question about ${documentId}: "${question}"`);
      const guidance = await guidanceAgent.getAIGuidance(documentId, question);

      return res.json({ success: true, data: guidance });
    } catch (error) {
      console.error('Ask question error:', error);
      return res.status(500).json({ success: false, error: 'Failed to answer question' });
    }
  }

  /**
   * Chat agent — general Q&A, smart document lookup
   */
  async chat(req: Request, res: Response) {
    try {
      const { message, documentId } = req.body;

      if (!message) {
        return res.status(400).json({ success: false, error: 'message is required' });
      }

      // If document context provided, answer about it
      if (documentId) {
        const guidance = await guidanceAgent.getAIGuidance(documentId, message);
        return res.json({ success: true, reply: guidance.message, documentInfo: guidance.documentInfo });
      }

      // Otherwise, smart fuzzy search + guidance
      const searchResults = guidanceAgent.fuzzySearch(message);
      if (searchResults.length > 0) {
        const topDoc = searchResults[0];
        const guidance = await guidanceAgent.getAIGuidance(topDoc.id, message);
        return res.json({
          success: true,
          reply: guidance.message,
          documentInfo: guidance.documentInfo,
          suggestions: searchResults.slice(1, 4).map((d) => ({ id: d.id, name: d.name, icon: d.icon })),
        });
      }

      return res.json({
        success: true,
        reply: `I couldn't find a document matching "${message}". Try searching for: Passport, Driving License, PAN Card, Aadhaar Card, or Income Certificate.`,
        suggestions: guidanceAgent.getAllDocuments().slice(0, 5).map((d) => ({ id: d.id, name: d.name, icon: d.icon })),
      });
    } catch (error) {
      console.error('Chat error:', error);
      return res.status(500).json({ success: false, error: 'Chat agent failed' });
    }
  }

  /**
   * Dynamic AI Guide with simple language and translation
   */
  async dynamicGuide(req: Request, res: Response) {
    try {
      const { document, language = 'English', simple = false } = req.body;
      if (!document) {
        return res.status(400).json({ success: false, error: 'Document name is required' });
      }
      const result = await guidanceAgent.dynamicGuide(document, language, simple);
      return res.json({ success: true, result });
    } catch (error) {
      console.error('Dynamic guide error:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch dynamic guide' });
    }
  }
}

export default new GuidanceController();
