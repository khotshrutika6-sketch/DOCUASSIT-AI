import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity as ActivityIcon, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Settings 
} from 'lucide-react';
import { activityService, Activity } from '../services/activityService';
import { User } from '../services/authService';

interface RecentActivityProps {
  user: User;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ user }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchActivities = () => {
    if (user?.id) {
      setActivities(activityService.getActivities(user.id));
    }
  };

  useEffect(() => {
    fetchActivities();

    // Listen for custom events to refresh history dynamically
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.userId === user?.id) {
        fetchActivities();
      }
    };

    window.addEventListener('docassist_activity_update', handleUpdate);
    return () => {
      window.removeEventListener('docassist_activity_update', handleUpdate);
    };
  }, [user]);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your recent activity?')) {
      activityService.clearActivities(user.id);
    }
  };

  const getStatusBadge = (status: Activity['status']) => {
    const base = "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ";
    switch (status) {
      case 'Verified':
      case 'Approved':
      case 'Completed':
        return `${base} bg-green-500/10 border-green-500/20 text-green-400`;
      case 'Processing':
      case 'Pending':
        return `${base} bg-yellow-500/10 border-yellow-500/20 text-yellow-400 animate-pulse`;
      case 'Failed':
      case 'Rejected':
        return `${base} bg-red-500/10 border-red-500/20 text-red-400`;
      default:
        return `${base} bg-white/5 border-white/10 text-white`;
    }
  };

  const getActivityIcon = (type: string) => {
    const baseClass = "w-5 h-5";
    switch (type) {
      case 'verification':
        return <ShieldCheck className={`${baseClass} text-green-400`} />;
      case 'service':
        return <ExternalLink className={`${baseClass} text-blue-400`} />;
      case 'workflow':
        return <TrendingUp className={`${baseClass} text-purple-400`} />;
      case 'checklist':
        return <FileText className={`${baseClass} text-amber-400`} />;
      case 'reminder':
        return <Clock className={`${baseClass} text-rose-400`} />;
      default:
        return <ActivityIcon className={`${baseClass} text-gray-400`} />;
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 backdrop-blur-3xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ActivityIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider leading-none">Security Activity Feed</h3>
            <p className="text-[10px] text-textSecondary uppercase tracking-widest mt-1">Real-time forensic & portal logs</p>
          </div>
        </div>
        {activities.length > 0 && (
          <button 
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Log
          </button>
        )}
      </div>

      {/* List content */}
      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {activities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 px-4"
            >
              <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ActivityIcon className="w-6 h-6 text-textMuted" />
              </div>
              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-2">No recent activity found</h4>
              <p className="text-textSecondary text-xs max-w-xs mx-auto">
                Start using verification services or explore guides to build your activity history.
              </p>
            </motion.div>
          ) : (
            activities.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.3) }}
                className="flex items-start gap-4 p-4 hover:bg-white/[0.02] border border-transparent hover:border-white/5 rounded-2xl transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <h4 className="font-bold text-sm text-white truncate pr-2">{activity.title}</h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                  
                  {activity.details && (
                    <p className="text-xs text-textSecondary line-clamp-2 mb-2 font-medium">
                      {activity.details}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-textMuted font-mono">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                    
                    {activity.progress !== undefined && activity.progress > 0 && activity.progress < 100 && (
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-white/10 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full transition-all duration-500" 
                            style={{ width: `${activity.progress}%` }} 
                          />
                        </div>
                        <span className="text-[9px] font-black text-primary">{activity.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
