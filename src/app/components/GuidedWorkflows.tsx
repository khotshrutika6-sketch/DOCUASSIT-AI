import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, ExternalLink, Play, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkflowStep {
  number: number;
  title: string;
  description: string;
  portalName: string;
  portalUrl: string;
}

interface WorkflowPackage {
  id: string;
  title: string;
  icon: string;
  description: string;
  badge: string;
  steps: WorkflowStep[];
}

const WORKFLOW_PACKAGES: WorkflowPackage[] = [
  {
    id: 'business',
    title: "I'm Starting a Business",
    icon: '🚀',
    badge: 'Entrepreneur',
    description: 'Get registered, tax-compliant, and priority lending status in 3 sequential steps.',
    steps: [
      {
        number: 1,
        title: 'Apply for PAN / TAN Card',
        description: 'Every corporate entity or sole proprietorship needs a Permanent Account Number for financial audits.',
        portalName: 'NSDL TIN Portal',
        portalUrl: 'https://www.tin-nsdl.com'
      },
      {
        number: 2,
        title: 'Register MSME Udyam',
        description: 'Register your startup on the government Udyam portal to access micro-lending schemes and tax holidays.',
        portalName: 'Udyam Registration',
        portalUrl: 'https://udyamregistration.gov.in'
      },
      {
        number: 3,
        title: 'Register for Goods & Services Tax (GST)',
        description: 'Complete registration to legally invoice clients, collect tax, and claim Input Tax Credits (ITC).',
        portalName: 'GST Portal',
        portalUrl: 'https://www.gst.gov.in'
      }
    ]
  },
  {
    id: 'moving',
    title: 'I Just Moved to a New State',
    icon: '📦',
    badge: 'Relocation',
    description: 'Migrate your identity cards and vehicle registry files smoothly to your new home.',
    steps: [
      {
        number: 1,
        title: 'Update Aadhaar Address Record',
        description: 'Update the address on your primary identity proof using a new lease agreement or utility bill.',
        portalName: 'UIDAI Portal',
        portalUrl: 'https://myaadhaar.uidai.gov.in'
      },
      {
        number: 2,
        title: 'Migrate Voter Registration (Form 8A)',
        description: 'Transfer your voter card registry to your new local polling constituency to maintain voting rights.',
        portalName: 'Voter Service Portal (NVSP)',
        portalUrl: 'https://voters.eci.gov.in'
      },
      {
        number: 3,
        title: 'Vehicle Road Tax & Re-Registration',
        description: 'Obtain an NOC from your previous state and pay local road tax at your new RTO within 12 months.',
        portalName: 'Parivahan Sewa',
        portalUrl: 'https://parivahan.gov.in'
      }
    ]
  },
  {
    id: 'student',
    title: 'Student Education Portal Pack',
    icon: '🎓',
    badge: 'Academic',
    description: 'Verify your board certificates and academic degrees for placements and scholarships.',
    steps: [
      {
        number: 1,
        title: 'Sync Board Marksheets to DigiLocker',
        description: 'Pull verified copies of 10th and 12th certificates directly into your secure locker.',
        portalName: 'DigiLocker',
        portalUrl: 'https://www.digilocker.gov.in'
      },
      {
        number: 2,
        title: 'Register with National Academic Depository',
        description: 'Link college degrees and college transcripts to your profile for easy verification by employers.',
        portalName: 'NAD Portal',
        portalUrl: 'https://nad.gov.in'
      },
      {
        number: 3,
        title: 'File for National Scholarships (NSP)',
        description: 'Check active scholarship criteria and submit credentials for educational financing support.',
        portalName: 'National Scholarship Portal',
        portalUrl: 'https://services.india.gov.in'
      }
    ]
  }
];

export function GuidedWorkflows() {
  const [activeWorkflow, setActiveWorkflow] = useState<string>('business');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (wfId: string, stepNum: number) => {
    const key = `${wfId}_${stepNum}`;
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getWorkflowProgress = (wf: WorkflowPackage) => {
    const steps = wf.steps.length;
    const completed = wf.steps.filter(s => completedSteps[`${wf.id}_${s.number}`]).length;
    return Math.round((completed / steps) * 100);
  };

  const selectedWorkflow = WORKFLOW_PACKAGES.find(w => w.id === activeWorkflow) || WORKFLOW_PACKAGES[0];
  const progressPercent = getWorkflowProgress(selectedWorkflow);

  return (
    <div className="glass-card bg-white/[0.02] border-white/10 p-8 rounded-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
          ⚡
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Guided Life Event Workflows</h2>
          <p className="text-textSecondary text-sm">Follow sequential pathways linking multiple portals to settle major tasks.</p>
        </div>
      </div>

      {/* Package Tabs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {WORKFLOW_PACKAGES.map((wf) => {
          const isActive = activeWorkflow === wf.id;
          const percent = getWorkflowProgress(wf);
          return (
            <div
              key={wf.id}
              onClick={() => setActiveWorkflow(wf.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isActive 
                  ? 'border-primary bg-primary/10 text-white shadow-[0_0_20px_rgba(34,197,94,0.15)]' 
                  : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02] text-textSecondary'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-3xl">{wf.icon}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                    isActive ? 'bg-primary/20 text-white border border-primary/30' : 'bg-white/5 border border-white/10 text-textMuted'
                  }`}>
                    {wf.badge}
                  </span>
                </div>
                <h3 className="font-black text-base text-white mb-2">{wf.title}</h3>
                <p className="text-textSecondary text-xs leading-relaxed mb-4">{wf.description}</p>
              </div>

              {/* Progress bar */}
              <div className="mt-2">
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <span className="text-textMuted font-bold">Progress</span>
                  <span className="text-primary font-black">{percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Workflow steps checklist */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-primary">Active Pathway</span>
            <h3 className="text-xl font-black text-white mt-1">{selectedWorkflow.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-textSecondary font-medium">Progress:</span>
            <span className="text-primary text-base font-black">{progressPercent}%</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-6">
          {selectedWorkflow.steps.map((step, idx) => {
            const isCompleted = !!completedSteps[`${selectedWorkflow.id}_${step.number}`];
            
            return (
              <div 
                key={step.number}
                className={`flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border transition-all ${
                  isCompleted 
                    ? 'border-primary/10 bg-primary/[0.02]' 
                    : 'border-white/5 bg-white/[0.01]'
                }`}
              >
                {/* Step indicator */}
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleStep(selectedWorkflow.id, step.number)}
                    className={`w-10 h-10 rounded-full border font-black flex items-center justify-center transition-all ${
                      isCompleted 
                        ? 'bg-primary border-primary text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
                        : 'border-white/10 hover:border-primary/50 text-textSecondary hover:text-white'
                    }`}
                  >
                    {isCompleted ? '✓' : step.number}
                  </button>
                </div>

                {/* Step info & portal launch */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className={`text-base font-black ${isCompleted ? 'text-textMuted line-through' : 'text-white'}`}>
                      {step.title}
                    </h4>
                    <p className="text-textSecondary text-sm mt-1 leading-relaxed max-w-2xl">{step.description}</p>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-center">
                    <a
                      href={step.portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all"
                    >
                      <span>{step.portalName}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {progressPercent === 100 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-center space-y-2"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-xl">
              🏆
            </div>
            <h4 className="text-lg font-black text-white">Congratulations!</h4>
            <p className="text-sm text-textSecondary max-w-md mx-auto">
              You have completed all steps in the <strong>{selectedWorkflow.title}</strong> package and verified all required applications.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
