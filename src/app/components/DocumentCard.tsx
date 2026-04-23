import { ExternalLink, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { DocumentGuide } from '../services/guidanceApi';

interface DocumentCardProps {
  document: DocumentGuide;
  onClick: () => void;
}

export function DocumentCard({ document, onClick }: DocumentCardProps) {
  const handleApplyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.applyLink || '#';
    window.open(link, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="group glass-card flex flex-col h-full cursor-pointer relative overflow-hidden" 
    >
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

      {/* Category Badge */}
      <div className="absolute top-6 right-6 z-10">
        <span className="px-4 py-1 bg-white/5 border border-white/10 text-[10px] uppercase font-black tracking-widest text-emerald-400 rounded-full backdrop-blur-md">
          {document.category}
        </span>
      </div>

      <div className="flex items-center gap-5 mb-8 relative z-10">
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          {document.icon}
        </div>
        <div>
          <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors duration-300 tracking-tight">
            {document.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 opacity-60">
             <ShieldCheck className="w-4 h-4 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-widest">Protocol Verified</span>
          </div>
        </div>
      </div>

      <p className="text-textSecondary text-sm leading-relaxed mb-10 flex-1 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
        {document.description}
      </p>

      <div className="flex gap-3 mt-auto relative z-10">
         <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleApplyNow}
          className="btn-premium flex-1 py-4 text-sm"
        >
          <span>Initiate Request</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-textSecondary hover:text-white transition-all"
        >
          <FileText className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
