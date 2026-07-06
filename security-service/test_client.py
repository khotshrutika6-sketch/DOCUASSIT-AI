import os
import sys
import json
import urllib.request
import urllib.error
from PIL import Image, ImageDraw

def create_test_image(filename="test_sample.jpg"):
    """Generates a simple dummy document image for testing."""
    print(f"[IMAGE] Generating test image: {filename}...")
    # Create a simple grey canvas mimicking a scanned document
    img = Image.new('RGB', (400, 300), color=(240, 240, 240))
    d = ImageDraw.Draw(img)
    
    # Draw some mock text blocks
    d.text((20, 30), "REPUBLIC OF INDIA", fill=(10, 10, 10))
    d.text((20, 80), "Document ID: 8829-1092-2291", fill=(10, 10, 10))
    
    # Simulate a suspicious digital paint-over (solid grey patch with no noise)
    d.rectangle([150, 150, 280, 180], fill=(200, 200, 200))
    d.text((160, 155), "TAMPERED TEXT", fill=(0, 0, 255))
    
    img.save(filename, "JPEG")
    print(f"[IMAGE] Created {filename} ({os.path.getsize(filename)} bytes).")

def send_verify_request(filename="test_sample.jpg", url="http://127.0.0.1:8000/api/verify-document"):
    """Sends the test image to the FastAPI server using standard multipart/form-data."""
    print(f"[CLIENT] Sending request to {url}...")
    
    if not os.path.exists(filename):
        print(f"[ERROR] file {filename} not found.")
        sys.exit(1)
        
    try:
        with open(filename, 'rb') as f:
            file_data = f.read()
            
        boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
        
        # Build multipart payload
        parts = []
        parts.append(f'--{boundary}'.encode())
        parts.append(f'Content-Disposition: form-data; name="file"; filename="{filename}"'.encode())
        parts.append('Content-Type: image/jpeg'.encode())
        parts.append(''.encode())  # Empty line before data
        parts.append(file_data)
        parts.append(f'--{boundary}--'.encode())
        parts.append(''.encode())
        
        body = b'\r\n'.join(parts)
        
        req = urllib.request.Request(url, data=body)
        req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
        req.add_header('Content-Length', str(len(body)))
        
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            parsed = json.loads(res_body)
            print("\n[RESPONSE] RECEIVED JSON:")
            print(json.dumps(parsed, indent=2))
            
    except urllib.error.URLError as e:
        print(f"\n[ERROR] Request failed: {e}")
        print("💡 Make sure the FastAPI microservice is running! Run: uvicorn main:app --port 8000")
    except Exception as e:
        print(f"\n[ERROR] Error processing request: {e}")

if __name__ == "__main__":
    create_test_image()
    send_verify_request()
