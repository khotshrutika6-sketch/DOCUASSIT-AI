import { CheckCircle, XCircle, AlertTriangle, Lightbulb, Database, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerificationResultsProps {
  isValid: boolean;
  score: number;
  status: string;
  issues: string[];
  explanation: string;
}

export function VerificationResults({
  isValid,
  score,
  status,
  issues,
  explanation,
}: VerificationResultsProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-primary'; 
    if (s >= 50) return 'text-amber-500'; 
    return 'text-red-500'; 
  };

  const getStatusBg = (stat: string) => {
    switch (stat) {
      case 'AUTHENTIC': return 'bg-primary/20 border-primary/30 text-primary';
      case 'LOW_RISK': return 'bg-primary/10 border-primary/20 text-textMain';
      case 'SUSPICIOUS': return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case 'HIGH_RISK': return 'bg-red-500/10 border-red-500/20 text-red-500';
      default: return 'bg-white/5 border-white/10 text-white';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Risk Assessment Module */}
      <div className={`relative overflow-hidden p-10 rounded-[3rem] border-2 backdrop-blur-3xl transition-all duration-700 ${
        isValid 
          ? 'bg-primary/[0.02] border-primary/20 shadow-[0_0_60px_rgba(34,197,94,0.1)]' 
          : 'bg-red-500/[0.02] border-red-500/20 shadow-[0_0_60px_rgba(239,68,68,0.1)]'
      }`}>
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20 ${
          isValid ? 'bg-primary' : 'bg-red-500'
        }`} />

        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative">
             <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64" cy="64" r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-white/5"
                />
                <motion.circle
                  cx="64" cy="64" r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={364.4}
                  initial={{ strokeDashoffset: 364.4 }}
                  animate={{ strokeDashoffset: 364.4 - (364.4 * score) / 100 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className={getScoreColor(score)}
                  strokeLinecap="round"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black ${getScoreColor(score)}`}>{score}</span>
                <span className="text-[10px] uppercase font-black tracking-widest opacity-50">Score</span>
             </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${getStatusBg(status)}`}>
               Status: {status}
            </div>
            <h3 className="font-black text-4xl text-white mb-2 tracking-tighter">
              {isValid ? 'Authenticity Confirmed' : 'Integrity Flagged'}
            </h3>
            <p className="text-textSecondary text-sm font-medium opacity-60">Verification completed via Multi-Agent Security Protocol</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* AI Strategic Intelligence */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Fingerprint className="w-16 h-16 text-primary" />
           </div>
           
           <div className="flex items-center gap-3 mb-8 text-primary">
              <Lightbulb className="w-5 h-5 animate-pulse" />
              <h4 className="font-black uppercase tracking-[0.3em] text-[10px]">AI Strategic Explanation</h4>
           </div>
           
           <p className="text-lg leading-relaxed text-textMain font-medium italic opacity-90">
             "{explanation}"
           </p>
        </div>

        {/* Tactical Issues Checklist */}
        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-10">
           <div className="flex items-center gap-3 mb-8 text-textMuted">
              <Database className="w-5 h-5" />
              <h4 className="font-black uppercase tracking-[0.3em] text-[10px]">Security Signals Detected</h4>
           </div>
           
           <div className="space-y-4">
              {issues.length > 0 ? issues.map((issue, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-red-500/20 transition-all font-bold text-sm text-textSecondary"
                >
                   <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                   {issue}
                </motion.div>
              )) : (
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 font-bold text-sm text-primary">
                   <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                   No anomalies identified in protocol scan.
                </div>
              )}
           </div>
        </div>
      </div>

      <div className="pt-10 text-center opacity-40 border-t border-white/5">
        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-textMain">DocAssist Secure Verification Ecosystem • Protocol 4.2.1</p>
      </div>
    </div>
  );
}
