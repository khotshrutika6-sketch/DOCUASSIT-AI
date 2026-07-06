# DocuVerify Fraud Detector Microservice

A clean, lightweight Python FastAPI microservice that processes uploaded document images and analyzes them for digital manipulation, cloning, or canvas tampering.

## Core Features & Heuristics

1. **Metadata EXIF Scan**: Evaluates the image header blocks for signatures of graphic editors like Adobe Photoshop, GIMP, Canva, Snapseed, or Lightroom.
2. **Texture/Edge Uniformity (Paint-over Detection)**: Scans the local standard deviation of pixel values in a 7x7 sliding window. Digital paint-overs or copy-paste overlays leave behind regions with zero texture noise (standard deviation < 0.8), which are detected and flagged.
3. **Edge Gradient Decay Analysis (Text Injection Check)**: Analyzes the sharpness of text borders. Natural scans/photos show smooth gradient decay due to printer halftoning and camera blur. Injected digital text exhibits vertical/horizontal edges of absolute thickness (1-pixel width, infinite gradient) which are quantified.

---

## Installation & Setup

1. **Open your terminal** and navigate to this folder:
   ```bash
   cd security-service
   ```

2. **Install the dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the microservice**:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
   The service will launch at `http://127.0.0.1:8000`.

---

## API Documentation

### POST `/api/verify-document`
Sends a file multipart request for fraud check.

**Parameters**:
- `file`: Image file (JPEG, PNG, WebP)

**Response**:
```json
{
  "status": "success",
  "fileName": "test_sample.jpg",
  "authenticityScore": 62,
  "analysis": {
    "metadataCheck": "Passed",
    "structuralIntegrity": "Failed",
    "flagsDetected": [
      "EXIF Metadata absent (common for screenshots, crops, or optimized web images)",
      "Detected 1 suspicious flat texture block(s) (potential digital paint-over / text erasure)",
      "Unnatural edge sharpness found (indicators of digital text injection or overlay)"
    ]
  }
}
```

---

## Quick Testing

To run the automated verification client script while the server is running on port 8000:
```bash
python test_client.py
```
This generates a mock image `test_sample.jpg` with simulated clone stamp overlays, submits it to your endpoint, and displays the response JSON analysis.
