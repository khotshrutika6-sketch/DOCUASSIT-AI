import { useState, useEffect } from 'react';
import { Calendar, AlertTriangle, Plus, Trash2, ExternalLink, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Reminder {
  id: string;
  docName: string;
  docType: string;
  docNumber: string;
  expiryDate: string;
  renewalLink: string;
}

const DEFAULT_DOC_TYPES = [
  { value: 'driving_license', label: 'Driving License', link: 'https://parivahan.gov.in' },
  { value: 'passport', label: 'Passport', link: 'https://www.passportindia.gov.in' },
  { value: 'rc', label: 'Registration Certificate (RC)', link: 'https://parivahan.gov.in' },
  { value: 'puc', label: 'Pollution Certificate (PUC)', link: 'https://parivahan.gov.in' },
  { value: 'insurance', label: 'Vehicle Insurance', link: 'https://parivahan.gov.in' },
  { value: 'other', label: 'Other Document', link: 'https://services.india.gov.in' }
];

export function DocumentReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form fields
  const [docType, setDocType] = useState('driving_license');
  const [customName, setCustomName] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('doc_reminders');
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse reminders:', e);
      }
    } else {
      // Load initial seed reminders to demonstrate capability
      const demo: Reminder[] = [
        {
          id: 'demo-1',
          docName: 'Driving License',
          docType: 'driving_license',
          docNumber: 'DL-142016008892',
          expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Expires in 25 days
          renewalLink: 'https://parivahan.gov.in'
        },
        {
          id: 'demo-2',
          docName: 'Passport',
          docType: 'passport',
          docNumber: 'Z3920199',
          expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Expires in 180 days
          renewalLink: 'https://www.passportindia.gov.in'
        }
      ];
      setReminders(demo);
      localStorage.setItem('doc_reminders', JSON.stringify(demo));
    }
  }, []);

  const saveReminders = (list: Reminder[]) => {
    setReminders(list);
    localStorage.setItem('doc_reminders', JSON.stringify(list));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expiryDate) return;

    const matchedType = DEFAULT_DOC_TYPES.find(d => d.value === docType);
    const docName = docType === 'other' ? customName || 'Other Document' : matchedType?.label || 'Document';
    const renewalLink = matchedType?.link || 'https://services.india.gov.in';

    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      docName,
      docType,
      docNumber: docNumber || 'N/A',
      expiryDate,
      renewalLink
    };

    const updated = [...reminders, newReminder];
    saveReminders(updated);

    // Reset Form
    setCustomName('');
    setDocNumber('');
    setExpiryDate('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    saveReminders(updated);
  };

  const getDaysRemaining = (expiryStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryStr);
    expiry.setHours(0, 0, 0, 0);
    
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (days: number) => {
    if (days < 0) {
      return (
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" /> Expired
        </span>
      );
    }
    if (days <= 30) {
      return (
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-red-400/20 text-red-400 border border-red-400/30 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> Critical (&lt;30d)
        </span>
      );
    }
    if (days <= 90) {
      return (
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Warning (&lt;90d)
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" /> Healthy
      </span>
    );
  };

  return (
    <div className="glass-card bg-white/[0.02] border-white/10 p-8 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
            📅
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Document Expiry Reminders</h2>
            <p className="text-textSecondary text-sm">Keep track of key validation timelines in secure, private local storage.</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(!isAdding)}
          className="btn-premium py-3 px-6 text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Document Tracker
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8 border-b border-white/5 pb-8"
          >
            <form onSubmit={handleAddReminder} className="bg-white/5 p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Document Type</label>
                <select 
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50"
                >
                  {DEFAULT_DOC_TYPES.map(t => (
                    <option key={t.value} value={t.value} className="bg-surface">{t.label}</option>
                  ))}
                </select>
              </div>

              {docType === 'other' && (
                <div>
                  <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Document Name</label>
                  <input 
                    type="text" 
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter Custom Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Document Code / No.</label>
                <input 
                  type="text" 
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="e.g. DL, Passport Code"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Expiration Date</label>
                <input 
                  type="date" 
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-premium flex-1 py-3 text-sm flex items-center justify-center"
                >
                  Save Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm font-bold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded-2xl">
          <Calendar className="w-10 h-10 text-textMuted mx-auto mb-3 opacity-30" />
          <p className="text-sm text-textSecondary font-medium">No active document expirations tracked.</p>
          <p className="text-xs text-textMuted mt-1">Add details above to get countdown alerts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reminders.map((reminder) => {
            const days = getDaysRemaining(reminder.expiryDate);
            return (
              <motion.div
                key={reminder.id}
                layout
                className={`bg-white/[0.02] border rounded-2xl p-6 relative flex flex-col justify-between transition-colors ${
                  days < 0 
                    ? 'border-red-500/20 bg-red-500/[0.01]' 
                    : days <= 30 
                    ? 'border-red-400/20 bg-red-400/[0.01]' 
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-black text-white">{reminder.docName}</h3>
                      <p className="text-xs font-mono text-textMuted mt-1">Ref: {reminder.docNumber}</p>
                    </div>
                    {getStatusBadge(days)}
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-textSecondary">Expiry Date:</span>
                      <span className="text-white">{reminder.expiryDate}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-textSecondary">Timeline Status:</span>
                      <span className={days < 0 ? 'text-red-400 font-bold' : days <= 30 ? 'text-red-400 font-bold animate-pulse' : days <= 90 ? 'text-yellow-400' : 'text-emerald-400'}>
                        {days < 0 
                          ? `Expired by ${Math.abs(days)} days` 
                          : days === 0 
                          ? 'Expires today!' 
                          : `${days} days remaining`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <a
                    href={reminder.renewalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-black uppercase tracking-wider text-textSecondary hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Renew Online</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 rounded-xl text-textMuted hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
