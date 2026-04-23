# 📚 Available Document Guides

Your DocuFast AI system comes pre-loaded with **5 comprehensive document guides**.

---

## 1. 🛂 Passport

**Category:** Identity Document  
**Process Type:** Hybrid (online + office visit)  
**Estimated Time:** 15-30 days  
**Fees:** ₹1,500 (Normal), ₹3,500 (Tatkal)

**What's Included:**
- 5 required documents (Aadhaar, PAN, Birth Certificate, etc.)
- 7-step process (registration → delivery)
- Office visit required after booking appointment
- 5 pro tips
- 3 important warnings
- 2 common issues with solutions

**Search Terms:** `passport`, `international travel`, `visa document`

---

## 2. 🚗 Driving License

**Category:** Transport Document  
**Process Type:** Hybrid (online + RTO visit)  
**Estimated Time:** 45-60 days  
**Fees:** ₹200 (non-transport), ₹1,000 (transport)

**What's Included:**
- 6 required documents
- 7-step process (including learner's license)
- **30-day mandatory wait** after learner's license
- RTO driving test required
- 5 pro tips
- 3 warnings
- 2 common issues with solutions

**Search Terms:** `driving license`, `DL`, `vehicle permit`, `learner's license`

---

## 3. 💳 PAN Card

**Category:** Tax Document  
**Process Type:** 100% Online  
**Estimated Time:** 10 minutes (e-PAN), 15 days (physical)  
**Fees:** FREE (e-PAN), ₹107 (physical)

**What's Included:**
- 4 required documents (Aadhaar for e-PAN)
- 6-step process
- **No office visit required** (100% online!)
- Instant e-PAN option available
- 5 pro tips
- 3 warnings
- 2 common issues with solutions

**Search Terms:** `PAN card`, `PAN`, `tax ID`, `permanent account number`

---

## 4. 🆔 Aadhaar Card

**Category:** Identity Document  
**Process Type:** Hybrid (walk-in + online download)  
**Estimated Time:** 60-90 days  
**Fees:** FREE

**What's Included:**
- 2 required documents (Address proof + DOB proof)
- 7-step process
- Walk-in enrollment (no appointment needed)
- Biometric capture at center
- 5 pro tips
- 3 warnings
- 2 common issues with solutions

**Search Terms:** `aadhaar`, `aadhar`, `UID`, `unique ID`

---

## 5. 📋 Income Certificate

**Category:** Government Certificate  
**Process Type:** Hybrid (online + verification)  
**Estimated Time:** 15-30 days  
**Fees:** ₹20-50 (varies by state)

**What's Included:**
- 6 required documents (Aadhaar, salary slips, bank statements, etc.)
- 8-step process
- State-specific process (e-District portal)
- Revenue officer verification
- 5 pro tips
- 3 warnings
- 2 common issues with solutions

**Search Terms:** `income certificate`, `income proof`, `salary certificate`

---

## 📊 Summary

| Document | Process Type | Time | Fees | Office Visit? |
|----------|-------------|------|------|---------------|
| Passport | Hybrid | 15-30 days | ₹1,500 | Yes |
| Driving License | Hybrid | 45-60 days | ₹200 | Yes (RTO) |
| PAN Card | Online | 10 min | FREE | No |
| Aadhaar | Hybrid | 60-90 days | FREE | Yes (enrollment) |
| Income Cert | Hybrid | 15-30 days | ₹20-50 | No (usually) |

---

## 🔧 How to Add More Documents

Want to add more guides? Easy!

### Option 1: Edit JSON File (Quick)

1. Open: `/backend/src/data/documentGuides.json`
2. Copy existing document structure
3. Fill in details for new document
4. Restart backend

### Option 2: Use AI to Generate (Recommended)

1. Ask ChatGPT:
   ```
   Create a detailed document guide for [DOCUMENT_NAME] in India.
   Include: description, required documents (list), steps (array with 
   number/title/description/duration/online), processType, 
   officeVisitRequired, timing, fees, tips, warnings, commonIssues.
   Format as JSON matching this structure: [paste example]
   ```

2. Add to `documentGuides.json`
3. Restart backend

### Documents You Could Add:
- 📜 Birth Certificate
- 📜 Death Certificate
- 🗳️ Voter ID
- 🎓 Character Certificate
- 🏡 Property Registration
- 💍 Marriage Certificate
- 🏥 Health Card
- 🎓 Education Certificate Verification
- 🚌 Student Bus Pass
- 📱 Mobile Number Porting

---

## 💡 Tips for Demo

### Showcase Document Diversity

Show 2-3 different documents during demo:

1. **PAN Card** - to show "100% online, instant process"
2. **Passport** - to show "comprehensive, multi-step process"
3. **Driving License** - to show "practical tips for test"

This demonstrates your system handles different process types!

### Highlight AI Intelligence

When showing a guide, point out:
- "AI generated this friendly overview"
- "These tips come from real user experiences"
- "Common issues section prevents rejections"

---

**Ready to impress judges with 5 comprehensive, production-ready document guides! 🚀**
