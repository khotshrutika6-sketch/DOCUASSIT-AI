import io
import re
import numpy as np
import cv2
from PIL import Image
from PIL.ExifTags import TAGS

def analyze_document_image(image_bytes: bytes) -> dict:
    """
    Analyzes document image bytes for signs of digital manipulation,
    cloning, solid paint-overs, and EXIF software signatures.
    Returns analysis details and an aggregate authenticity score.
    """
    flags_detected = []
    metadata_ok = True
    structural_ok = True
    
    # 1. METADATA SCAN (EXIF validation)
    metadata_status = "Passed"
    try:
        image = Image.open(io.BytesIO(image_bytes))
        exif_data = image.getexif()
        
        has_software_signature = False
        software_found = ""
        
        # Check standard EXIF tags
        if exif_data:
            for tag_id, value in exif_data.items():
                tag_name = TAGS.get(tag_id, str(tag_id))
                
                # Check for software or artist tags
                if tag_name in ['Software', 'Artist', 'XPAuthor', 'ImageDescription'] and isinstance(value, str):
                    val_lower = value.lower()
                    editors = ['photoshop', 'gimp', 'canva', 'pixlr', 'corel', 'inkscape', 'affinity', 
                               'snapseed', 'lightroom', 'paint.net', 'acorn', 'pixelmator', 'photoroom']
                    for editor in editors:
                        if editor in val_lower:
                            has_software_signature = True
                            software_found = value
                            break
            
        # Check PNG metadata or other format tags if no standard EXIF
        if not exif_data and hasattr(image, 'info'):
            info_str = str(image.info).lower()
            editors = ['photoshop', 'gimp', 'canva', 'pixlr', 'snapseed', 'adobe']
            for editor in editors:
                if editor in info_str:
                    has_software_signature = True
                    software_found = editor.capitalize()
                    break

        if has_software_signature:
            metadata_status = "Failed"
            metadata_ok = False
            flags_detected.append(f"Editing software signature detected: {software_found}")
        elif not exif_data or len(exif_data) == 0:
            # Not a direct fail but worthy of notice for documents which should be camera captures
            flags_detected.append("EXIF Metadata absent (common for screenshots, crops, or optimized web images)")

    except Exception as e:
        metadata_status = "Error"
        flags_detected.append(f"Failed to scan image metadata: {str(e)}")

    # 2. STRUCTURAL INTEGRITY (OpenCV Edge & Texture checks)
    structural_status = "Passed"
    integrity_score = 100
    
    try:
        # Load image in OpenCV
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            structural_status = "Failed"
            structural_ok = False
            flags_detected.append("Invalid or unreadable image format in structural analysis")
            integrity_score = 0
        else:
            h, w, c = img.shape
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # --- Check A: Paint-over/Solid Patch Detection (Texture Uniformity) ---
            # Tampering often leaves perfectly flat regions (0 standard deviation in texture)
            # where pixels were painted over to cover text.
            # We calculate local standard deviation in 7x7 windows.
            # Note: We ignore paper margin edges and completely white/black text pixels.
            # Using a sliding window or filter:
            mean, stddev = cv2.meanStdDev(gray)
            
            # Compute local standard deviation image
            local_mean = cv2.blur(gray, (7, 7))
            local_mean_sq = cv2.blur(gray ** 2, (7, 7))
            # std_dev = sqrt(E[X^2] - (E[X])^2)
            local_std = np.sqrt(np.clip(local_mean_sq - local_mean ** 2, 0, None))
            
            # Find uniform blocks in the document (standard deviation < 0.8)
            # but avoid pure white/pure black background sheets
            suspicious_mask = (local_std < 0.8) & (gray > 15) & (gray < 240)
            
            # Count uniform pixel ratio
            suspicious_ratio = np.sum(suspicious_mask) / (h * w)
            
            # If suspicious uniform pixels cover > 2% of the image in isolated patches
            if suspicious_ratio > 0.02:
                # Group them to check if they form solid blocks (potential text erasure patches)
                # Dilate and erode to check connection
                kernel = np.ones((5, 5), np.uint8)
                dilated = cv2.dilate(suspicious_mask.astype(np.uint8), kernel, iterations=2)
                contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                
                large_patches = 0
                for cnt in contours:
                    area = cv2.contourArea(cnt)
                    # A patch larger than 400 pixels (e.g. 20x20) with absolute flat texture
                    if area > 400:
                        large_patches += 1
                
                if large_patches > 0:
                    integrity_score -= min(30, large_patches * 10)
                    flags_detected.append(f"Detected {large_patches} suspicious flat texture block(s) (potential digital paint-over / text erasure)")
            
            # --- Check B: Edge Sharpness / Digital Text Overlays ---
            # Natural scans/photos have soft text edges with camera blur or printing halftone.
            # Digitally overlayed text has sharp 1-pixel transitions.
            # Compute Sobel gradients
            sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
            sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
            grad_mag = np.sqrt(sobelx**2 + sobely**2)
            
            # Find strong edges (e.g. gradient magnitude > 100)
            strong_edge_mask = grad_mag > 120
            
            if np.sum(strong_edge_mask) > 100:
                # Analyze edge gradient profile widths
                # Digital text edges go from min to max in exactly 1 pixel
                # We can check the standard deviation of local gradients.
                # Here, we calculate how many edges have "infinite sharpness".
                # A simple measure is the ratio of high gradients that do not fade in 3x3 neighborhood
                # In digital overlays, high gradient magnitude pixels are extremely thin and sparse
                # without the surrounding low-gradient decay zone.
                # Compute gradient decay ratio:
                local_max = cv2.dilate(grad_mag, np.ones((3,3), np.uint8))
                thin_edges = (grad_mag > 150) & (grad_mag == local_max)
                
                ratio_thin = np.sum(thin_edges) / np.sum(strong_edge_mask)
                
                # If ratio of extremely sharp/thin edges is high (e.g. > 15%)
                if ratio_thin > 0.15:
                    penalty = int((ratio_thin - 0.10) * 100)
                    integrity_score -= min(25, penalty)
                    flags_detected.append("Unnatural edge sharpness found (indicators of digital text injection or overlay)")

    except Exception as e:
        structural_status = "Error"
        flags_detected.append(f"Failed structural integrity analysis: {str(e)}")
        integrity_score = 50

    # Clean up integrity score range
    integrity_score = max(0, min(100, integrity_score))
    if integrity_score < 75:
        structural_status = "Failed"
        structural_ok = False

    # 3. AGGREGATE SCORE CALCULATION
    # Metadata holds 40% weight, Structural holds 60%
    metadata_score = 100 if metadata_ok else 30
    
    # Adjust metadata score for missing metadata (slight warning but not failure)
    if metadata_ok and any("EXIF Metadata absent" in f for f in flags_detected):
        metadata_score = 90
        
    final_score = int((metadata_score * 0.4) + (integrity_score * 0.6))
    
    # Enforce range limits
    final_score = max(0, min(100, final_score))

    return {
        "status": "success",
        "authenticityScore": final_score,
        "analysis": {
            "metadataCheck": metadata_status,
            "structuralIntegrity": structural_status,
            "flagsDetected": flags_detected
        }
    }
