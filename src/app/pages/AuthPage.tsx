import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Chrome, ArrowRight, Loader2, ShieldCheck, Cpu, KeyRound, ChevronLeft } from 'lucide-react';
import { authService } from '../services/authService';

interface AuthPageProps {
  onSuccess: (user: any) => void;
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (isLogin) {
        result = await authService.login(formData.email, formData.password);
      } else {
        result = await authService.register(formData.name, formData.email, formData.password);
        if (result.success) {
          result = await authService.login(formData.email, formData.password);
        }
      }

      if (result.success) {
        onSuccess(result.user);
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.googleLogin();
      if (result.success) {
        onSuccess(result.user);
      } else {
        setError(result.error || 'Google login failed');
      }
    } catch (err) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col lg:flex-row bg-[#020617] overflow-y-auto">
      
      {/* Back button overlay */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 z-50 flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-xs font-black uppercase tracking-wider text-textSecondary hover:text-white rounded-full transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* LEFT COLUMN: Visuals, Benefits & Badges */}
      <div className="lg:w-[45%] bg-gradient-to-br from-[#020d18] via-[#041220] to-[#010810] border-r border-white/5 p-12 lg:p-20 flex flex-col justify-between relative overflow-hidden min-h-[40vh] lg:min-h-screen">
        {/* Glow Spheres */}
        <div className="absolute top-[10%] left-[-10%] w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <img src="/logo.png" alt="DocuAssist Logo" className="h-10 w-auto" />
        </div>

        <div className="relative z-10 my-auto py-12 space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
              Enterprise Secure <br />
              Credentials Management
            </h2>
            <p className="text-textSecondary text-sm max-w-sm font-medium">
              Analyze document metadata, verify fraud indicators, and complete secure workflows on a centralized compliance platform.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white leading-none mb-1">Forensic Analysis</h4>
                <p className="text-textSecondary text-xs">Multi-layer image verification for EXIF metadata and pixel edits.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white leading-none mb-1">Interactive AI Assistant</h4>
                <p className="text-textSecondary text-xs">Checklist mapping, dynamic guidelines, and custom reminders.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white leading-none mb-1">AES-256 Memory Guard</h4>
                <p className="text-textSecondary text-xs">Encrypted client storage ensures user-scoped records remain locked.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badges Footer */}
        <div className="relative z-10 pt-6 border-t border-white/5 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-1.5 opacity-65 hover:opacity-100 transition-opacity">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[9px] uppercase font-mono tracking-widest text-white">ISO 27001</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-65 hover:opacity-100 transition-opacity">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[9px] uppercase font-mono tracking-widest text-white">GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-65 hover:opacity-100 transition-opacity">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[9px] uppercase font-mono tracking-widest text-white">AES-256 Secured</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Sign In / Register Forms */}
      <div className="lg:w-[55%] flex items-center justify-center p-8 lg:p-20 relative bg-[#020617]">
        <div className="absolute top-0 right-1/4 left-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#22c55e] to-transparent shadow-[0_0_15px_rgba(34,197,94,0.4)]" />

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h3 className="text-3xl font-black text-white tracking-tight">
              {isLogin ? 'Welcome ' : 'Register '} 
              <span className="text-gradient-emerald">{isLogin ? 'Back' : 'Account'}</span>
            </h3>
            <p className="text-textSecondary text-sm mt-2 font-medium">
              {isLogin ? 'Log in to audit records and manage dashboard services.' : 'Create your secure account to start auditing documents.'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative group overflow-hidden"
                >
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all text-white"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all text-white"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group p-4 rounded-2xl font-bold text-sm text-white tracking-wide overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-6"
              style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)', boxShadow: '0 0 20px rgba(34,197,94,0.4)' }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In to Platform' : 'Generate Account credentials'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                <span className="bg-[#020617] px-4 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all font-bold text-xs text-white cursor-pointer"
            >
              <Chrome className="w-4 h-4 text-red-500" />
              <span>Continue with Google Secure Auth</span>
            </button>
          </div>

          <div className="text-center pt-4">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an audit account? " : "Already registered? "}
              <span className="text-primary font-bold">{isLogin ? 'Create one now' : 'Log in here'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
