import { useState, useEffect } from 'react';
import { Bot, ChevronRight, FileText, Search, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GuidancePage } from './pages/GuidancePage';
import { VerificationPage } from './pages/VerificationPage';

import { HowItWorks } from './components/HowItWorks';
import { AuthModal } from './components/AuthModal';
import { authService, User } from './services/authService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'guidance' | 'verify'>('guidance');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const requireAuth = (callback: () => void) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    callback();
  };

  return (
    <div className="min-h-screen bg-bg text-textMain selection:bg-primary/30 overflow-x-hidden font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[0%] left-[10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[0%] right-[10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg/40 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center group cursor-pointer" onClick={() => setActiveTab('guidance')}>
            <motion.img 
              whileHover={{ scale: 1.05 }} 
              src="/logo.png" 
              alt="DocAssist AI Logo"
              className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
            />
          </div>

          <nav className="hidden lg:flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
             <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('guidance')}
              className={`nav-tab px-8 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === 'guidance' 
                  ? 'active' 
                  : ''
              }`}
            >
              Protocol
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('verify')}
              className={`nav-tab px-8 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === 'verify' 
                  ? 'active' 
                  : ''
              }`}
            >
              Security
            </motion.button>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})} className="hidden md:flex text-sm font-black text-textSecondary hover:text-white transition-colors tracking-[0.2em] uppercase">
              Support
            </button>
            <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white/5 px-2.5 py-2 rounded-full border border-white/10 cursor-pointer hover:bg-white/10 transition shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden uppercase font-bold text-xs text-bg ring-2 ring-primary/30">
                    {user.avatar ? <img src={user.avatar} alt="Profile" /> : user.name.charAt(0)}
                  </div>
                  <div className="pr-3 flex flex-col items-start translate-y-[-1px]">
                     <span className="text-[11px] font-black text-white leading-none mb-1">{user.name.split(' ')[0]}</span>
                     <button onClick={handleLogout} className="text-[9px] uppercase tracking-widest text-primary hover:text-red-400 font-black leading-none transition-colors">Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-3 px-7 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-sm font-black text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all uppercase tracking-widest"
              >
                <UserIcon className="w-4 h-4" /> <span>Login</span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Main App Container */}
      <main className={`relative z-10 pt-28 pb-0 max-w-[1400px] mx-auto px-6 min-h-screen flex flex-col transition-all duration-500 ${!user ? 'blur-md pointer-events-none opacity-40 select-none' : ''}`}>
        
        {/* Dynamic Page Router */}
        <div className="flex-1">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.3 }}
             >
               {activeTab === 'guidance' ? (
                 <GuidancePage onRequireAuth={requireAuth} />
               ) : (
                 <VerificationPage />
               )}
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Mega Footer Upgrade */}
        <footer className="mt-32 border-t border-border pt-16 pb-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                 <div className="flex items-center mb-6 opacity-80">
                   <img 
                     src="/logo.png" 
                     alt="DocAssist AI Logo"
                     className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-opacity hover:opacity-100"
                   />
                 </div>
                 <p className="text-textSecondary text-sm leading-relaxed max-w-sm mb-6">
                   Empowering citizens with AI-driven document guidance. Fast, reliable, and accessible process navigation without the usual bureaucracy.
                 </p>
              </div>

              <div>
                 <h4 className="font-bold text-textMain mb-6 uppercase tracking-widest text-xs">Platform</h4>
                 <ul className="space-y-4 text-sm text-textMuted">
                    <li><button onClick={() => setActiveTab('guidance')} className="hover:text-primary transition">Document Search</button></li>
                    <li><button className="hover:text-primary transition">AI Chatbot</button></li>
                    <li><button onClick={() => setActiveTab('verify')} className="hover:text-primary transition">Fraud Verification</button></li>
                 </ul>
              </div>

              <div>
                 <h4 className="font-bold text-textMain mb-6 uppercase tracking-widest text-xs">Legal</h4>
                 <ul className="space-y-4 text-sm text-textMuted">
                    <li><a href="#" className="hover:text-textMain transition">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-textMain transition">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-textMain transition">Contact Us</a></li>
                 </ul>
              </div>
           </div>

           <div className="border-t border-border pt-8 text-center md:flex md:justify-between md:text-left">
              <p className="text-textMuted text-xs">© 2026 DocAssist AI Platform. All rights reserved.</p>
              <div className="flex gap-2 justify-center mt-4 md:mt-0 items-center">
                 <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                 <span className="text-[10px] text-textSecondary uppercase tracking-widest font-bold">All Systems Operational</span>
              </div>
           </div>
        </footer>
      </main>


      <AuthModal 
        isOpen={!user || isAuthModalOpen} 
        closable={!!user}
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(userData) => { setUser(userData); setIsAuthModalOpen(false); }}
      />
      <CursorGlow />
    </div>
  );
}

function CursorGlow() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      animate={{ x: mousePos.x - 150, y: mousePos.y - 150 }}
      transition={{ type: 'spring', damping: 30, stiffness: 150, mass: 0.5 }}
      className="fixed top-0 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-[9999] opacity-50"
    />
  );
}