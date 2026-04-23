import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Mic, MicOff, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentSearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function DocumentSearch({ onSearch, isLoading }: DocumentSearchProps) {
  const [query, setQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [isListening, setIsListening] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<any>(null);

  const placeholders = [
    "Search for 'Passport'...",
    "How to get 'Aadhaar'?",
    "Need 'PAN' card steps?",
    "Apply for 'Driving License'?",
    "Check 'Voter ID' protocol..."
  ];

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let i = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
      const current = placeholders[i];
      if (isDeleting) {
        setPlaceholder(current.substring(0, charIdx - 1));
        charIdx--;
        typingSpeed = 50;
      } else {
        setPlaceholder(current.substring(0, charIdx + 1));
        charIdx++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIdx === current.length) {
        isDeleting = true;
        typingSpeed = 2000;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        i = (i + 1) % placeholders.length;
        typingSpeed = 500;
      }

      typingTimerRef.current = setTimeout(type, typingSpeed);
    };

    typingTimerRef.current = setTimeout(type, 1000);
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query) {
      onSearch('');
      return;
    }
    debounceRef.current = setTimeout(() => {
      onSearch(query.trim());
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };
    recognition.start();
  };

  const popular = ['Passport', 'Aadhaar', 'PAN Card', 'Driving License', 'Voter ID'];

  return (
    <div className="w-full relative overflow-hidden bg-transparent p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-16 group">
      {/* Dynamic Glow Spot */}
      <div className="hero-glow" />
      
      {/* Hero Content Area */}
      <div className="flex-1 z-10 text-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full mb-10 text-[11px] font-black uppercase tracking-[0.2em] text-primary backdrop-blur-md"
        >
          <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Next-Gen Identity Protocol</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-black leading-[1] text-white mb-8 tracking-tighter"
        >
          Get documentation
          <br />
          <span className="text-gradient-emerald">
            in minutes.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-textSecondary max-w-xl text-xl leading-relaxed mb-12 font-medium opacity-80"
        >
          Your personal AI bridge to government services. Seamless, secure, and purely digital.
        </motion.p>

        {/* Search Bar container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative group/search max-w-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-700" />
          
          <div className="relative flex items-center bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-3 group-focus-within/search:border-primary/50 group-focus-within/search:bg-white/[0.05] transition-all duration-500 shadow-2xl">
            <div className="pl-6">
              <Search className="w-7 h-7 text-textMuted group-focus-within/search:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none focus:ring-0 text-textMain text-xl px-5 py-6 placeholder-textMuted/50 font-bold w-full outline-none"
            />
            
            <div className="flex items-center gap-4 pr-3">
              <AnimatePresence>
                {query && (
                  <motion.button 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => setQuery('')} 
                    className="p-2 hover:bg-white/10 rounded-full text-textSecondary"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                )}
              </AnimatePresence>
              
              <button
                onClick={startVoiceSearch}
                className={`w-16 h-16 flex items-center justify-center rounded-[1.5rem] transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500/20 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse' 
                    : 'bg-white/5 border border-white/10 text-primary hover:bg-primary/20 hover:text-white'
                }`}
              >
                {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Suggestion Chips */}
        <div className="mt-12 flex flex-wrap gap-3 items-center">
           <span className="text-[11px] text-textMuted uppercase tracking-widest font-black mr-3 opacity-60">Hotkeys:</span>
           {popular.map((tag, i) => (
             <motion.button
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.8 + (i * 0.1) }}
               whileHover={{ scale: 1.05, backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }}
               whileTap={{ scale: 0.95 }}
               key={tag}
               onClick={() => setQuery(tag)}
               className="px-6 py-2 bg-white/5 border border-white/10 text-xs font-bold text-textSecondary rounded-full transition-all hover:text-primary backdrop-blur-sm"
             >
               {tag}
             </motion.button>
           ))}
        </div>
      </div>

      {/* Hero Visual - Floating AI Master Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="hidden lg:flex w-full md:w-1/3 justify-center relative perspective-container"
      >
        <motion.div 
          animate={{ y: [0, -20, 0], rotateX: [10, 15, 10], rotateY: [-10, -5, -10] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="relative z-20 p-1 bg-gradient-to-br from-primary/30 to-accent/30 rounded-[3rem] shadow-2xl overflow-hidden group-hover:shadow-primary/20 transition-all duration-700"
        >
          <div className="bg-[#020617]/90 backdrop-blur-3xl p-10 rounded-[2.9rem] border border-white/10">
             <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                   <Sparkles className="w-9 h-9 text-white group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                   <div className="h-3 w-32 bg-primary/20 rounded-full mb-3" />
                   <div className="h-3 w-20 bg-white/5 rounded-full" />
                </div>
             </div>
             
             <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                        <div className="w-4 h-4 rounded bg-primary/40" />
                     </div>
                     <div className="flex-1 h-2.5 bg-white/5 rounded-full" />
                  </div>
                ))}
             </div>

             <div className="mt-12 pt-10 border-t border-white/5">
                <div className="flex justify-between items-center">
                   <div className="h-8 w-32 bg-white/5 rounded-xl" />
                   <div className="w-10 h-10 rounded-full bg-primary/20 animate-pulse" />
                </div>
             </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl opacity-50" />
        </motion.div>
      </motion.div>
    </div>
  );
}
