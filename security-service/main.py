from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from utils.fraud_detector import analyze_document_image

app = FastAPI(
    title="DocuVerify API",
    description="Microservice for document manipulation and forgery fraud checking.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits access from local Vite and Express ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "DocuVerify Fraud Detector Microservice",
        "endpoints": {
            "verify": "POST /api/verify-document"
        }
    }

@app.post("/api/verify-document")
async def verify_document(file: UploadFile = File(...)):
    # Validate file format
    allowed_content_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    if file.content_type not in allowed_content_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file format: {file.content_type}. Only JPEG, PNG, and WebP are allowed."
        )
    
    try:
        # Read uploaded image bytes
        image_bytes = await file.read()
        
        # Analyze image
        result = analyze_document_image(image_bytes)
        
        # Formulate response format
        return {
            "status": "success",
            "fileName": file.filename,
            "authenticityScore": result["authenticityScore"],
            "analysis": result["analysis"]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during verification processing: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
