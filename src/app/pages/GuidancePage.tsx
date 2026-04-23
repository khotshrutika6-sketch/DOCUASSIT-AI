import { useState, useEffect } from 'react';
import { Loader2, LayoutGrid, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { DocumentSearch } from '../components/DocumentSearch';
import { DocumentCard } from '../components/DocumentCard';
import { DocumentGuideView } from '../components/DocumentGuideView';
import { guidanceApi, DocumentGuide, GuidanceResponse } from '../services/guidanceApi';

interface GuidancePageProps {
  onRequireAuth: (callback: () => void) => void;
}

export function GuidancePage({ onRequireAuth }: GuidancePageProps) {
  const [allDocuments, setAllDocuments] = useState<DocumentGuide[]>([]);
  const [searchResults, setSearchResults] = useState<DocumentGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<GuidanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Load all documents on mount
  useEffect(() => {
    loadAllDocuments();
  }, []);

  const loadAllDocuments = async () => {
    setIsLoading(true);
    const docs = await guidanceApi.getAllDocuments();
    setAllDocuments(docs);
    setSearchResults(docs);
    setIsLoading(false);
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSelectedGuide(null);

    const results = await guidanceApi.searchDocuments(query);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectDocument = async (document: DocumentGuide) => {
    setIsLoading(true);
    const guide = await guidanceApi.getDocumentGuide(document.id);
    setSelectedGuide(guide);
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedGuide(null);
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

  const isSearchActive = searchResults.length !== allDocuments.length;

  // Group by category when not searching
  const groupedDocs = allDocuments.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, DocumentGuide[]>);

  const containerLoaderVariant = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="w-full">
      {/* Search Header Area */}
      <div className="mb-20 border-b border-white/5 pb-16">
        <DocumentSearch onSearch={handleSearch} isLoading={isSearching} />
      </div>

      <div className="space-y-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-3xl opacity-20 animate-pulse" />
              <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
            </div>
            <p className="text-textSecondary mt-8 font-black uppercase tracking-[0.3em] text-xs opacity-50">Syncing Intelligence</p>
          </div>
        ) : searchResults.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-40 glass-card bg-white/[0.02] border-white/10"
          >
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
               <FileText className="w-10 h-10 text-textMuted" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Zero matches found</h3>
            <p className="text-textSecondary max-w-sm mx-auto text-lg opacity-70">
              The AI couldn't locate documentation for your query. Try terms like "Passport" or "PAN".
            </p>
          </motion.div>
        ) : isSearchActive ? (
          // Search Results View
          <motion.div variants={containerLoaderVariant} initial="hidden" animate="show">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
               <h3 className="font-black text-white text-xl uppercase tracking-widest">Search Results ({searchResults.length})</h3>
            </div>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <DocumentCard 
                    document={doc} 
                    onClick={() => handleSelectDocument(doc)} 
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          // Category Grouped View
          <motion.div variants={containerLoaderVariant} initial="hidden" animate="show" className="space-y-24">
            {Object.entries(groupedDocs).map(([category, docs], catIdx) => (
              <motion.div 
                key={category}
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
              >
                <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <h3 className="font-black text-lg text-white uppercase tracking-[0.3em]">{category} Protocol</h3>
                  </div>
                  <motion.button 
                    whileHover={{ x: 5 }}
                    className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:text-white"
                  >
                    View All Protocol <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {docs.map((doc) => (
                    <motion.div
                      key={doc.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                      }}
                    >
                      <DocumentCard 
                        document={doc} 
                        onClick={() => handleSelectDocument(doc)} 
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
