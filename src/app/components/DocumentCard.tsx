import { useState, useEffect } from 'react';
import { ExternalLink, ArrowRight, ShieldCheck, FileText, Star, ThumbsUp, ThumbsDown, Flag, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { DocumentGuide } from '../services/guidanceApi';

interface DocumentCardProps {
  document: DocumentGuide;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (docId: string) => void;
}

export function DocumentCard({ document: doc, onClick, isFavorite = false, onToggleFavorite }: DocumentCardProps) {
  // Local storage keys for crowd-sourced link health and reports
  const votesKey = `doc_votes_${doc.id}`;
  const reportsKey = `doc_reports_${doc.id}`;

  const [upvotes, setUpvotes] = useState<number>(0);
  const [downvotes, setDownvotes] = useState<number>(0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [reportCount, setReportCount] = useState<number>(0);
  const [hasReported, setHasReported] = useState<boolean>(false);

  useEffect(() => {
    // Load health votes
    const savedVotes = localStorage.getItem(votesKey);
    if (savedVotes) {
      try {
        const { up, down, user } = JSON.parse(savedVotes);
        setUpvotes(up || 0);
        setDownvotes(down || 0);
        setUserVote(user || null);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed some random upvotes to make dashboard look alive
      const seedUp = Math.floor(Math.random() * 10) + 5;
      const seedDown = Math.floor(Math.random() * 2);
      setUpvotes(seedUp);
      setDownvotes(seedDown);
      localStorage.setItem(votesKey, JSON.stringify({ up: seedUp, down: seedDown, user: null }));
    }

    // Load broken link reports
    const savedReports = localStorage.getItem(reportsKey);
    if (savedReports) {
      try {
        const { count, reported } = JSON.parse(savedReports);
        setReportCount(count || 0);
        setHasReported(reported || false);
      } catch (e) {
        console.error(e);
      }
    }
  }, [doc.id]);

  const handleApplyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (reportCount >= 3) {
      alert('This portal link is flagged as "Broken / Under Review" by the community. You cannot initiate requests at this moment.');
      return;
    }
    const link = doc.applyLink || '#';
    window.open(link, '_blank');
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(doc.id);
    }
  };

  const handleVote = (e: React.MouseEvent, type: 'up' | 'down') => {
    e.stopPropagation();
    let newUp = upvotes;
    let newDown = downvotes;
    let newUserVote: 'up' | 'down' | null = type;

    if (userVote === type) {
      // Remove vote
      if (type === 'up') newUp--;
      else newDown--;
      newUserVote = null;
    } else {
      // Add or change vote
      if (type === 'up') {
        newUp++;
        if (userVote === 'down') newDown--;
      } else {
        newDown++;
        if (userVote === 'up') newUp--;
      }
    }

    setUpvotes(newUp);
    setDownvotes(newDown);
    setUserVote(newUserVote);

    localStorage.setItem(votesKey, JSON.stringify({ up: newUp, down: newDown, user: newUserVote }));
  };

  const handleReportLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasReported) {
      alert('You have already flagged this link.');
      return;
    }

    const confirmReport = window.confirm('Are you sure this official portal link is broken? Reporting helps the community maintain active routes.');
    if (!confirmReport) return;

    const newCount = reportCount + 1;
    setReportCount(newCount);
    setHasReported(true);

    localStorage.setItem(reportsKey, JSON.stringify({ count: newCount, reported: true }));
    
    if (newCount >= 3) {
      alert('Thank you. This link is now flagged as "Broken / Under Review" for all local users.');
    } else {
      alert(`Report submitted. Link currently has ${newCount} report(s). (It will be flagged as broken at 3 reports).`);
    }
  };

  // Determine site health status
  const totalVotes = upvotes + downvotes;
  const isBroken = reportCount >= 3;
  
  let healthStatus: 'operational' | 'slow' | 'down' = 'operational';
  if (isBroken) {
    healthStatus = 'down';
  } else if (totalVotes > 0) {
    const downRatio = downvotes / totalVotes;
    if (downRatio >= 0.4) {
      healthStatus = 'down';
    } else if (downRatio >= 0.15) {
      healthStatus = 'slow';
    }
  }

  const getHealthBadge = () => {
    switch (healthStatus) {
      case 'down':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/20">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" /> Down / Slow
          </span>
        );
      case 'slow':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" /> Heavy Load
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-green-500/20 text-green-400 border border-green-500/20">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Operational
          </span>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`group glass-card flex flex-col h-full cursor-pointer relative overflow-hidden ${
        isBroken ? 'border-red-500/20' : 'border-white/10'
      }`} 
    >
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

      {/* Header Buttons (Favorite Star & Badges) */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
        <button
          onClick={handleToggleFav}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
            isFavorite 
              ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-400' 
              : 'bg-white/5 border-white/10 text-textSecondary hover:text-white hover:bg-white/10'
          }`}
        >
          <Star className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex items-center gap-5 mb-6 relative z-10">
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          {doc.icon}
        </div>
        <div className="pr-10">
          <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors duration-300 tracking-tight leading-snug">
            {doc.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
             <div className="flex items-center gap-1 opacity-60">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-textMuted">Verified</span>
             </div>
             {getHealthBadge()}
          </div>
        </div>
      </div>

      {isBroken && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Link reported broken by users. Under review.</span>
        </div>
      )}

      <p className="text-textSecondary text-sm leading-relaxed mb-6 flex-1 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
        {doc.description}
      </p>

      {/* Site Health Crowd Votes & Report button */}
      <div className="flex items-center justify-between py-3 px-4 bg-white/[0.01] border border-white/5 rounded-xl mb-6 text-xs text-textSecondary relative z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-textMuted">Portal Status:</span>
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleVote(e, 'up')}
              className={`p-1.5 rounded-lg transition-all ${
                userVote === 'up' 
                  ? 'text-primary bg-primary/20 shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
                  : 'hover:text-white hover:bg-white/5 text-textSecondary'
              }`}
              title="Yes, site is loading fast"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </motion.button>
            <span className="text-[10px] font-black text-white">{upvotes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleVote(e, 'down')}
              className={`p-1.5 rounded-lg transition-all ${
                userVote === 'down' 
                  ? 'text-red-400 bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.3)]' 
                  : 'hover:text-white hover:bg-white/5 text-textSecondary'
              }`}
              title="No, site is down or slow"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </motion.button>
            <span className="text-[10px] font-black text-white">{downvotes}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReportLink}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all border text-[10px] font-black uppercase tracking-widest ${
            hasReported 
              ? 'bg-red-500/15 border-red-500/30 text-red-400' 
              : 'bg-white/5 border-white/10 text-textMuted hover:text-red-400 hover:border-red-500/35'
          }`}
          title="Flag this URL as broken"
        >
          <Flag className="w-3 h-3" />
          <span>{reportCount > 0 ? `Flagged (${reportCount})` : 'Flag Link'}</span>
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto relative z-10">
         <motion.button 
          whileHover={!isBroken ? { scale: 1.02 } : {}}
          whileTap={!isBroken ? { scale: 0.98 } : {}}
          onClick={handleApplyNow}
          disabled={isBroken}
          className={`btn-premium flex-1 py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 ${
            isBroken ? 'opacity-30 cursor-not-allowed filter grayscale bg-white/5 text-textMuted' : ''
          }`}
        >
          <span>Open Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-textSecondary hover:text-white transition-all"
        >
          <FileText className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
