import { useState, useEffect } from 'react';
import { Loader2, LayoutGrid, FileText, ChevronRight, MapPin, Star, Sliders, ClipboardList, BellRing, Sparkles, HelpCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { DocumentSearch } from '../components/DocumentSearch';
import { DocumentCard } from '../components/DocumentCard';
import { DocumentGuideView } from '../components/DocumentGuideView';
import { guidanceApi, DocumentGuide, GuidanceResponse } from '../services/guidanceApi';

// New Utility Components
import { DocumentScanner } from '../components/DocumentScanner';
import { DocumentTemplatePreviewer } from '../components/DocumentTemplatePreviewer';
import { DocumentReminders } from '../components/DocumentReminders';
import { DocumentChecklists } from '../components/DocumentChecklists';
import { AIHelpGlossary } from '../components/AIHelpGlossary';
import { GuidedWorkflows } from '../components/GuidedWorkflows';

import { User } from '../services/authService';
import { RecentActivity } from '../components/RecentActivity';
import { activityService } from '../services/activityService';

interface GuidancePageProps {
  onRequireAuth: (callback: () => void) => void;
  user: User;
}

export type GuidanceSubTab = 'dashboard' | 'directory' | 'utilities' | 'workflows' | 'reminders';
type UtilitySubView = 'scanner' | 'previewer' | 'glossary';

export function GuidancePage({ onRequireAuth, user }: GuidancePageProps) {
  const [allDocuments, setAllDocuments] = useState<DocumentGuide[]>([]);
  const [searchResults, setSearchResults] = useState<DocumentGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<GuidanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Sub-Navigation Tabs - default to dashboard on login
  const [activeSubTab, setActiveSubTab] = useState<GuidanceSubTab>('dashboard');
  const [activeUtilView, setActiveUtilView] = useState<UtilitySubView>('scanner');

  // Favorites System
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // State Selector
  const [userState, setUserState] = useState<string>('all');
  
  // Critical Reminders
  const [criticalDoc, setCriticalDoc] = useState<{ name: string; days: number; link: string } | null>(null);

  // States List
  const STATES = [
    { code: 'all', name: 'All States (Select State for Local Services)' },
    { code: 'state_mh', name: 'Maharashtra (Aaple Sarkar)' },
    { code: 'state_up', name: 'Uttar Pradesh (e-District UP)' },
    { code: 'state_ka', name: 'Karnataka (Seva Sindhu)' },
    { code: 'state_dl', name: 'Delhi (e-District Delhi)' },
    { code: 'state_tn', name: 'Tamil Nadu (tNeGA / TN e-Sevai)' }
  ];

  // Load documents and local states on mount
  useEffect(() => {
    loadAllDocuments();
    
    // Load state
    const savedState = localStorage.getItem('user_state');
    if (savedState) setUserState(savedState);

    // Load favorites
    const savedFavs = localStorage.getItem('doc_favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error(e);
      }
    }

    // Check critical reminders
    checkCriticalReminders();
  }, []);

  const loadAllDocuments = async () => {
    setIsLoading(true);
    const docs = await guidanceApi.getAllDocuments();
    setAllDocuments(docs);
    setSearchResults(docs);
    setIsLoading(false);
  };

  const checkCriticalReminders = () => {
    const savedReminders = localStorage.getItem('doc_reminders');
    if (savedReminders) {
      try {
        const list = JSON.parse(savedReminders);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const rem of list) {
          const expiry = new Date(rem.expiryDate);
          expiry.setHours(0, 0, 0, 0);
          const diffTime = expiry.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays >= 0 && diffDays <= 30) {
            setCriticalDoc({ name: rem.docName, days: diffDays, link: rem.renewalLink });
            break; // Show first critical one
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSelectedGuide(null);
    setActiveSubTab('directory'); // Switch to directory tab on search

    const results = await guidanceApi.searchDocuments(query);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectDocument = async (document: DocumentGuide) => {
    onRequireAuth(async () => {
      setIsLoading(true);
      const guide = await guidanceApi.getDocumentGuide(document.id);
      setSelectedGuide(guide);
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleBack = () => {
    setSelectedGuide(null);
    checkCriticalReminders();
  };

  const handleToggleFavorite = (docId: string) => {
    let updated: string[];
    if (favorites.includes(docId)) {
      updated = favorites.filter(id => id !== docId);
    } else {
      updated = [...favorites, docId];
    }
    setFavorites(updated);
    localStorage.setItem('doc_favorites', JSON.stringify(updated));
  };

  const handleStateChange = (stateCode: string) => {
    setUserState(stateCode);
    localStorage.setItem('user_state', stateCode);
  };

  if (selectedGuide && selectedGuide.documentInfo) {
    return (
      <DocumentGuideView
        guide={selectedGuide.documentInfo}
        aiMessage={selectedGuide.message}
        onBack={handleBack}
        onRequireAuth={onRequireAuth}
      />
    );
  }

  // Filter out the state portal cards from the general listing if they do not match the selected state
  // This declutters the interface significantly!
  const statePortalIds = ['state_mh', 'state_up', 'state_ka', 'state_dl', 'state_tn'];
  
  // Filtered documents list for general display
  const filteredDocs = searchResults.filter(doc => {
    // If it's a state portal, only show it if userState matches, or if userState is 'all'
    if (statePortalIds.includes(doc.id)) {
      return userState === 'all' || doc.id === userState;
    }
    return true;
  });

  const isSearchActive = searchResults.length !== allDocuments.length;

  // Group by category for rendering the Directory
  const groupedDocs = filteredDocs.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, DocumentGuide[]>);

  // Gather favorite documents
  const favoriteDocs = allDocuments.filter(doc => favorites.includes(doc.id));

  // Determine pinned state card to display at the top of the dashboard
  const pinnedStateDoc = allDocuments.find(doc => doc.id === userState);

  const containerLoaderVariant = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  return (
    <motion.div variants={containerLoaderVariant} initial="hidden" animate="show" className="w-full">
      
      {/* Critical Reminders Alert Banner */}
      {criticalDoc && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-between gap-4 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <BellRing className="w-5 h-5 text-red-400 animate-bounce flex-shrink-0" />
            <div className="text-left text-sm">
              <span className="font-black">Timeline Alert:</span> Your <span className="font-bold text-white">{criticalDoc.name}</span> expires in <span className="font-black text-white">{criticalDoc.days} days</span>. Renew immediately.
            </div>
          </div>
          <a
            href={criticalDoc.link}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-red-500/20 flex items-center gap-1.5 transition-all"
          >
            Renew Now <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      )}

      {/* Main Dashboard Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-white/5 pb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'dashboard', label: 'Workspace Dashboard', icon: '📊' },
            { id: 'directory', label: 'Portal Directory', icon: '🗂️' },
            { id: 'utilities', label: 'Smart Utilities', icon: '📸' },
            { id: 'workflows', label: 'Guided Workflows', icon: '⚡' },
            { id: 'reminders', label: 'Expiry Reminders', icon: '📅' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as GuidanceSubTab);
                setSelectedGuide(null);
              }}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all border ${
                activeSubTab === tab.id
                  ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                  : 'bg-white/5 border-white/5 text-textSecondary hover:text-white hover:border-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* State Selector Dropdown */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
          <MapPin className="w-4 h-4 text-primary" />
          <select
            value={userState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="bg-transparent border-none text-xs font-black text-white focus:outline-none cursor-pointer uppercase tracking-wider pr-2"
          >
            {STATES.map((st) => (
              <option key={st.code} value={st.code} className="bg-surface text-white">
                {st.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB CONTENT ROUTING */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {activeSubTab === 'dashboard' && (
            <div className="space-y-12">
              {/* Welcome Banner */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 bg-gradient-to-r from-emerald-950/20 to-primary/5 border border-primary/20 rounded-[2.5rem] relative overflow-hidden backdrop-blur-lg">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Secure Citizen Hub Workspace</span>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Welcome, {user.name}</h2>
                  <p className="text-textSecondary text-xs leading-relaxed max-w-lg font-medium">
                    This is your personal secure dashboard. Navigate portal directory guides, audit file authenticity records, and customize automated reminders.
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 z-10">
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-textMuted font-black">Local Node Registry</p>
                    <p className="text-xs text-white font-bold uppercase mt-1">{STATES.find(s => s.code === userState)?.name.split(' (')[0] || 'All States'}</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Verified Audits', value: activityService.getActivities(user.id).filter(a => a.type === 'verification').length, label: 'Checks Completed' },
                  { title: 'Starred Directories', value: favoriteDocs.length, label: 'Quick Shortcuts' },
                  { title: 'System Security', value: '100%', label: 'SSL Cryptography' },
                  { title: 'Compliance Health', value: 'Optimal', label: 'All Protocols Checked' }
                ].map((stat, i) => (
                  <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden">
                    <p className="text-[9px] uppercase font-black tracking-widest text-textSecondary">{stat.title}</p>
                    <h3 className="text-2xl font-black text-white mt-2 leading-none">{stat.value}</h3>
                    <p className="text-[9px] uppercase font-bold text-textMuted tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Main Content Grid: Shortcuts on Left, Feed on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 space-y-8">
                  {/* Location Pinned Portal */}
                  {pinnedStateDoc && (
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                          📍
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-primary">Pinned Local Portal</p>
                          <h4 className="font-bold text-base text-white">{pinnedStateDoc.name}</h4>
                        </div>
                      </div>
                      <p className="text-textSecondary text-xs leading-relaxed font-medium mb-4">{pinnedStateDoc.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSelectDocument(pinnedStateDoc)}
                          className="btn-premium px-4 py-2 text-[10px] font-black uppercase tracking-wider"
                        >
                          Explore Guide
                        </button>
                        <a
                          href={pinnedStateDoc.applyLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                        >
                          Open Site <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Starred Shortcuts */}
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                    <h4 className="text-xs uppercase font-black tracking-widest text-white mb-4">Quick Directory Links</h4>
                    {favoriteDocs.length > 0 ? (
                      <div className="space-y-3">
                        {favoriteDocs.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-all">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{doc.icon}</span>
                              <span className="text-xs font-bold text-white">{doc.name}</span>
                            </div>
                            <button 
                              onClick={() => handleSelectDocument(doc)}
                              className="text-[10px] font-black uppercase tracking-wider text-primary hover:text-green-300"
                            >
                              Explore
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-xs text-textSecondary font-medium">No saved portals. Star directories to see shortcuts here.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Dynamic Activity Feed */}
                <div className="lg:col-span-6">
                  <RecentActivity user={user} />
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'directory' && (
            <div className="space-y-12">
              
              {/* Pinned State Portal Section */}
              {pinnedStateDoc && (
                <div className="p-6 bg-gradient-to-r from-emerald-950/20 to-primary/5 border border-primary/20 rounded-3xl relative overflow-hidden backdrop-blur-lg">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-4xl">
                        📍
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Location Pinned Portal</span>
                        </div>
                        <h3 className="text-2xl font-black text-white mt-1">{pinnedStateDoc.name}</h3>
                        <p className="text-textSecondary text-sm mt-1">{pinnedStateDoc.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSelectDocument(pinnedStateDoc)}
                        className="btn-premium px-6 py-3.5 text-xs font-black uppercase tracking-widest"
                      >
                        Explore Guide Protocol
                      </button>
                      <a
                        href={pinnedStateDoc.applyLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-xs font-black uppercase tracking-widest text-white transition-all flex items-center gap-2"
                      >
                        Open Website <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Portals Starred Section */}
              {favoriteDocs.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <h3 className="text-lg font-black text-white uppercase tracking-widest">Saved Portals ({favoriteDocs.length})</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {favoriteDocs.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onClick={() => handleSelectDocument(doc)}
                        isFavorite={true}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Search Header Area */}
              <div className="border-b border-white/5 pb-10">
                <DocumentSearch onSearch={handleSearch} isLoading={isSearching} />
              </div>

              {/* Search/Catalog Listing */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-3xl opacity-20 animate-pulse" />
                    <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                  </div>
                  <p className="text-textSecondary mt-6 font-black uppercase tracking-[0.3em] text-[10px] opacity-60">Syncing Intelligence</p>
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="text-center py-32 glass-card bg-white/[0.02] border-white/10">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-8 h-8 text-textMuted" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Zero matches found</h3>
                  <p className="text-textSecondary max-w-sm mx-auto text-sm opacity-70">
                    The AI couldn't locate documents matching your filter. Try clearing the search or changing your state selection.
                  </p>
                </div>
              ) : isSearchActive ? (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <h3 className="font-black text-white text-lg uppercase tracking-widest">Search Results ({filteredDocs.length})</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDocs.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onClick={() => handleSelectDocument(doc)}
                        isFavorite={favorites.includes(doc.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-16">
                  {Object.entries(groupedDocs).map(([category, docs]) => (
                    <div key={category} className="space-y-8">
                      <div className="flex items-center justify-between pb-3 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <h3 className="font-black text-sm text-white uppercase tracking-[0.2em]">{category} Portals</h3>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {docs.map((doc) => (
                          <DocumentCard
                            key={doc.id}
                            document={doc}
                            onClick={() => handleSelectDocument(doc)}
                            isFavorite={favorites.includes(doc.id)}
                            onToggleFavorite={handleToggleFavorite}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'utilities' && (
            <div className="space-y-8">
              {/* Utility Sub View Selector */}
              <div className="flex gap-2 border-b border-white/5 pb-4">
                {[
                  { id: 'scanner', label: 'Photo Scanner & Compressor', icon: '📸' },
                  { id: 'previewer', label: 'Agreement & Affidavit Builder', icon: '📜' },
                  { id: 'glossary', label: 'AI Glossary & Glossary', icon: '📖' }
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => setActiveUtilView(view.id as UtilitySubView)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      activeUtilView === view.id
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-transparent border-transparent text-textSecondary hover:text-white'
                    }`}
                  >
                    <span>{view.icon}</span> <span className="ml-1">{view.label}</span>
                  </button>
                ))}
              </div>

              <div>
                {activeUtilView === 'scanner' && <DocumentScanner />}
                {activeUtilView === 'previewer' && <DocumentTemplatePreviewer />}
                {activeUtilView === 'glossary' && <AIHelpGlossary />}
              </div>
            </div>
          )}

          {activeSubTab === 'workflows' && (
            <div className="space-y-12">
              <GuidedWorkflows />
              <DocumentChecklists />
            </div>
          )}

          {activeSubTab === 'reminders' && (
            <div>
              <DocumentReminders />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
