import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2, Mic, MicOff, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { guidanceApi, DocumentGuide } from '../services/guidanceApi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: Array<{ id: string; name: string; icon: string }>;
  documentInfo?: DocumentGuide;
  timestamp: Date;
}

interface ChatAgentProps {
  currentDocumentId?: string;
  onSelectDocument?: (documentId: string) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export function ChatAgent({ currentDocumentId, onSelectDocument }: ChatAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "👋 Hello! I am your Gemini-powered DocAssist bot! I can help you find out how to apply for Indian government documents. Try asking about a 'Passport' or 'Aadhaar'!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const sendMessage = async (text?: string) => {
    const msgText = (text || input).trim();
    if (!msgText || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msgText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText })
      });
      const data = await res.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || '❌ Failed to connect to Gemini API',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '❌ Failed to get a response. Make sure the backend is running on port 5000.',
          timestamp: new Date(),
        },
      ]);
    }

    setIsLoading(false);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const formatMessage = (text: string) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');

  return (
    <AnimatePresence>
      {!isOpen ? (
        <motion.button
          key="chat-trigger"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 45 }}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_15px_40px_rgba(34,197,94,0.4)] z-50 group border border-white/20"
          title="Analyze with AI"
        >
          <Bot className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-500" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full animate-pulse border-4 border-[#020617]" />
        </motion.button>
      ) : (
        <motion.div
          key="chat-window"
          initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(20px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(20px)' }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${
            isMinimized ? 'w-80 h-16' : 'w-[400px] h-[640px]'
          } flex flex-col rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 bg-white/[0.02] backdrop-blur-3xl`}
        >
          {/* High-End Header */}
          <div className="bg-gradient-to-r from-green-500/80 to-emerald-600/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 flex-shrink-0 cursor-pointer border-b border-white/10" onClick={() => setIsMinimized(!isMinimized)}>
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-sm uppercase tracking-widest">DocAssist <span className="opacity-60">Intelligence</span></p>
              {!isMinimized && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <p className="text-white/60 font-black text-[9px] uppercase tracking-[0.2em]">Live Protocol Proxy</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-white transition-all shadow-sm"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-white transition-all shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Converstation Stream */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, x: msg.role === 'assistant' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    key={msg.id} 
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                        msg.role === 'assistant'
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 border border-white/20'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <Bot className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-textSecondary" />
                      )}
                    </div>

                    <div className={`flex-1 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                      <div
                        className={`inline-block max-w-[90%] px-5 py-4 rounded-[1.5rem] text-sm leading-[1.7] shadow-2xl transition-all duration-300 ${
                          msg.role === 'assistant'
                            ? 'bg-white/[0.03] border border-white/5 text-textSecondary rounded-tl-sm hover:border-primary/20'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black rounded-tr-sm shadow-primary/20'
                        }`}
                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                      />

                      {/* AI Response Chips */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {msg.suggestions.map((s) => (
                            <motion.button
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              key={s.id}
                              onClick={() => {
                                onSelectDocument?.(s.id);
                                sendMessage(`Generate protocol for ${s.name}`);
                              }}
                              className="px-4 py-2 bg-white/5 border border-white/10 text-primary font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 shadow-xl"
                            >
                              {s.icon} {s.name}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* AI Predictive Loading */}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center border border-white/20">
                      <Bot className="w-5 h-5 text-white animate-bounce" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[1.5rem] rounded-tl-sm px-6 py-4 flex items-center shadow-2xl">
                      <div className="flex gap-2 items-center">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 200}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Tactical Input Module */}
              <div className="p-6 bg-white/[0.02] border-t border-white/5">
                <div className="relative flex items-center gap-3">
                  <div className="relative flex-1 group/input">
                    <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="Ask AI Anything..."
                      className="relative w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-bold placeholder-textMuted/40 focus:outline-none focus:border-primary/50 transition-all shadow-2xl"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={startVoiceInput}
                    className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl transition-all duration-300 ${
                      isListening
                        ? 'bg-red-500/20 border border-red-500/40 text-red-500 animate-pulse'
                        : 'bg-white/5 border border-white/10 text-primary hover:bg-white/10'
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white shadow-[0_0_30px_rgba(34,197,94,0.3)] disabled:opacity-30 disabled:hover:scale-100 transition-all duration-300"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
                {isListening && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mt-4 text-center"
                  >
                    Transmitting Vocal Stream
                  </motion.p>
                )}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
