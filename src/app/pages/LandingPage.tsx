import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Sparkles, FileText, Lock, ArrowRight, Play } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    // Generate static details for random particles to prevent SSR / hydration mismatch
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5
    }));
    setParticles(generated);
  }, []);

  const features = [
    { name: 'Aadhaar Services', desc: 'Securely verify, link, or update demographic and biometric records.', icon: '🆔' },
    { name: 'Passport Services', desc: 'Navigate applications, renewals, and background clearance schedules.', icon: '🛂' },
    { name: 'PAN Services', desc: 'Verify tax IDs, request updates, and check Aadhaar-linking records.', icon: '💳' },
    { name: 'Driving License', desc: 'Walk through regional test applications, renewals, and registry changes.', icon: '🚗' },
    { name: 'Voter ID', desc: 'Verify electoral register listings, change details, or request a card.', icon: '🗳️' }
  ];

  return (
    <div className="w-full text-left relative overflow-hidden -mt-28">
      {/* 1. HERO SECTION (100vh) */}
      <section className="min-h-screen flex items-center justify-center relative pt-20 px-4">
        {/* Video Background */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.65) saturate(1.3)' }}
          >
            <source src="/14414001_640_360_24fps (1).mp4" type="video/mp4" />
          </video>
          {/* Subtle dark overlay — keeps text readable but video visible */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/30" />
          {/* Bottom fade to blend into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>

        {/* Particle Backdrop Layer — floats above video */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute bg-green-400 rounded-full opacity-20"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear"
              }}
            />
          ))}
          {/* Pulsing Radial Orbs */}
          <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '12s' }} />
        </div>

        <div className="max-w-[1200px] mx-auto w-full relative z-[2] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content Left */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-primary uppercase tracking-widest"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-powered Government Assistance</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.1] text-white tracking-tight"
            >
              Access, Verify and <br />
              Manage Documents <br />
              <span className="text-gradient-emerald">Securely.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-textSecondary text-base sm:text-lg max-w-xl font-medium leading-relaxed"
            >
              DocuAssist is an enterprise-grade assistant for navigating government services, verifying credentials, and automating verification checks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <button
                onClick={onGetStarted}
                className="btn-premium px-8 py-4 text-xs font-black uppercase tracking-wider shadow-[0_0_30px_rgba(34,197,94,0.4)] flex items-center gap-2 hover:scale-[1.03] transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onGetStarted} // Triggers signup/watch demo
                className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 transition-all hover:scale-[1.03]"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Watch Demo</span>
              </button>
            </motion.div>
          </div>

          {/* Hero Graphic Right (Glassmorphic Mockup UI) */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative rounded-[2.5rem] bg-gradient-to-br from-white/[0.06] to-white/[0.01] border border-white/10 p-8 shadow-2xl backdrop-blur-2xl"
            >
              {/* Neon accent strip */}
              <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-[#22c55e] to-transparent shadow-[0_0_20px_#22c55e]" />
              
              {/* Floating glass overlay card */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/60" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <span className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-primary font-bold">Active Engine</span>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">Document Validity</span>
                    <span className="text-xs font-black text-primary">98.4%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[98.4%]" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-textSecondary">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span>Metadata integrity validation complete</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-textSecondary">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span>No structural tampering signatures found</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-textSecondary">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <span>Scanning digital casing matching patterns</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-textMuted uppercase font-black tracking-widest">Target: Aadhaar Card</span>
                  <span className="text-[10px] text-primary font-mono">Status: Authenticating</span>
                </div>
              </div>
            </motion.div>

            {/* Extra floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-8 p-4 bg-emerald-950/40 border border-primary/20 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-textSecondary font-bold leading-none uppercase">Encryption</p>
                <p className="text-xs text-white font-black leading-none mt-1">AES-256 Active</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. OVERVIEW SECTION (Why Choose DocuAssist?) */}
      <section className="py-28 px-4 border-t border-white/5 bg-black/[0.15] relative">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase font-black tracking-[0.3em] text-primary">Key Benefits</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Why Choose DocuAssist?</h3>
            <p className="text-textSecondary text-sm">
              We leverage advanced artificial intelligence to streamline document operations and audit digital records securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: '⚡ Save Time', desc: 'Skip public queues. Get immediate templates, checklists, and automated reminders.', color: 'from-green-500/10 to-emerald-500/5' },
              { title: '🔒 Secure Verification', desc: 'State-of-the-art cryptographic validation checks for edit histories and metadata.', color: 'from-blue-500/10 to-indigo-500/5' },
              { title: '🤖 AI Guidance', desc: 'Interactive step-by-step assistance in filling out complex government forms.', color: 'from-purple-500/10 to-violet-500/5' },
              { title: '📄 Smart Documentation', desc: 'Instantly format, compress, scan and draft agreements in plain English or local languages.', color: 'from-amber-500/10 to-orange-500/5' }
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`p-8 bg-gradient-to-br ${card.color} border border-white/5 rounded-3xl relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-xl" />
                <h4 className="text-lg font-black text-white mb-3">{card.title}</h4>
                <p className="text-textSecondary text-xs leading-relaxed font-medium">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS TIMELINE */}
      <section className="py-28 px-4 relative">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs uppercase font-black tracking-[0.3em] text-primary">Process Flow</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">How It Works</h3>
            <p className="text-textSecondary text-sm">Get access to all digital features in three straightforward steps.</p>
          </div>

          <div className="relative border-l border-white/10 ml-4 md:ml-0 md:border-l-0 md:flex md:justify-between md:gap-12 space-y-12 md:space-y-0">
            {[
              { step: '1', title: 'Create Account', desc: 'Securely authenticate via email or Google to open your personal dashboard workspace.' },
              { step: '2', title: 'Select Service', desc: 'Choose between access directories, drafting templates, or scanning specific document files.' },
              { step: '3', title: 'Complete Documentation', desc: 'Receive AI compliance analysis, check validity scores, and finalize application files.' }
            ].map((node, i) => (
              <div key={i} className="relative md:flex-1 pl-10 md:pl-0 md:text-center group">
                {/* Visual Connector Dot */}
                <div className="absolute top-1 left-[-21px] md:relative md:left-0 md:mx-auto w-10 h-10 rounded-full bg-surface border border-white/10 group-hover:border-primary/50 flex items-center justify-center text-sm font-black text-white transition-all shadow-md">
                  {node.step}
                </div>
                <h4 className="text-lg font-bold text-white mt-4 mb-2">{node.title}</h4>
                <p className="text-textSecondary text-xs max-w-xs md:mx-auto leading-relaxed">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES SHOWCASE (Locked / Blurred Previews) */}
      <section className="py-28 px-4 border-t border-white/5 bg-black/[0.1] relative">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase font-black tracking-[0.3em] text-primary">Modules Catalogue</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Supported Portals</h3>
            <p className="text-textSecondary text-sm">Secure access is required to interact with specific agency modules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {features.map((feat, i) => (
              <div key={i} className="relative group overflow-hidden bg-white/[0.02] border border-white/5 rounded-3xl p-6 transition-all duration-300">
                {/* Blur filter overlay */}
                <div className="blur-[1.5px] opacity-40 select-none pointer-events-none transition-all group-hover:opacity-20 space-y-4">
                  <div className="text-3xl">{feat.icon}</div>
                  <h4 className="text-sm font-black text-white">{feat.name}</h4>
                  <p className="text-[10px] text-textSecondary leading-relaxed">{feat.desc}</p>
                </div>
                
                {/* Lock Overlay Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] transition-all">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-2 shadow-lg">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-white leading-none">Login Required</span>
                  <button 
                    onClick={onLogin}
                    className="mt-3 px-3 py-1 bg-primary/20 hover:bg-primary/30 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-wider rounded-lg transition-all"
                  >
                    Unlock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS / STATS COUNTER */}
      <section className="py-20 px-4 relative bg-gradient-to-r from-emerald-950/20 to-primary/5 border-t border-b border-white/5">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { value: '50,000+', label: 'Documents Audited' },
            { value: '99.8%', label: 'Scan Reliability Rate' },
            { value: '24/7', label: 'AI Forensic Nodes Online' }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <h4 className="text-4xl sm:text-5xl font-black text-white tracking-tight">{stat.value}</h4>
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-primary">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        </div>

        <div className="max-w-xl mx-auto relative z-10 space-y-8">
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Ready to verify records?</h3>
          <p className="text-textSecondary text-sm sm:text-base leading-relaxed">
            Create an enterprise audit account today. Instantly upload files, review metadata integrity, and scan compliance indicators.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="btn-premium px-8 py-4 text-xs font-black uppercase tracking-wider"
            >
              <span>Sign Up Now</span>
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-black uppercase tracking-wider text-white transition-all"
            >
              <span>Log In</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
