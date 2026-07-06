import { useState, useEffect } from 'react';
import { Bot, ChevronRight, FileText, Search, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GuidancePage } from './pages/GuidancePage';
import { VerificationPage } from './pages/VerificationPage';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { authService, User } from './services/authService';

export default function App() {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<'guidance' | 'verify'>('guidance');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setView('dashboard');
    } else {
      setView('landing');
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('landing');
  };

  const requireAuth = (callback: () => void) => {
    if (!user) {
      setView('auth');
      return;
    }
    callback();
  };

  const handleNavClick = (tab: 'guidance' | 'verify') => {
    if (!user) {
      setView('auth');
    } else {
      setView('dashboard');
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-textMain selection:bg-primary/30 overflow-x-hidden font-sans">
      {/* Dynamic Cinematic Video Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          className="w-full h-full object-cover opacity-35"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-plexus-background-loop-33678-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#04080e]/95 via-[#04080e]/70 to-[#04080e] mix-blend-multiply" />
        <div className="absolute top-[0%] left-[10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[0%] right-[10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg/40 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center group cursor-pointer" onClick={() => {
            if (user) {
              setView('dashboard');
              setActiveTab('guidance');
            } else {
              setView('landing');
            }
          }}>
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
              onClick={() => handleNavClick('guidance')}
              className={`nav-tab px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                view === 'dashboard' && activeTab === 'guidance' 
                  ? 'active' 
                  : ''
              }`}
            >
              Access Documents
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavClick('verify')}
              className={`nav-tab px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                view === 'dashboard' && activeTab === 'verify' 
                  ? 'active' 
                  : ''
              }`}
            >
              Scan Document
            </motion.button>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})} className="hidden md:flex text-xs font-black text-textSecondary hover:text-white transition-colors tracking-[0.2em] uppercase">
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
                onClick={() => setView('auth')}
                className="flex items-center gap-3 px-7 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-xs font-black text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all uppercase tracking-widest"
              >
                <UserIcon className="w-4 h-4" /> <span>Login</span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Main App Container */}
      <main className="relative z-10 pt-28 pb-0 max-w-[1400px] mx-auto px-6 min-h-screen flex flex-col transition-all duration-500">
        
        {/* Dynamic Page Router */}
        <div className="flex-1">
           <AnimatePresence mode="wait">
             <motion.div
               key={view === 'dashboard' ? `${view}_${activeTab}` : view}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.3 }}
             >
               {view === 'landing' && (
                 <LandingPage 
                   onGetStarted={() => setView('auth')} 
                   onLogin={() => setView('auth')} 
                 />
               )}
               {view === 'auth' && (
                 <AuthPage 
                   onSuccess={(userData) => {
                     setUser(userData);
                     setView('dashboard');
                     setActiveTab('guidance');
                   }} 
                   onBack={() => setView('landing')} 
                 />
               )}
               {view === 'dashboard' && user && (
                 activeTab === 'guidance' ? (
                   <GuidancePage onRequireAuth={requireAuth} user={user} />
                 ) : (
                   <VerificationPage onRequireAuth={requireAuth} user={user} />
                 )
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
                    <li><button onClick={() => handleNavClick('guidance')} className="hover:text-primary transition">Document Search</button></li>
                    <li><button className="hover:text-primary transition">AI Chatbot</button></li>
                    <li><button onClick={() => handleNavClick('verify')} className="hover:text-primary transition">Fraud Verification</button></li>
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