# DocuFast AI - Multi-Agent Document Assistant

🔥 **Hackathon-Ready MVP** - AI-powered document verification system with multi-agent architecture

## 🚀 Features

### 🤖 Multi-Agent System

#### 1. **Document Verification Agent**
- AI-powered validation of document completeness and authenticity
- Smart OCR with Tesseract.js for text extraction
- Multi-document support: Aadhar, PAN, Passport, Income Certificate, Driving License
- Real-time analysis with confidence scores
- Actionable suggestions for fixing issues

#### 2. **Guidance Agent** ⭐ NEW!
- Complete step-by-step guides for obtaining any government document
- AI-powered conversational assistance (OpenAI GPT-4)
- Comprehensive information:
  - Required documents checklist
  - Detailed process steps (online/offline indicators)
  - Office visit timing & requirements
  - Pro tips from real experiences
  - Common issues & solutions
- Smart search functionality
- 5 pre-loaded document guides ready to use

## 🏗️ Architecture

```
Frontend (React + Tailwind) ──→ Backend (Node.js + TypeScript) ──→ AI Agents
                                          ├── OCR Service (Tesseract.js)
                                          └── Verification Agent (OpenAI GPT-4)
```

## 📦 Installation & Setup

### 1. Backend Setup

```bash
cd backend
pnpm install
```

### 2. Configure OpenAI API Key

Edit `backend/.env`:
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Start Backend Server

```bash
cd backend
pnpm run dev
```

Backend will run on `http://localhost:5000`

### 4. Frontend (Already Running)

The Figma Make frontend is already running. Just refresh your preview!

## 🎯 How to Use

### Mode 1: Document Guide (Guidance Agent)

1. **Search for Document** - Type "passport", "driving license", etc. or click popular searches
2. **Select Document** - Click on any document card to view full guide
3. **Get Complete Guidance** - View:
   - AI-generated overview
   - Required documents
   - Step-by-step process
   - Tips, warnings, and solutions to common issues

### Mode 2: Document Verification

1. **Select Document Type** - Choose from Aadhar, PAN, Passport, etc.
2. **Upload Image** - Drag & drop or click to upload document image
3. **Verify** - Click "Verify Document" button
4. **Get Results** - View verification status, extracted data, issues, and suggestions

**Toggle between modes** using the navigation tabs at the top!

## 🧠 AI Agents (Multi-Agent System)

### ✅ Currently Implemented:
1. **Document Verification Agent** - Validates document quality and completeness using AI
2. **Guidance Agent** - Provides step-by-step process guides with AI-powered assistance
3. **OCR Service** - Extracts text from images using Tesseract.js

### 🔮 Future Agents (Scalable Architecture):
- 📋 Form Filling Agent
- 📍 Process Navigator Agent (with location-based suggestions)
- ⏰ Reminder & Tracking Agent
- 📊 Analytics Agent
- 💬 WhatsApp/SMS Communication Agent

## 🎤 Hackathon Demo Script

### Part 1: The Problem (30 sec)
"In India, getting government documents is confusing:
- People don't know what documents to bring
- They don't know the process
- Applications get rejected due to simple mistakes
- **40% rejection rate** costs time and money"

### Part 2: The Solution - Guidance Agent (2 min)
1. **Click "Document Guide" tab**
2. **Search "Passport"** - instant results
3. **Click to view guide** - show comprehensive information:
   - AI-generated friendly overview
   - Complete checklist of required documents
   - Step-by-step process with timing
   - Pro tips & warnings
4. **Highlight**: "All powered by OpenAI GPT-4"

### Part 3: The Solution - Verification Agent (1.5 min)
1. **Switch to "Verify Document" tab**
2. **Upload sample document** image
3. **Click Verify** - show processing
4. **Show Results**: Extracted data, issues detected, actionable suggestions

### Part 4: The Tech (30 sec)
"Multi-agent architecture:
- ✅ Guidance Agent (implemented)
- ✅ Verification Agent (implemented)
- ✅ OCR Service (implemented)
- 🔮 Scalable to add Form Filling, Reminders, Analytics agents

**TypeScript + OpenAI + React = Production-ready**"

## 📁 Project Structure

```
docufast-ai/
├── frontend/                 # React + Tailwind (Figma Make)
│   └── src/app/
│       ├── App.tsx          # Main application
│       ├── components/      # UI components
│       └── services/        # API integration
│
├── backend/                 # Node.js + TypeScript
│   └── src/
│       ├── app.ts          # Express server
│       ├── data/
│       │   └── documentGuides.json        # Knowledge base (5 documents)
│       ├── controllers/
│       │   ├── documentController.ts      # Verification endpoints
│       │   └── guidanceController.ts      # Guidance endpoints
│       ├── routes/
│       │   ├── documentRoutes.ts          # /api/documents
│       │   └── guidanceRoutes.ts          # /api/guidance
│       └── services/
│           ├── ocrService.ts              # Tesseract OCR
│           └── ai/
│               ├── verificationAgent.ts   # Document verification
│               └── guidanceAgent.ts       # Process guidance
│
└── README.md
```

## 🔑 Key Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, TypeScript
- **AI**: OpenAI GPT-4 Turbo
- **OCR**: Tesseract.js
- **File Upload**: Multer

## 🐛 Troubleshooting

### Backend won't start:
```bash
cd backend
pnpm install
# Make sure .env has valid OPENAI_API_KEY
pnpm run dev
```

### "Network error" in frontend:
- Ensure backend is running on `http://localhost:5000`
- Check browser console for errors
- Verify CORS is enabled (it is by default)

### OCR is slow:
- Normal! OCR processing takes 5-15 seconds
- Show the "Processing..." loader to judges

## 💡 Tips for Judges

**Why Multi-Agent?**
"We designed a modular multi-agent architecture where each agent specializes in one task. Today we're demoing the Document Verification Agent, but the system is scalable to add Form Filling, Guidance, and Reminder agents."

**Real-World Impact:**
"In India, 40% of government document applications are rejected due to errors. DocuFast AI reduces this by providing instant verification and guidance."

**Technical Highlights:**
- TypeScript for type safety
- Multi-agent architecture (scalable)
- OpenAI GPT-4 integration
- Real-time OCR processing
- Production-ready error handling

## 🏆 Next Steps (If You Have Time)

1. Add WhatsApp integration for notifications
2. Add Form Filling Agent (pre-fill PDFs)
3. Add multilingual support (Hindi, Marathi)
4. Deploy frontend to Vercel
5. Deploy backend to Railway/Render

## 📝 License

MIT - Built for hackathons and learning

---

**Made with ❤️ for improving government document processes**
