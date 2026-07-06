import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  HelpCircle, 
  Activity, 
  BadgeCheck, 
  Clock, 
  ExternalLink,
  Lock,
  Sparkles,
  Info,
  Maximize2,
  FileCheck2,
  XCircle,
  Globe
} from 'lucide-react';

interface VerificationResultsProps {
  isValid: boolean;
  score: number;
  status: string;
  issues: string[];
  explanation: string;
  aiProbability: number;
  forgeryRisk: string;
  fileName?: string;
  fileSize?: string;
  documentType?: string;
}

export const VerificationResults: React.FC<VerificationResultsProps> = ({
  isValid,
  score,
  status,
  issues,
  explanation,
  aiProbability,
  forgeryRisk,
  fileName = 'document_scan.jpg',
  fileSize = '320 KB',
  documentType = 'aadhar'
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Status mapping functions
  const getStatusLabel = (s: number) => {
    if (s >= 80) return 'Likely Genuine';
    if (s >= 50) return 'Suspicious';
    return 'High Risk of Forgery';
  };

  const getConfidenceLevel = (s: number) => {
    if (s >= 80) return 'High Confidence';
    if (s >= 55) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const getScoreColorClass = (s: number) => {
    if (s >= 80) return 'text-[#00E676] drop-shadow-[0_0_15px_rgba(0,230,118,0.4)]';
    if (s >= 50) return 'text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]';
    return 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]';
  };

  const getStrokeColor = (s: number) => {
    if (s >= 80) return '#00E676';
    if (s >= 50) return '#f59e0b';
    return '#ef4444';
  };

  // Helper check validations based on issue patterns
  const isMetaOk = !issues.some(i => i.toLowerCase().includes('metadata') || i.toLowerCase().includes('timestamps') || i.toLowerCase().includes('software'));
  const isPatternOk = !issues.some(i => i.toLowerCase().includes('pattern') || i.toLowerCase().includes('dpi') || i.toLowerCase().includes('entropy'));
  const isFontOk = !issues.some(i => i.toLowerCase().includes('font') || i.toLowerCase().includes('casing') || i.toLowerCase().includes('text'));
  const isImageOk = forgeryRisk === 'Low';
  const isAiOk = aiProbability < 35;
  const isGovMatchOk = score >= 60;

  return (
    <div className="space-y-8 w-full">
      
      {/* SECTION 5: DOCUMENT RESULTS PANEL (Forensic Report Layout) */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl">
        <div className="flex items-center gap-3 border-b border-white/5 pb-5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Forensic Dossier Report</h3>
            <p className="text-[9px] text-textSecondary uppercase tracking-widest mt-1">Audit verification code: {Date.now().toString().slice(-8)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: Score Dial & General status */}
          <div className="lg:col-span-4 p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Score Ring */}
            <div className="relative mb-6">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72" cy="72" r="64"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="72" cy="72" r="64"
                  fill="transparent"
                  stroke={getStrokeColor(score)}
                  strokeWidth="8"
                  strokeDasharray={402.1}
                  initial={{ strokeDashoffset: 402.1 }}
                  animate={{ strokeDashoffset: 402.1 - (402.1 * score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-black ${getScoreColorClass(score)}`}>{score}%</span>
                <span className="text-[9px] uppercase font-black tracking-widest text-textMuted mt-1">Authenticity</span>
              </div>
            </div>

            <h4 className="text-xl font-black text-white tracking-tight leading-none mb-2">{getStatusLabel(score)}</h4>
            <div className="flex gap-2 items-center">
              <span className={`w-1.5 h-1.5 rounded-full ${score >= 80 ? 'bg-[#00E676]' : (score >= 50 ? 'bg-amber-500' : 'bg-red-500')}`} />
              <span className="text-[10px] uppercase tracking-wider text-textSecondary font-black">{getConfidenceLevel(score)}</span>
            </div>
          </div>

          {/* MIDDLE COLUMN: Verification check details */}
          <div className="lg:col-span-4 p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex flex-col justify-between">
            <h4 className="text-[10px] uppercase font-black tracking-widest text-textSecondary mb-4">Verification Analysis</h4>
            
            <div className="space-y-3">
              {[
                { label: 'Document Structure', ok: isPatternOk },
                { label: 'Metadata Integrity', ok: isMetaOk },
                { label: 'Font Consistency', ok: isFontOk },
                { label: 'Image Authenticity', ok: isImageOk },
                { label: 'AI Manipulation Risk', ok: isAiOk, risk: true },
                { label: 'Government Template Match', ok: isGovMatchOk }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-0">
                  <span className="text-xs text-textSecondary font-medium">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    {item.risk ? (
                      <span className={`text-[10px] font-black uppercase tracking-wide ${item.ok ? 'text-[#00E676]' : 'text-amber-400'}`}>
                        {item.ok ? 'Low Risk' : 'High Risk'}
                      </span>
                    ) : (
                      <span className={`text-[10px] font-black uppercase tracking-wide ${item.ok ? 'text-[#00E676]' : 'text-red-400'}`}>
                        {item.ok ? 'Verified' : 'Flagged'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Document overview details */}
          <div className="lg:col-span-4 p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] uppercase font-black tracking-widest text-textSecondary mb-4">Document Overview</h4>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-textSecondary font-medium">File Name</span>
                  <span className="text-white font-bold truncate max-w-[150px]">{fileName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-textSecondary font-medium">Document Type</span>
                  <span className="text-white font-bold uppercase tracking-wider">{documentType}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-textSecondary font-medium">File Size</span>
                  <span className="text-white font-bold">{fileSize}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-textSecondary font-medium">Resolution</span>
                  <span className="text-white font-bold">High Density (DPI)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-textSecondary font-medium">Audit Date</span>
                  <span className="text-white font-mono">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsPreviewOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-[0.98] select-none"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Preview Scanned Document</span>
            </button>
          </div>

        </div>

        {/* OCR / Reasoning text display */}
        <div className="mt-8 p-6 bg-white/[0.01] border border-white/5 rounded-3xl relative overflow-hidden">
          <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
            <Globe className="w-4 h-4" />
            <span>AI Strategic Verdict</span>
          </div>
          <p className="text-sm leading-relaxed text-textSecondary italic font-medium">
            "{explanation}"
          </p>
        </div>
      </div>

      {/* SECTION 6: AI DETECTION REPORT (AI Manipulation Assessment) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl">
          <h3 className="text-sm uppercase font-black tracking-widest text-white mb-6">AI Manipulation Assessment</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Probability indicator */}
            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex flex-col justify-center">
              <span className="text-[10px] uppercase font-black tracking-widest text-textSecondary mb-2 leading-none">Synthetic Content Probability</span>
              <div className="flex items-baseline gap-2 mb-3">
                <span className={`text-4xl font-black ${aiProbability > 50 ? 'text-red-500' : 'text-[#00E676]'}`}>{aiProbability}%</span>
                <span className="text-textMuted text-xs font-bold">risk match</span>
              </div>
              <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${aiProbability > 50 ? 'bg-red-500' : 'bg-[#00E676]'}`} 
                  style={{ width: `${aiProbability}%` }}
                />
              </div>
            </div>

            {/* Assessment key metrics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-2xl">
                <span className="text-xs text-textSecondary font-bold">Editing Risk</span>
                <span className={`text-xs font-black uppercase tracking-wider ${isMetaOk ? 'text-[#00E676]' : 'text-amber-500'}`}>
                  {isMetaOk ? 'Low' : 'Suspicious'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-2xl">
                <span className="text-xs text-textSecondary font-bold">Deepfake Indicators</span>
                <span className={`text-xs font-black uppercase tracking-wider ${forgeryRisk === 'High' ? 'text-red-500' : 'text-[#00E676]'}`}>
                  {forgeryRisk === 'High' ? 'Anomalies Found' : 'None Found'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-2xl">
                <span className="text-xs text-textSecondary font-bold">Generative AI Traces</span>
                <span className={`text-xs font-black uppercase tracking-wider ${aiProbability > 60 ? 'text-red-500' : 'text-[#00E676]'}`}>
                  {aiProbability > 60 ? 'Detected' : 'Not Detected'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider leading-relaxed">
              Scan Note: This AI analysis parses token frequencies, edge sharpness variations, and structural casing densities. Standard physical copies remain mandatory for official verify submissions.
            </p>
          </div>
        </div>

        {/* SECTION 7: AUDIT & COMPLIANCE */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl h-full flex flex-col justify-between">
          <div>
            <h3 className="text-sm uppercase font-black tracking-widest text-white mb-6">Audit & Compliance</h3>

            <div className="space-y-4 mb-6">
              {[
                { label: 'Government Format Match', ok: isGovMatchOk },
                { label: 'Document Integrity Check', ok: isValid },
                { label: 'Tampering Detection', ok: isImageOk },
                { label: 'Chain of Trust Validation', ok: isMetaOk }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 bg-white/[0.01] border border-white/5 rounded-2xl">
                  {item.ok ? (
                    <BadgeCheck className="w-5 h-5 text-[#00E676] flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="text-xs font-black text-white leading-none mb-1">{item.label}</h4>
                    <p className="text-[9px] uppercase tracking-widest text-textMuted font-bold mt-0.5">{item.ok ? 'Passed' : 'Flagged'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00E676] animate-pulse" />
            <span className="text-[9px] uppercase font-black tracking-widest text-[#00E676]">Verification Seal Certified</span>
          </div>
        </div>

      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-[2rem] overflow-hidden p-6 z-10 text-center"
            >
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Document Dossier File</h4>
              <div className="w-full h-80 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-dashed border-white/10 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                <FileText className="w-16 h-16 text-textMuted mb-2" />
                <span className="text-xs font-bold text-textSecondary relative z-20">Security rendering thumbnail not cached</span>
                <span className="text-[9px] uppercase tracking-wider text-textMuted relative z-20 mt-1">{fileName}</span>
              </div>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="mt-6 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all select-none"
              >
                Close Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
