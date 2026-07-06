import { useState, useRef, useEffect } from 'react';
import { Upload, Download, Sliders, Image as ImageIcon, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function DocumentScanner() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressedSrc, setCompressedSrc] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.7);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(50);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [cropAspect, setCropAspect] = useState<'passport' | 'free'>('passport');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG).');
      return;
    }

    setErrorMsg(null);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      setCompressedSrc(null);
    };
    reader.readAsDataURL(file);
  };

  // Run compression logic
  const compressImage = async () => {
    if (!imageSrc || !canvasRef.current) return;
    setIsCompressing(true);

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      originalImageRef.current = img;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = img.width;
      let height = img.height;

      // Handle passport crop aspect ratio (3.5 : 4.5)
      if (cropAspect === 'passport') {
        const targetAspect = 3.5 / 4.5;
        const currentAspect = width / height;

        let cropWidth = width;
        let cropHeight = height;
        let startX = 0;
        let startY = 0;

        if (currentAspect > targetAspect) {
          // Crop width
          cropWidth = height * targetAspect;
          startX = (width - cropWidth) / 2;
        } else {
          // Crop height
          cropHeight = width / targetAspect;
          startY = (height - cropHeight) / 2;
        }

        // Standard passport print resolution (e.g. 350x450 for display and compress)
        canvas.width = 350;
        canvas.height = 450;
        ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, 350, 450);
      } else {
        // Free size (maintain aspect, scale down if extremely huge to save memory)
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height * maxDim) / width;
            width = maxDim;
          } else {
            width = (width * maxDim) / height;
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Dynamic search for target quality
      // We will perform a quick iteration to match the target KB
      let minQ = 0.01;
      let maxQ = 0.99;
      let bestSrc = '';
      let bestSize = 0;

      for (let i = 0; i < 6; i++) {
        const q = (minQ + maxQ) / 2;
        const dataUrl = canvas.toDataURL('image/jpeg', q);
        const size = Math.round((dataUrl.length * 3) / 4); // Estimate size from base64

        if (size / 1024 <= targetSizeKb) {
          bestSrc = dataUrl;
          bestSize = size;
          minQ = q; // Try to go higher quality
        } else {
          maxQ = q; // Go lower quality
          if (!bestSrc) {
            bestSrc = dataUrl;
            bestSize = size;
          }
        }
      }

      // If even lowest quality is above target, scale canvas resolution down and re-run
      if (bestSize / 1024 > targetSizeKb * 1.2 && cropAspect === 'free') {
        canvas.width = canvas.width * 0.7;
        canvas.height = canvas.height * 0.7;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        bestSrc = canvas.toDataURL('image/jpeg', 0.5);
        bestSize = Math.round((bestSrc.length * 3) / 4);
      }

      setCompressedSrc(bestSrc);
      setCompressedSize(bestSize);
      setIsCompressing(false);
    };
  };

  // Re-run compression when parameters change
  useEffect(() => {
    if (imageSrc) {
      compressImage();
    }
  }, [imageSrc, cropAspect, targetSizeKb]);

  const handleDownload = () => {
    if (!compressedSrc) return;
    const link = document.createElement('a');
    link.href = compressedSrc;
    link.download = `compressed_doc_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetScanner = () => {
    setImageSrc(null);
    setCompressedSrc(null);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="glass-card bg-white/[0.02] border-white/10 p-8 rounded-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
          📸
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Smart Document Scanner & Compressor</h2>
          <p className="text-textSecondary text-sm">Resize, crop to passport specs, and compress images client-side completely privately.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!imageSrc ? (
        <div className="space-y-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 hover:border-primary/40 rounded-2xl p-12 text-center cursor-pointer transition-colors group bg-white/[0.01] hover:bg-white/[0.03]"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <Upload className="w-12 h-12 text-textMuted group-hover:text-primary transition-colors mx-auto mb-4" />
            <h3 className="text-lg font-black text-white mb-2">Upload Document Photo</h3>
            <p className="text-textSecondary text-xs max-w-sm mx-auto">
              Drag and drop or click to browse. Supports JPEG and PNG files. Your files never leave your browser.
            </p>
          </div>

          {/* Official Indian Photo Guidelines Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>📋</span> Official Indian Photo Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-textSecondary">
              <div className="space-y-2">
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Background:</strong> Plain white or off-white background only. No shadows or patterns.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Dimensions:</strong> 35mm x 45mm (3.5cm x 4.5cm) with face covering 70-80% of the image.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Expression:</strong> Neutral facial expression with eyes open and mouth completely closed.</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Contrast:</strong> Wear dark colored clothes that stand out against the white background.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Glasses & Headgear:</strong> No tinted glasses. Headgear is permitted only for religious reasons.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>File Size Limits:</strong> Passport Seva portal requires 20KB - 50KB. PAN & Aadhaar require under 100KB.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Side */}
          <div className="space-y-6">
            <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center h-80 relative">
              <img 
                src={imageSrc} 
                alt="Source preview" 
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 rounded-full border border-white/10 text-xs text-white">
                Original: {formatSize(originalSize)}
              </div>
            </div>

            {/* Adjustments */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" /> Adjustment Panel
                </span>
                <button 
                  onClick={resetScanner} 
                  className="text-xs text-textSecondary hover:text-red-400 font-bold transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Image
                </button>
              </div>

              {/* Crop Ratio Selector */}
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-3">Crop Dimensions</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCropAspect('passport')}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                      cropAspect === 'passport' 
                        ? 'border-primary bg-primary/10 text-white shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                        : 'border-white/10 bg-white/5 text-textSecondary hover:text-white'
                    }`}
                  >
                    🛂 Indian Passport (3.5x4.5)
                  </button>
                  <button
                    onClick={() => setCropAspect('free')}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                      cropAspect === 'free' 
                        ? 'border-primary bg-primary/10 text-white shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                        : 'border-white/10 bg-white/5 text-textSecondary hover:text-white'
                    }`}
                  >
                    📐 Free Aspect / Full Document
                  </button>
                </div>
              </div>

              {/* Target File Size Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black text-textSecondary uppercase tracking-widest">Target Size Limit</label>
                  <span className="text-sm font-black text-primary">{targetSizeKb} KB</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="500" 
                  step="10"
                  value={targetSizeKb}
                  onChange={(e) => setTargetSizeKb(parseInt(e.target.value))}
                  className="w-full accent-primary bg-white/10 h-2 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-textMuted block mt-2">
                  * Government sites commonly reject files exceeding 50KB or 100KB limits.
                </span>
              </div>
            </div>
          </div>

          {/* Compressed Output Side */}
          <div className="flex flex-col h-full justify-between space-y-6">
            <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/5 flex flex-col items-center justify-center h-80 relative">
              {isCompressing ? (
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                  <span className="text-xs text-textSecondary uppercase tracking-widest font-black">Compressing...</span>
                </div>
              ) : compressedSrc ? (
                <>
                  <img 
                    src={compressedSrc} 
                    alt="Compressed result" 
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-green-500/80 rounded-full border border-green-400 text-xs text-white font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Ready: {formatSize(compressedSize)}
                  </div>
                </>
              ) : (
                <div className="text-center text-textMuted p-6">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Configuring compression parameters...</p>
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-black text-white">Compression Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm py-2 border-b border-white/5">
                  <span className="text-textSecondary font-medium">Original File Size:</span>
                  <span className="text-white font-bold">{formatSize(originalSize)}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-white/5">
                  <span className="text-textSecondary font-medium">Compressed Output Size:</span>
                  <span className="text-green-400 font-bold">{formatSize(compressedSize)}</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-textSecondary font-medium">Size Reduction Rate:</span>
                  <span className="text-primary font-bold">
                    {originalSize > 0 
                      ? `${Math.max(0, ((originalSize - compressedSize) / originalSize * 100)).toFixed(0)}%` 
                      : '0%'}
                  </span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                disabled={!compressedSrc || isCompressing}
                className="w-full btn-premium py-4 text-base font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" /> Download Compressed JPG
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
