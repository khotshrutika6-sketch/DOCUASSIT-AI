import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  DollarSign,
  FileText,
  Lightbulb,
  AlertTriangle,
  Globe,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Volume2,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { DocumentGuide, guidanceApi } from '../services/guidanceApi';

interface DocumentGuideViewProps {
  guide: DocumentGuide;
  aiMessage?: string;
  onBack: () => void;
  onRequireAuth: (callback: () => void) => void;
}

export function DocumentGuideView({ guide, aiMessage, onBack, onRequireAuth }: DocumentGuideViewProps) {
  const [language, setLanguage] = useState('English');
  const [simple, setSimple] = useState(false);
  const [dynamicData, setDynamicData] = useState<{steps: string[], documents: string[]} | null>(null);
  const [isLoadingDynamic, setIsLoadingDynamic] = useState(false);

  useEffect(() => {
    const fetchDynamic = async () => {
      setIsLoadingDynamic(true);
      const data = await guidanceApi.getDynamicGuide(guide.name, language, simple);
      setDynamicData(data);
      setIsLoadingDynamic(false);
    };
    fetchDynamic();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [guide.name, language, simple]);

  const speak = (steps: string[]) => {
    const text = steps.join('. ');
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : "en-IN";
    window.speechSynthesis.speak(speech);
  };

  const handleApplyNow = () => {
    onRequireAuth(() => {
      const link = (guide as any).applyLink || '#';
      window.open(link, '_blank');
    });
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-[1200px] mx-auto pb-32"
    >
      {/* Navigation & AI Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <motion.button
          whileHover={{ x: -5 }}
          onClick={onBack}
          className="group flex items-center gap-3 text-textSecondary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 group-hover:text-primary" />
          <span className="text-xs font-black uppercase tracking-[0.3em]">Return to Ecosystem</span>
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-2xl p-1.5 shadow-2xl"
        >
          <div className="flex items-center gap-2 px-4 border-r border-white/10">
            <Globe className="w-4 h-4 text-primary" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white text-xs font-black uppercase tracking-widest focus:ring-0 border-none cursor-pointer outline-none appearance-none"
            >
              <option value="English" className="bg-[#0f172a]">En</option>
              <option value="Hindi" className="bg-[#0f172a]">Hi</option>
              <option value="Marathi" className="bg-[#0f172a]">Ma</option>
            </select>
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setSimple(!simple)}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-xl transition-all duration-300 ${
              simple 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-primary/30' 
                : 'text-textSecondary hover:text-white'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${simple ? 'animate-pulse' : ''}`} />
            Explain Simplified
          </motion.button>
        </motion.div>
      </div>

      {/* High-End Hero Section */}
      <motion.div 
        variants={item}
        className="relative overflow-hidden glass-card p-10 md:p-16 mb-12 border-primary/20 bg-primary/[0.02]"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none">
           <div className="text-[20rem] font-black rotate-12">{guide.icon}</div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center text-5xl shadow-2xl shadow-primary/30 ring-4 ring-primary/10 transition-all duration-500"
            >
              {guide.icon}
            </motion.div>
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h1 className="font-black text-5xl md:text-6xl text-white tracking-tighter leading-none">{guide.name}</h1>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <ShieldCheck className="w-8 h-8 text-primary shadow-primary/20" />
                </motion.div>
              </div>
              <p className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[10px] opacity-80">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {guide.category} • Official Protocol Guide
              </p>
            </div>
          </div>

          <p className="text-textSecondary text-xl leading-relaxed max-w-3xl mb-12 font-medium opacity-80">
            {guide.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Latency', val: guide.estimatedTime, icon: Clock, color: 'text-primary' },
              { label: 'Capital', val: guide.fees, icon: DollarSign, color: 'text-emerald-400' },
              { label: 'Domain', val: guide.processType, icon: Globe, color: 'text-accent' },
              { label: 'Security', val: 'End-to-End', icon: ShieldCheck, color: 'text-primary' }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 group hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500"
              >
                <div className={`flex items-center gap-3 text-[9px] uppercase font-black tracking-[0.2em] mb-2 ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`}>
                  <stat.icon className="w-3.5 h-3.5" />
                  {stat.label}
                </div>
                <div className="text-white font-black text-lg group-hover:text-primary transition-colors">{stat.val}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Main Stream */}
        <motion.div variants={container} initial="hidden" animate="show" className="lg:col-span-8 space-y-12">
          
          {/* AI Intelligence Brief */}
          {aiMessage && (
            <motion.div variants={item} className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
              <div className="relative glass-card border-primary/20 bg-primary/[0.01]">
                <div className="flex items-center gap-4 mb-8">
                   <div className="bg-primary/20 p-3 rounded-2xl">
                      <HelpCircle className="w-6 h-6 text-primary" />
                   </div>
                   <h3 className="font-black text-white uppercase tracking-[0.2em] text-xs">AI Strategic Intelligence Brief</h3>
                </div>
                <div className="text-textSecondary text-sm md:text-base leading-[2] whitespace-pre-line font-medium opacity-90 prose prose-invert max-w-none">
                  {aiMessage}
                </div>
              </div>
            </motion.div>
          )}

          {/* Deployment Lifecycle */}
          <motion.section variants={item} className="glass-card bg-transparent border-white/5 relative">
            <div className="flex flex-wrap items-center justify-between mb-16 gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                 <h2 className="font-black text-white uppercase tracking-[0.3em] text-xs">Application Lifecycle Lifecycle</h2>
              </div>
              
              {dynamicData && dynamicData.steps && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => speak(dynamicData.steps)}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-primary/50 text-white px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl"
                >
                  <Volume2 className="w-5 h-5 text-primary" /> Transmit Audio
                </motion.button>
              )}
            </div>
            
            <div className="relative">
              {isLoadingDynamic ? (
                <div className="flex flex-col items-center justify-center py-20">
                   <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
                   <p className="text-[10px] uppercase tracking-[0.4em] font-black text-primary animate-pulse">Calculating Dynamic Path...</p>
                </div>
              ) : (
                <div className="space-y-16 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-white/10 before:to-transparent before:opacity-20">
                  { (dynamicData?.steps || guide.steps).map((step: any, idx: number) => {
                    const isManual = typeof step === 'string';
                    return (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-10 relative group"
                      >
                        <div className="flex-shrink-0 relative z-10">
                          <motion.div 
                            whileHover={{ scale: 1.2 }}
                            className="w-12 h-12 bg-[#020617] border-2 border-white/10 group-hover:border-primary group-hover:bg-primary shadow-2xl text-textSecondary group-hover:text-bg transition-all duration-500 rounded-2xl flex items-center justify-center font-black"
                          >
                            {idx + 1}
                          </motion.div>
                        </div>
                        <div className="flex-1 pt-1">
                          {isManual ? (
                             <p className="text-textSecondary text-lg leading-relaxed group-hover:text-white transition-colors duration-500 font-medium">
                               {step}
                             </p>
                          ) : (
                            <div>
                               <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                  <h3 className="font-black text-2xl text-white group-hover:text-primary transition-colors duration-500 tracking-tight">{step.title}</h3>
                                  <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1 text-[9px] uppercase font-black tracking-widest border rounded-full ${
                                      step.online ? 'border-primary/30 text-primary bg-primary/5' : 'border-amber-500/30 text-amber-500 bg-amber-500/5'
                                    }`}>
                                      {step.online ? 'Cloud Protocol' : 'On-Site Verification'}
                                    </span>
                                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-textMuted">{step.duration}</span>
                                  </div>
                               </div>
                               <p className="text-textSecondary text-base leading-[1.8] font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                 {step.description}
                               </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.section>
        </motion.div>

        {/* Tactical Perimeter */}
        <div className="lg:col-span-4 space-y-10">
           {/* Primary Trigger */}
           <motion.div 
             whileHover={{ y: -10 }}
             className="bg-gradient-to-br from-green-600 to-emerald-700 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(34,197,94,0.3)] relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-6 opacity-80">Official Integration</h3>
              <p className="text-emerald-50 text-base mb-10 leading-relaxed font-medium">
                Establish direct secure handshake with verified government servers.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApplyNow}
                className="w-full py-5 bg-white text-emerald-700 font-black rounded-2xl flex items-center justify-center gap-4 hover:shadow-2xl transition-all text-sm uppercase tracking-widest"
              >
                <span>Initiate Portal</span>
                <ExternalLink className="w-5 h-5" />
              </motion.button>
           </motion.div>

           {/* Tactical Checklist */}
           <motion.div variants={item} className="glass-card bg-transparent border-white/5 p-10">
              <div className="flex items-center gap-4 mb-10">
                <FileText className="w-5 h-5 text-primary" />
                <h4 className="font-black text-white uppercase tracking-[0.2em] text-[10px]">Required Artifacts</h4>
              </div>
              
              {isLoadingDynamic ? (
                <div className="py-6 opacity-50 animate-pulse flex justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <ul className="space-y-6">
                  {(dynamicData?.documents || guide.requiredDocuments).map((doc: string, idx: number) => (
                    <motion.li 
                      key={idx} 
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-5 group"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(34,197,94,0.8)] group-hover:scale-150 transition-transform" />
                      <span className="text-sm font-black text-textSecondary group-hover:text-white transition-colors">{doc}</span>
                    </motion.li>
                  ))}
                </ul>
              )}
           </motion.div>

           {/* Operational Intelligence */}
           <motion.div variants={item} className="bg-primary/[0.03] border border-primary/20 rounded-[2.5rem] p-10">
              <div className="flex items-center gap-4 mb-8">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h4 className="font-black text-primary uppercase tracking-[0.3em] text-[10px]">Operations Intel</h4>
              </div>
              <div className="space-y-6">
                {guide.tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-4">
                     <div className="w-px bg-primary/30 h-auto" />
                     <p className="text-[11px] font-black text-textSecondary leading-relaxed uppercase tracking-wider opacity-80">
                        {tip}
                     </p>
                  </div>
                ))}
              </div>
           </motion.div>

           {/* Defensive Alerts */}
           {guide.warnings.length > 0 && (
              <motion.div variants={item} className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-10">
                <div className="flex items-center gap-4 mb-8">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h4 className="font-black text-red-500 uppercase tracking-[0.3em] text-[10px]">Defensive Alerts</h4>
                </div>
                <div className="space-y-4">
                  {guide.warnings.map((w, idx) => (
                    <p key={idx} className="text-xs text-red-500/80 leading-relaxed font-black uppercase tracking-wider italic">
                      {w}
                    </p>
                  ))}
                </div>
              </motion.div>
           )}
        </div>
      </div>
    </motion.div>
  );
}
