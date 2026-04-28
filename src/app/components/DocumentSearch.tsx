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
        
        <h1 className="text-6xl md:text-8xl font-black leading-[1] mb-8 tracking-tighter">
          <motion.span 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="block text-white mb-2"
          >
            Get documentation
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="block text-gradient-emerald"
          >
            in minutes.
          </motion.span>
        </h1>
        
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
          {/* Search Box Background Glow */}
          <div className="absolute inset-0 bg-green-400/10 blur-2xl rounded-2xl opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-700" />
          
          <div className="search-box relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 flex items-center gap-4 transition-all duration-300 hover:bg-white/10 group-focus-within/search:ring-2 group-focus-within/search:ring-green-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-20">
            <Search size={22} className="opacity-60 text-textMain group-focus-within/search:text-primary transition-colors" />
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="bg-transparent border-none focus:ring-0 text-textMain text-lg placeholder-gray-400 font-medium w-full outline-none"
            />
            
            <div className="flex items-center gap-3">
              <AnimatePresence>
                {query && (
                  <motion.button 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => setQuery('')} 
                    className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </motion.button>
                )}
              </AnimatePresence>
              
              <button
                onClick={startVoiceSearch}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-red-500/20 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse' 
                    : 'text-green-400 hover:bg-white/10 glow mic-pulse glow'
                }`}
              >
                {isListening ? <MicOff size={22} /> : <Mic size={22} className="cursor-pointer" />}
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
               whileTap={{ scale: 0.95 }}
               key={tag}
               onClick={() => setQuery(tag)}
               className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-green-400 hover:bg-green-400/20 hover:border-green-400/30 transition-all font-medium"
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
          animate={{ y: [0, -10, 0], rotateX: [5, 10, 5], rotateY: [-5, 0, -5] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          whileHover={{ rotate: 1, scale: 1.02 }}
          className="relative z-20 w-full max-w-sm"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-green-400/10 blur-2xl rounded-2xl"></div>

          {/* Glass card */}
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center glow">
                  <Sparkles className="w-6 h-6 text-green-400" />
               </div>
               <h2 className="text-green-400 font-semibold text-xl tracking-wide">AI Guidance</h2>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {[
                "Analyze Identity Documents",
                "Verify Institutional Status",
                "Generate Verification Protocol"
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 transition-all hover:bg-white/10 cursor-pointer">
                   <div className="w-6 h-6 rounded bg-green-400/20 flex items-center justify-center border border-green-400/30">
                      <span className="text-green-400 text-xs font-bold">{i + 1}</span>
                   </div>
                   <span className="text-gray-300 text-sm">{step}</span>
                </div>
              ))}
              
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                 <div className="h-2 w-24 bg-white/10 rounded-full" />
                 <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center glow">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
