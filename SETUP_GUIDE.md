# 🚀 Quick Setup Guide - DocuFast AI

## ⚡ 5-Minute Setup (Hackathon Mode)

### Step 1: Install Backend Dependencies (2 min)

```bash
cd backend
pnpm install
```

### Step 2: Get OpenAI API Key (1 min)

1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

### Step 3: Configure API Key (30 sec)

Edit `backend/.env`:
```env
OPENAI_API_KEY=sk-paste-your-key-here
PORT=5000
```

### Step 4: Start Backend (30 sec)

```bash
cd backend
pnpm run dev
```

You should see:
```
🚀 DocuFast AI Backend running on port 5000
📡 Health check: http://localhost:5000/health
```

### Step 5: Test Backend (30 sec)

Open browser: `http://localhost:5000/health`

Should show:
```json
{"status":"ok","message":"DocuFast AI Backend Running"}
```

### Step 6: Use the App! (30 sec)

The frontend is already running in Figma Make. You can use TWO modes:

**Mode 1: Document Guide** (Default)
1. Search for any document (e.g., "passport")
2. Click on a document card
3. View complete step-by-step guide

**Mode 2: Document Verification**
1. Click "Verify Document" tab
2. Upload a document image
3. Click "Verify Document" to analyze

---

## 📸 Sample Test Images

For demo purposes, you can use:
- Any government ID photo from your phone
- Screenshot of a document
- Sample images from Google Images (search "aadhar card sample")

⚠️ **Privacy Note**: The app processes images locally. For hackathon demo, use sample/test documents only.

---

## 🐛 Common Issues

### "Cannot find module" error:
```bash
cd backend
rm -rf node_modules
pnpm install
```

### "Network error" in frontend:
- Check backend is running on port 5000
- Open browser DevTools → Network tab to see the error

### "OpenAI API key invalid":
- Double-check you copied the full key (starts with `sk-`)
- Make sure there are no extra spaces
- Verify you saved the `.env` file

### OCR taking too long:
- First run downloads Tesseract model (~50MB) - takes 30-60 sec
- Subsequent runs are faster (5-10 sec)

---

## 🎯 Testing Checklist

Before your hackathon demo:

### Backend
- [ ] Backend starts without errors
- [ ] Health check returns OK at `http://localhost:5000/health`

### Guidance Agent (Main Feature!)
- [ ] Search bar appears on "Document Guide" tab
- [ ] Can search for "passport" - shows results
- [ ] Can click on Passport card
- [ ] Full guide displays with:
  - [ ] AI-generated overview
  - [ ] Required documents list
  - [ ] Step-by-step process
  - [ ] Tips & warnings
- [ ] Back button works
- [ ] Can search for other documents

### Verification Agent
- [ ] Can switch to "Verify Document" tab
- [ ] Can select document type
- [ ] Can upload image (drag & drop works)
- [ ] Verify button appears after upload
- [ ] Processing shows loader
- [ ] Results display (issues, suggestions, extracted data)

---

## 🔥 Pro Tips for Demo

1. **Pre-test everything** - Upload a test image before judges arrive
2. **Keep backend running** - Don't close the terminal
3. **Have backup images ready** - 2-3 different document types
4. **Show the code** - Judges love seeing clean TypeScript code
5. **Explain multi-agent** - Even though we only built one agent, explain the scalable architecture

---

## 📞 Need Help?

1. Check browser console (F12)
2. Check backend terminal for errors
3. Restart backend server
4. Clear browser cache

---

**Good luck! 🚀 You've got this!**
