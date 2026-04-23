import { useState } from 'react';
import { Loader2, FileCheck, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { DocumentUpload } from '../components/DocumentUpload';
import { VerificationResults } from '../components/VerificationResults';
import { api } from '../services/api';

interface DocumentType {
  id: string;
  name: string;
  icon: string;
}

export function VerificationPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>('aadhar');
  const [documentTypes] = useState<DocumentType[]>([
    { id: 'aadhar', name: 'Aadhar Card', icon: '🆔' },
    { id: 'pan', name: 'PAN Card', icon: '💳' },
    { id: 'income_certificate', name: 'Income Certificate', icon: '📋' },
    { id: 'passport', name: 'Passport', icon: '🛂' },
    { id: 'driving_license', name: 'Driving License', icon: '🚗' },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleVerify = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setResults(null);

    try {
      const response = await api.verifyDocument(selectedFile, selectedType);

      if (response.success && response.data) {
        setResults(response.data);
      } else {
        alert(`Error: ${response.error || 'Verification failed'}`);
      }
    } catch (error) {
      alert('Network error. Make sure backend is running on localhost:5000');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full relative">
       <div className="hero-glow" style={{ top: '-20%', right: '10%', opacity: 0.5 }} />

      <div className="text-center mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-5 py-2 rounded-full mb-8 text-[11px] font-black uppercase tracking-widest text-primary"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>AI-Assisted Authenticity Scanner</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-black text-6xl md:text-8xl text-white mb-8 tracking-tighter leading-none"
        >
          Smart Protocol <br />
          <span className="text-gradient-emerald">Verification.</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-textSecondary max-w-2xl mx-auto text-xl font-medium opacity-70 leading-relaxed"
        >
          Deploy advanced AI agents to authenticate identity artifacts and extract verified data points instantly.
        </motion.p>
      </div>

      {/* Document Type Selection */}
      <div className="mb-20">
        <div className="flex items-center justify-center gap-3 mb-10 opacity-50">
           <Zap className="w-4 h-4 text-primary" />
           <label className="font-black text-textMain uppercase tracking-[0.3em] text-[10px]">Select Protocol</label>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto px-4">
          {documentTypes.map((type, i) => (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-8 rounded-[2.5rem] border transition-all duration-300 backdrop-blur-3xl flex flex-col items-center group relative overflow-hidden ${
                selectedType === type.id
                  ? 'border-primary bg-primary/20 text-white shadow-[0_0_40px_rgba(34,197,94,0.2)]'
                  : 'border-white/10 bg-white/5 text-textSecondary hover:text-white hover:border-primary/50'
              }`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">{type.icon}</div>
              <div className="text-[10px] font-black uppercase tracking-widest">{type.name}</div>
              
              {selectedType === type.id && (
                <motion.div layoutId="selection-glow" className="absolute inset-0 bg-primary/10 -z-10 blur-xl" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-16">
        <DocumentUpload
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
          isProcessing={isProcessing}
        />
      </div>

      {/* Verify Button */}
      {selectedFile && (
        <div className="text-center mb-20">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVerify}
            disabled={isProcessing}
            className="btn-premium px-12 py-5 text-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Processing Protocol...</span>
              </>
            ) : (
              <>
                <FileCheck className="w-6 h-6" />
                <span>Authenticate Document</span>
              </>
            )}
          </motion.button>
          {isProcessing && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] uppercase tracking-[0.4em] font-black text-primary mt-10 animate-pulse"
            >
              AI Agents analyzing cryptographic signatures
            </motion.p>
          )}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <VerificationResults
            isValid={results.isValid}
            score={results.score}
            status={results.status}
            issues={results.issues}
            explanation={results.explanation}
          />
        </div>
      )}
    </div>
  );
}
