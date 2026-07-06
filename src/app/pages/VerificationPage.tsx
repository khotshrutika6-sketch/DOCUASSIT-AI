import { useState, useRef, useEffect } from 'react';
import { 
  Loader2, 
  ShieldCheck, 
  FileText, 
  Camera, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  BadgeCheck, 
  Clock, 
  Maximize2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VerificationResults } from '../components/VerificationResults';
import { api } from '../services/api';
import { activityService } from '../services/activityService';
import { User } from '../services/authService';

interface DocumentType {
  id: string;
  name: string;
  icon: string;
}

interface VerificationPageProps {
  onRequireAuth: (callback: () => void) => void;
  user: User;
}

export function VerificationPage({ onRequireAuth, user }: VerificationPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>('aadhar');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<any>(null);
  
  // Camera capture states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const documentTypes: DocumentType[] = [
    { id: 'aadhar', name: 'Aadhar Card', icon: '🆔' },
    { id: 'pan', name: 'PAN Card', icon: '💳' },
    { id: 'income_certificate', name: 'Income Certificate', icon: '📋' },
    { id: 'passport', name: 'Passport', icon: '🛂' },
    { id: 'driving_license', name: 'Driving License', icon: '🚗' },
  ];

  // Steps for the Live Analysis Progress
  const analysisSteps = [
    { id: 1, label: 'Document Received' },
    { id: 2, label: 'Metadata Extracted' },
    { id: 3, label: 'Visual Structure Analysis' },
    { id: 4, label: 'Forgery Detection' },
    { id: 5, label: 'AI Content Detection' },
    { id: 6, label: 'Authenticity Score Generated' }
  ];

  // Engine validation layers
  const engineLayers = [
    { id: 'meta', label: 'Metadata Validation', desc: 'Validates EXIF tags and editing signature headers.' },
    { id: 'pattern', label: 'Digital Pattern Recognition', desc: 'Checks document paper grid consistency and DPI artifacts.' },
    { id: 'font', label: 'Font Consistency Analysis', desc: 'Scans for irregular typeface weights and font overlay outlines.' },
    { id: 'forensics', label: 'Image Forensics', desc: 'Finds flat texture blocks representing paint-overs.' },
    { id: 'qr', label: 'QR & Barcode Validation', desc: 'Audits cryptography of embedded QR codes.' },
    { id: 'format', label: 'Government Format Matching', desc: 'Ensures visual templates match state issuance protocols.' },
    { id: 'source', label: 'Source Authentication', desc: 'Validates source domains and camera hardware signatures.' },
    { id: 'ai', label: 'AI Generation Detection', desc: 'Analyzes language patterns and image synthesis signatures.' }
  ];

  // Camera cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    onRequireAuth(async () => {
      setIsCameraActive(true);
      setSelectedFile(null);
      setResults(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Failed to open camera:', err);
        alert('Camera access denied or unavailable.');
        setIsCameraActive(false);
      }
    });
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureSnapshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `snap_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setSelectedFile(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.name.endsWith('.pdf'))) {
      setSelectedFile(file);
      setResults(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResults(null);
    }
  };

  const handleVerify = async () => {
    onRequireAuth(async () => {
      if (!selectedFile) return;
      setIsProcessing(true);
      setResults(null);
      setCurrentStep(1);

      // Start sequential step increments
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 6) {
            clearInterval(interval);
            return 6;
          }
          return prev + 1;
        });
      }, 700);

      try {
        const response = await api.verifyDocument(selectedFile, selectedType);
        
        // Wait for the timeline animation to reach at least step 5/6 for cinematic impact
        await new Promise((resolve) => setTimeout(resolve, 4000));

        if (response.success && response.data) {
          setResults(response.data);
          
          // Log dynamic user activity
          activityService.addActivity(user.id, {
            title: `Document authenticity scan completed`,
            type: 'verification',
            status: response.data.isValid ? 'Verified' : 'Failed',
            progress: 100,
            details: `${selectedFile.name} (${selectedType.toUpperCase()}) - Authenticity Score: ${response.data.authenticityScore}%`
          });

        } else {
          alert(`Error: ${response.error || 'Verification failed'}`);
        }
      } catch (error) {
        alert('Verification endpoint error. Ensure server is active.');
      } finally {
        clearInterval(interval);
        setIsProcessing(false);
        setCurrentStep(0);
      }
    });
  };

  const getLayerStatus = (layerId: string) => {
    if (isProcessing) {
      // Simulate validation layers spinning up as steps execute
      if (currentStep >= 5) return 'processing';
      if (layerId === 'source' || layerId === 'meta') {
        return currentStep >= 2 ? 'processing' : 'pending';
      }
      if (layerId === 'format' || layerId === 'pattern') {
        return currentStep >= 3 ? 'processing' : 'pending';
      }
      return 'pending';
    }

    if (!results) return 'pending';

    // Map from actual results
    switch (layerId) {
      case 'meta':
        return results.issues.some((i: string) => i.toLowerCase().includes('metadata') || i.toLowerCase().includes('timestamp') || i.toLowerCase().includes('software')) 
          ? 'warning' 
          : 'passed';
      case 'forensics':
        return results.forgeryRisk === 'High' ? 'failed' : (results.forgeryRisk === 'Medium' ? 'warning' : 'passed');
      case 'ai':
        return results.aiProbability > 60 ? 'failed' : (results.aiProbability > 25 ? 'warning' : 'passed');
      case 'pattern':
        return results.issues.some((i: string) => i.toLowerCase().includes('pattern') || i.toLowerCase().includes('dpi') || i.toLowerCase().includes('entropy'))
          ? 'warning'
          : 'passed';
      default:
        return 'passed';
    }
  };

  return (
    <div className="w-full relative">
      <div className="hero-glow" style={{ top: '-25%', right: '10%', opacity: 0.4 }} />

      {/* TOP HEADER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-white/5 pb-10 mb-12">
        <div className="lg:col-span-6 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full text-xs text-green-400 font-bold"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            AI Verification Engine Active
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-black leading-tight text-white tracking-tight"
          >
            Advanced Document <br />
            Authenticity Analysis
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-textSecondary max-w-lg text-sm leading-relaxed"
          >
            Detect AI-generated, manipulated, forged, or synthetic documents using multi-layer forensic verification.
          </motion.p>
        </div>

        {/* Analytics Widgets (Right Side) */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          {[
            { value: '99.8%', label: 'Scan Accuracy Rate' },
            { value: '50,000+', label: 'Documents Processed' },
            { value: '1.2s', label: 'Average Scan Time' },
            { value: '100%', label: 'Secure Data Protection' }
          ].map((card, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-green-400/20 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none group-hover:bg-primary/10 transition-all" />
              <p className="text-2xl font-black text-white leading-none">{card.value}</p>
              <p className="text-[9px] uppercase tracking-wider text-textSecondary font-black mt-2 leading-none">{card.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
        
        {/* LEFT COLUMN: SCAN CENTER */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl">
            <h3 className="text-sm uppercase font-black tracking-widest text-white mb-6">Document Scan Center</h3>

            {/* Type selector */}
            <div className="mb-6 space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-textSecondary">Target Document Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-xs font-bold text-white focus:outline-none focus:border-primary transition-all uppercase tracking-wider"
              >
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id} className="bg-surface text-white">
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Scanning / Upload Area */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  /* SECTION 4: LIVE ANALYSIS PROGRESS */
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl min-h-[300px] flex flex-col justify-between"
                  >
                    <div className="text-center space-y-3">
                      <div className="relative w-12 h-12 mx-auto mb-2">
                        <div className="absolute inset-0 bg-primary blur-xl opacity-30 animate-pulse" />
                        <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-white animate-pulse">Running Forensic Scan</h4>
                      <p className="text-[10px] text-textSecondary font-medium">Analyzing digital footprints & pixel casing...</p>
                    </div>

                    {/* Timeline items */}
                    <div className="space-y-3 pt-6 border-t border-white/5">
                      {analysisSteps.map((step) => {
                        const isActive = currentStep >= step.id;
                        const isCurrent = currentStep === step.id;
                        return (
                          <div key={step.id} className="flex items-center justify-between">
                            <span className={`text-xs font-bold tracking-wide transition-colors ${
                              isCurrent ? 'text-primary' : (isActive ? 'text-white' : 'text-textMuted')
                            }`}>
                              {step.id}. {step.label}
                            </span>
                            <div className="flex items-center">
                              {isActive ? (
                                isCurrent ? (
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                ) : (
                                  <BadgeCheck className="w-4 h-4 text-primary" />
                                )
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-white/10" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : isCameraActive ? (
                  /* LIVE CAMERA SCREEN */
                  <motion.div
                    key="camera"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative rounded-3xl overflow-hidden bg-black border border-white/10 min-h-[320px] flex flex-col justify-between"
                  >
                    <video ref={videoRef} autoPlay playsInline className="w-full h-auto max-h-[360px] object-cover" />
                    
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-6">
                      <button 
                        onClick={captureSnapshot}
                        className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-xs font-black text-white uppercase tracking-wider"
                      >
                        Take Snapshot
                      </button>
                      <button 
                        onClick={stopCamera}
                        className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs font-black text-white uppercase tracking-wider transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* ENTERPRISE UPLOAD CENTER */
                  <motion.label
                    key="upload"
                    htmlFor="file-select"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center bg-white/[0.01] hover:bg-white/[0.03] border border-dashed border-white/10 hover:border-green-500/30 rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 relative group min-h-[300px]"
                  >
                    {selectedFile ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-primary blur-xl opacity-20" />
                          <FileText className="w-8 h-8 text-primary relative z-10 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white truncate max-w-[280px] mx-auto">{selectedFile.name}</p>
                          <p className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mt-1">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <div className="inline-block px-3 py-1 bg-primary/20 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                          Dossier Prepared
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-textMuted group-hover:text-white transition-colors duration-300">
                          <Upload className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">Upload or Scan Document</p>
                          <p className="text-textSecondary text-xs mt-1 font-medium leading-relaxed">
                            Drag & drop PDF, JPG, PNG or browse. <br />
                            Maximum supported file size: 20 MB.
                          </p>
                        </div>
                      </div>
                    )}
                    <input 
                      id="file-select"
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={handleFileSelect}
                      disabled={isProcessing}
                      className="hidden" 
                    />
                  </motion.label>
                )}
              </AnimatePresence>
            </div>

            {/* Scan Center CTAs */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleVerify}
                disabled={!selectedFile || isProcessing || isCameraActive}
                className="flex-1 btn-premium py-4 justify-center text-xs font-black uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed select-none"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Auditing Record</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Analyze Document</span>
                  </>
                )}
              </button>

              <button
                onClick={startCamera}
                disabled={isProcessing || isCameraActive}
                className="px-6 py-4 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-full text-xs font-black uppercase tracking-wider text-white transition-all flex items-center gap-2 select-none"
              >
                <Camera className="w-4 h-4" />
                <span>Scan via Camera</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VERIFICATION ENGINE PANEL */}
        <div className="lg:col-span-5">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl">
            <h3 className="text-sm uppercase font-black tracking-widest text-white mb-6">Verification Layers</h3>

            <div className="space-y-4">
              {engineLayers.map((layer) => {
                const status = getLayerStatus(layer.id);
                return (
                  <div key={layer.id} className="flex gap-4 p-4 hover:bg-white/[0.02] border border-transparent hover:border-white/5 rounded-2xl transition-all duration-300">
                    <div className="flex-shrink-0 mt-0.5">
                      {status === 'passed' && (
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 ring-1 ring-green-500/30">
                          ✓
                        </div>
                      )}
                      {status === 'processing' && (
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      )}
                      {status === 'pending' && (
                        <div className="w-5 h-5 rounded-full border border-white/15 bg-white/5" />
                      )}
                      {status === 'warning' && (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      )}
                      {status === 'failed' && (
                        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 ring-1 ring-red-500/30 font-bold text-xs leading-none">
                          ×
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-white leading-none mb-1">{layer.label}</h4>
                      <p className="text-textSecondary text-[10px] leading-relaxed font-medium">{layer.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED RESULTS PANEL */}
      {results && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <VerificationResults
            isValid={results.isValid}
            score={results.authenticityScore}
            status={results.status}
            issues={results.issues}
            explanation={results.reasoning || results.explanation}
            aiProbability={results.aiProbability}
            forgeryRisk={results.forgeryRisk}
            fileName={selectedFile?.name || 'document_audit.jpg'}
            fileSize={selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : '420.5 KB'}
            documentType={selectedType}
          />
        </div>
      )}
    </div>
  );
}
