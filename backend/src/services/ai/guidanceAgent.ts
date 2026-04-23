import OpenAI from 'openai';
import Fuse from 'fuse.js';
import documentGuides from '../../data/documentGuides.json';

// Lazy init — only create client when an API key is present
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-key-here') return null;
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

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
  processType?: string;
  officeVisitRequired?: boolean;
  officeVisitTiming?: string;
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

export class GuidanceAgent {
  /**
   * Fuzzy search using Fuse.js — handles typos like "pasport" → Passport
   */
  fuzzySearch(query: string): DocumentGuide[] {
    if (!query || query.trim().length < 2) return this.getAllDocuments();
    const guides = Object.values(documentGuides) as any[];

    const fuse = new Fuse(guides, {
      keys: [
        { name: 'name', weight: 0.5 },
        { name: 'category', weight: 0.3 },
        { name: 'description', weight: 0.2 },
      ],
      threshold: 0.45,
      includeScore: true,
    });

    const results = fuse.search(query);
    if (results.length === 0) return this.searchDocuments(query);
    return results.map((r: any) => r.item);
  }

  /**
   * Exact/contains search (fallback)
   */
  searchDocuments(query: string): DocumentGuide[] {
    const normalizedQuery = query.toLowerCase().trim();
    const guides = Object.values(documentGuides) as any[];
    return guides.filter((guide) => {
      return (
        guide.name.toLowerCase().includes(normalizedQuery) ||
        guide.id.includes(normalizedQuery) ||
        guide.category.toLowerCase().includes(normalizedQuery) ||
        guide.description.toLowerCase().includes(normalizedQuery)
      );
    });
  }

  /**
   * Get document guide by ID
   */
  getDocumentGuide(documentId: string): DocumentGuide | null {
    const guide = (documentGuides as Record<string, any>)[documentId];
    return guide || null;
  }

  /**
   * Get all available documents
   */
  getAllDocuments(): DocumentGuide[] {
    return Object.values(documentGuides) as any[];
  }

  /**
   * AI-powered conversational guidance (with template fallback)
   */
  async getAIGuidance(
    documentId: string,
    userQuestion?: string
  ): Promise<GuidanceResponse> {
    const guide = this.getDocumentGuide(documentId);

    if (!guide) {
      return {
        success: false,
        message: 'Document guide not found. Please select a valid document type.',
        suggestions: [
          'Try searching for: Passport, Driving License, PAN Card, Aadhaar, Income Certificate',
        ],
      };
    }

    // If no OpenAI key configured, use rich template response immediately
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-key-here') {
      return {
        success: true,
        message: this.generateTemplateResponse(guide),
        documentInfo: guide,
      };
    }

