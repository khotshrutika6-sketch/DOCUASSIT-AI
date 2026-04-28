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

      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full text-xs text-green-400 mb-6"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          AI Verification Active
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold leading-tight text-white mb-6"
        >
          Smart Security <br />
          <span className="text-green-400">Verification.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 max-w-xl mx-auto text-lg mt-4"
        >
          AI-powered document authentication with real-time fraud detection.
        </motion.p>
      </div>

      {/* Document Type Selection */}
      <div className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto px-4">
          {documentTypes.map((type, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`bg-white/5 backdrop-blur-xl border rounded-xl p-4 text-center cursor-pointer transition-all hover:scale-105 hover:border-green-400/40 hover:bg-green-400/10 ${
                selectedType === type.id ? "border-green-400 bg-green-400/10 shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "border-white/10"
              }`}
            >
              <div className="text-3xl mb-3">{type.icon}</div>
              <p className="text-sm text-gray-300 font-medium">{type.name}</p>
            </motion.div>
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

      {/* Verify Button & Sample Result */}
      <div className="mt-12 text-center mb-20 max-w-2xl mx-auto">
        {!results && (
          <div className="mb-10 text-left bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl transition-all">
            <p className="text-sm text-gray-400 mb-2">Sample Result Analysis</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-white">Authenticity Score</p>
              <span className="text-green-400 text-2xl font-bold">92%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded mt-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-green-400 rounded glow"
              />
            </div>
          </div>
        )}

        {selectedFile && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVerify}
            disabled={isProcessing}
            className="btn-premium px-12 py-4 text-lg w-full max-w-md mx-auto"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Running Fraud Check...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-6 h-6" />
                <span>Verify Authenticity</span>
              </>
            )}
          </motion.button>
        )}
        {isProcessing && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.4em] font-black text-green-400 mt-10 animate-pulse"
          >
            AI Agents analyzing cryptographic signatures
          </motion.p>
        )}
      </div>
      {/* Results */}
      {results && (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <VerificationResults
            isValid={results.isValid}
            score={results.authenticityScore}
            status={results.status}
            issues={results.issues}
            explanation={results.reasoning || results.explanation}
            aiProbability={results.aiProbability}
            forgeryRisk={results.forgeryRisk}
          />
        </div>
      )}
    </div>
  );
}
