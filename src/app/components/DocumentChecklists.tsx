import { useState } from 'react';
import { CheckSquare, Square, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChecklistItem {
  id: string;
  text: string;
  required: boolean;
  hint: string;
}

interface ChecklistGroup {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: ChecklistItem[];
}

const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    id: 'passport_appointment',
    title: 'Physical Passport Appointment Checklist',
    icon: '🛂',
    description: 'Ensure you carry these documents to the Passport Seva Kendra (PSK).',
    items: [
      { id: 'pa-1', text: 'Online Application Reference Sheet (ARN) printout', required: true, hint: 'Download from the passport portal after scheduling.' },
      { id: 'pa-2', text: 'Original Aadhaar Card', required: true, hint: 'Should have your full DOB (DD/MM/YYYY) printed.' },
      { id: 'pa-3', text: 'Original PAN Card or Driving License', required: true, hint: 'Used as secondary Photo Identity Proof.' },
      { id: 'pa-4', text: 'Original Birth Certificate or 10th Class Marksheet', required: true, hint: 'Non-ECR status proof requires a matriculation certificate.' },
      { id: 'pa-5', text: 'Proof of Address (Utility bill, Rent deed, or Bank passbook)', required: true, hint: 'Must match the current address on application.' },
      { id: 'pa-6', text: 'Photocopies of all original documents (1 set)', required: true, hint: 'Self-attested with your signature at the bottom.' }
    ]
  },
  {
    id: 'business_start',
    title: 'Starting a Business Documentation Kit',
    icon: '🏭',
    description: 'General documents required to register a startup or proprietorship.',
    items: [
      { id: 'bs-1', text: 'Personal PAN Card of the Founder(s)', required: true, hint: 'Required for tax filing and banking setup.' },
      { id: 'bs-2', text: 'Aadhaar Card of the Founder(s)', required: true, hint: 'Should be linked to active mobile for OTP validation.' },
      { id: 'bs-3', text: 'Proof of Business Address (Rent Agreement/Deed)', required: true, hint: 'Must clearly state permission for commercial use.' },
      { id: 'bs-4', text: 'Latest Utility Bill (Electricity/Water) of business premises', required: true, hint: 'Not older than 2 months, matching owner name on Rent Deed.' },
      { id: 'bs-5', text: 'No Objection Certificate (NOC) from Property Owner', required: true, hint: 'Signed declaration allowing business registration.' },
      { id: 'bs-6', text: 'GSTIN Registration', required: false, hint: 'Mandatory if turnover exceeds ₹40 Lakhs (goods) or ₹20 Lakhs (services).' },
      { id: 'bs-7', text: 'MSME Udyam Registration Certificate', required: false, hint: 'Free registration, yields priority bank lending benefits.' }
    ]
  },
  {
    id: 'state_move',
    title: 'Moving to a New State checklist',
    icon: '📦',
    description: 'Documentation timeline to transfer your residence inside India.',
    items: [
      { id: 'sm-1', text: 'Update Aadhaar Address online', required: true, hint: 'Requires a standard address proof or rent agreement.' },
      { id: 'sm-2', text: 'Transfer Voter ID registration (Form 8A)', required: true, hint: 'Request voting migration to new constituency.' },
      { id: 'sm-3', text: 'Vehicle No Objection Certificate (NOC) from old RTO', required: true, hint: 'Mandatory if relocating vehicle permanently.' },
      { id: 'sm-4', text: 'Pay Road Tax at the new state RTO', required: true, hint: 'Required for registering old vehicle record in new state.' },
      { id: 'sm-5', text: 'Submit Vehicle Re-Registration records', required: true, hint: 'Convert old license plate to new state series within 12 months.' }
    ]
  },
  {
    id: 'student_edu',
    title: 'Student Higher Education Checklist',
    icon: '🎓',
    description: 'Verify your credentials before applying for colleges or scholarships.',
    items: [
      { id: 'se-1', text: 'DigiLocker Account verified setup', required: true, hint: 'Link details to CBSE or State Board records.' },
      { id: 'se-2', text: 'National Academic Depository (NAD) Profile', required: true, hint: 'Holds digital degrees & college marksheet records.' },
      { id: 'se-3', text: 'Original 10th & 12th Passing Certificates', required: true, hint: 'Checked during university registration counseling.' },
      { id: 'se-4', text: 'Active Domicile Certificate', required: false, hint: 'Highly useful for state quota college seats.' },
      { id: 'se-5', text: 'National Scholarship Portal (NSP) Profile ID', required: false, hint: 'Register for student financial aid grants.' }
    ]
  }
];

export function DocumentChecklists() {
  const [openGroup, setOpenGroup] = useState<string>('passport_appointment');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getCompletionPercentage = (group: ChecklistGroup) => {
    const total = group.items.length;
    const completed = group.items.filter(item => checkedItems[item.id]).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="glass-card bg-white/[0.02] border-white/10 p-8 rounded-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
          📋
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Interactive Document Checklists</h2>
          <p className="text-textSecondary text-sm">Prepare all your papers step-by-step for key life events and official visits.</p>
        </div>
      </div>

      <div className="space-y-6">
        {CHECKLIST_GROUPS.map((group) => {
          const isOpen = openGroup === group.id;
          const percent = getCompletionPercentage(group);
          
          return (
            <div 
              key={group.id}
              className="border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl overflow-hidden transition-colors"
            >
              {/* Group Header */}
              <div 
                onClick={() => setOpenGroup(isOpen ? '' : group.id)}
                className="p-6 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-3xl">{group.icon}</span>
                  <div>
                    <h3 className="text-lg font-black text-white">{group.title}</h3>
                    <p className="text-textSecondary text-xs mt-1">{group.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Progress Indicator */}
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-textSecondary">{percent}%</span>
                  </div>

                  {isOpen ? <ChevronUp className="w-5 h-5 text-textMuted" /> : <ChevronDown className="w-5 h-5 text-textMuted" />}
                </div>
              </div>

              {/* Progress for Mobile */}
              <div className="sm:hidden px-6 pb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-textMuted">Task Progress</span>
                  <span className="text-primary font-bold">{percent}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300" 
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-black/20 border-t border-white/5"
                  >
                    <div className="p-6 space-y-4">
                      {group.items.map((item) => {
                        const isChecked = !!checkedItems[item.id];
                        return (
                          <div 
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-colors border select-none ${
                              isChecked 
                                ? 'border-primary/20 bg-primary/5 text-white/90' 
                                : 'border-white/5 bg-white/[0.01] hover:bg-white/5 text-textSecondary'
                            }`}
                          >
                            <div className="mt-0.5">
                              {isChecked 
                                ? <CheckSquare className="w-5 h-5 text-primary" /> 
                                : <Square className="w-5 h-5 text-textMuted" />
                              }
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold text-sm ${isChecked ? 'line-through text-textMuted' : 'text-white'}`}>
                                  {item.text}
                                </span>
                                {item.required && (
                                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[9px] uppercase font-black tracking-widest rounded border border-red-500/20">
                                    Mandatory
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-textMuted mt-1 leading-relaxed">{item.hint}</p>
                            </div>
                          </div>
                        );
                      })}

                      {percent === 100 && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl flex items-center gap-3 justify-center font-bold"
                        >
                          <CheckCircle className="w-5 h-5" /> All checked off! You are fully prepared to proceed.
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