    try {
      const context = this.buildGuidanceContext(guide);

      if (userQuestion) {
        const answer = await this.answerQuestion(guide, userQuestion, context);
        return { success: true, message: answer, documentInfo: guide };
      }

      const overview = await this.generateOverview(guide, context);
      return { success: true, message: overview, documentInfo: guide };
    } catch (error) {
      console.error('AI Guidance Error:', error);
      return {
        success: true,
        message: this.generateTemplateResponse(guide),
        documentInfo: guide,
      };
    }
  }

  private buildGuidanceContext(guide: DocumentGuide): string {
    return `
Document: ${guide.name}
Description: ${guide.description}

Required Documents:
${guide.requiredDocuments.map((doc, i) => `${i + 1}. ${doc}`).join('\n')}

Process Steps:
${guide.steps.map((step) => `Step ${step.number}: ${step.title}\n${step.description} (${step.duration})${step.online ? ' [ONLINE]' : ' [OFFLINE]'}`).join('\n\n')}

Process Type: ${guide.processType}
Office Visit Required: ${guide.officeVisitRequired ? 'Yes' : 'No'}
${guide.officeVisitRequired ? `When to Visit: ${guide.officeVisitTiming}` : ''}

Estimated Time: ${guide.estimatedTime}
Fees: ${guide.fees}

Important Tips:
${guide.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

Warnings:
${guide.warnings.map((warn, i) => `${i + 1}. ${warn}`).join('\n')}

Common Issues:
${guide.commonIssues.map((issue, i) => `${i + 1}. ${issue.issue}\nSolution: ${issue.solution}`).join('\n\n')}
`;
  }

  private async answerQuestion(guide: DocumentGuide, question: string, context: string): Promise<string> {
    const openai = getOpenAI();
    if (!openai) return this.generateTemplateResponse(guide);
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful government document assistant for India.
Follow these rules strictly:
1. Be highly conversational, friendly, and concise.
2. Answer based purely on the provided context about ${guide.name}.
3. Break down complex steps clearly using emojis.
4. Always provide the official application link prominently: "👉 [Apply Now](${guide.applyLink || 'https://www.india.gov.in'})".
5. Detect the user's language (e.g. Hindi, Marathi) and respond in the same language or accept direct requests to change language.
6. Use simple language if requested by the user.`,
        },
        { role: 'user', content: `Context:\n${context}\n\nUser Question: ${question}` },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });
    return response.choices[0].message.content || this.generateTemplateResponse(guide);
  }

  private async generateOverview(guide: DocumentGuide, context: string): Promise<string> {
    const openai = getOpenAI();
    if (!openai) return this.generateTemplateResponse(guide);
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful government document assistant for India. Provide a friendly, conversational guide for getting ${guide.name}. Follow these rules:
1. List required documents as bullet points.
2. Outline the exact steps using numbers.
3. Keep it under 400 words and use emojis nicely.
4. Conclude with the official application link: "👉 [Apply Now](${guide.applyLink || 'https://www.india.gov.in'})"`,
        },
        { role: 'user', content: `Provide a complete guide for getting ${guide.name}.\n\nContext:\n${context}` },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });
    return response.choices[0].message.content || this.generateTemplateResponse(guide);
  }

  private generateTemplateResponse(guide: DocumentGuide): string {
    let response = `📋 **${guide.name}**\n\n${guide.description}\n\n`;

    response += `**Required Documents:**\n`;
    guide.requiredDocuments.forEach((doc, i) => {
      response += `${i + 1}. ${doc}\n`;
    });

    response += `\n**Process Steps:**\n`;
    guide.steps.slice(0, 5).forEach((step) => {
      response += `${step.number}. **${step.title}** — ${step.description} *(${step.duration})*\n`;
    });

    response += `\n**Key Info:**\n`;
    response += `⏰ Time: ${guide.estimatedTime}\n`;
    response += `💰 Fees: ${guide.fees}\n`;
    response += `🏢 Office Visit: ${guide.officeVisitRequired ? 'Yes — ' + guide.officeVisitTiming : 'No (100% online)'}\n`;

    response += `\n**💡 Important Tips:**\n`;
    guide.tips.slice(0, 3).forEach((tip, i) => {
      response += `${i + 1}. ${tip}\n`;
    });

    if (guide.warnings.length > 0) {
      response += `\n**⚠️ Warnings:**\n`;
      guide.warnings.slice(0, 2).forEach((w, i) => {
        response += `${i + 1}. ${w}\n`;
      });
    }

    return response;
  }

  async dynamicGuide(documentName: string, language: string = 'English', simple: boolean = false): Promise<string> {
    const openai = getOpenAI();
    if (!openai) {
       return JSON.stringify({
         steps: [`Visit official portal for ${documentName}`, `Submit required documents`, `Complete verification`],
         documents: ["Aadhaar", "Identity Proof"]
       });
    }
    
    const prompt = `
Explain how to apply for ${documentName} in India.

Return response in this exactly JSON format:
{
  "steps": ["step1", "step2"],
  "documents": ["doc1", "doc2"]
}

Language: ${language}
Tone: ${simple ? "very simple, easy for beginners" : "normal"}
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      return response.choices[0].message.content || '{}';
    } catch (error) {
      console.error('Dynamic guide generation error:', error);
      return JSON.stringify({
        steps: [`Visit official portal for ${documentName}`, `Submit required documents`, `Complete verification`],
        documents: ["Aadhaar", "Identity Proof"]
      });
    }
  }
}

export default new GuidanceAgent();
