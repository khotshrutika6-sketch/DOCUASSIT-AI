import { Router } from 'express';
import guidanceController from '../controllers/guidanceController';

const router = Router();

// Get all available documents
router.get('/documents', (req, res) => {
  guidanceController.getAllDocuments(req, res);
});

// Smart fuzzy search (handles typos)
router.get('/search', (req, res) => {
  guidanceController.searchDocuments(req, res);
});

// Get guide for specific document
router.get('/guide/:documentId', (req, res) => {
  guidanceController.getDocumentGuide(req, res);
});

// Ask a question about a document
router.post('/ask', (req, res) => {
  guidanceController.askQuestion(req, res);
});

// Chat agent — multi-turn Q&A
router.post('/chat', (req, res) => {
  guidanceController.chat(req, res);
});

// Dynamic AI Guidance
router.post('/dynamic-guide', (req, res) => {
  guidanceController.dynamicGuide(req, res);
});

export default router;
