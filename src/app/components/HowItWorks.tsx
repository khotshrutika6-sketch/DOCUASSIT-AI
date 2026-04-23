import React from 'react';
import { motion } from 'framer-motion';
import { Search, Cpu, FileText, Languages, Send, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-6 h-6 text-accent" />,
    title: "1. Search or Speak",
    description: "Type or use voice to find any government document instantly.",
    tag: "🎤 Voice Enabled"
  },
  {
    icon: <Cpu className="w-6 h-6 text-primary" />,
    title: "2. AI Understands",
    description: "Our intelligent system analyzes your request and selects the right service.",
    tag: "⚡ Powered by AI"
  },
  {
    icon: <FileText className="w-6 h-6 text-emerald-400" />,
    title: "3. Get Guidance",
    description: "View complete instructions and required documents clearly.",
    tag: "📋 Step-by-Step"
  },
  {
    icon: <Languages className="w-6 h-6 text-amber-400" />,
    title: "4. Customize",
    description: "Switch language or simplify steps for better understanding.",
    tag: "🌍 Multi-language"
  },
  {
    icon: <Send className="w-6 h-6 text-pink-400" />,
    title: "5. Apply Instantly",
    description: "Go to the official website and complete your application easily.",
    tag: "🚀 One Click"
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="mt-24 mb-32 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-[40px] blur-3xl -z-10" />
      
      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-6"
        >
          <Sparkles className="w-3 h-3" />
          The Process
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-textMain">
          How <span className="text-gradient">DocAssist</span> Works
        </h2>
        <p className="text-textSecondary max-w-2xl mx-auto text-lg">
          Experience the journey of a smart document assistant that simplifies 
          complex government processes in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
        {/* Connection Lines (Desktop only) */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="glass p-8 rounded-[32px] border border-white/5 hover:border-primary/30 transition-all duration-500 h-full flex flex-col items-center text-center relative overflow-hidden hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]">
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
              
              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/10 shadow-xl group-hover:shadow-primary/20">
                {step.icon}
              </div>

              {/* Tag */}
              <div className="text-[10px] font-black uppercase tracking-tighter bg-white/5 px-3 py-1 rounded-full text-textMuted mb-4 border border-white/5">
                {step.tag}
              </div>

              <h4 className="text-xl font-bold mb-3 text-textMain">
                {step.title}
              </h4>
              
              <p className="text-sm text-textSecondary leading-relaxed group-hover:text-textMain transition-colors">
                {step.description}
              </p>

              {/* Step indicator (Desktop) */}
              <div className="mt-auto pt-6 text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                Phase 0{index + 1}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
