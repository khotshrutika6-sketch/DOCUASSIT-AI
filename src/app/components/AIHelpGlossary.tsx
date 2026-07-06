import { useState } from 'react';
import { Search, HelpCircle, ChevronRight } from 'lucide-react';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  example: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Domicile Certificate',
    definition: 'An official document issued by a state government proving that a person is a permanent resident of that particular state or Union Territory. It is essential for claiming state-specific benefits, educational quotas, or government jobs.',
    category: 'State Services',
    example: 'A student residing in Mumbai needs a Domicile Certificate of Maharashtra to secure a college seat under the local state quota.'
  },
  {
    term: 'Affidavit',
    definition: 'A written statement of facts voluntarily made by an individual under oath or affirmation before an authorized officer, such as a Notary Public or Oath Commissioner. It is legally binding and carries penalties for false declarations.',
    category: 'Legal',
    example: 'An affidavit is required to declare a change of name or to explain a gap of one year between school and college.'
  },
  {
    term: 'Gazetted Officer',
    definition: 'High-ranking public servants (Group A and sometimes Group B) whose appointments are published in the Official Gazette. They hold administrative powers to attest photocopies of original documents, verify character, or sign official applications (e.g., government doctors, police officers above Inspector, university professors).',
    category: 'Verification',
    example: 'When applying for certain government scholarships, you may need a Gazetted Officer to sign and stamp photocopies of your marksheets.'
  },
  {
    term: 'Aadhaar e-KYC',
    definition: 'Electronic Know Your Customer. A paperless method of instantly verifying a citizen’s identity. The service provider queries the UIDAI database using your Aadhaar number, verifying it via a mobile OTP or biometric fingerprint scanner.',
    category: 'Digital Identity',
    example: 'Filing taxes instantly on the Income Tax Portal or getting a new SIM card requires completing a quick Aadhaar e-KYC.'
  },
  {
    term: 'UAN (Universal Account Number)',
    definition: 'A unique 12-digit number allocated by the Employees\' Provident Fund Organisation (EPFO) to every contributing member. It links multiple member IDs (employer PF accounts) into a single profile that remains unchanged when switching jobs.',
    category: 'Finance',
    example: 'To check your accumulated PF retirement savings or withdraw money on the UMANG app, you must first activate your UAN.'
  },
  {
    term: 'NOC (No Objection Certificate)',
    definition: 'A legal certificate issued by an organization, landlord, or authority stating they have no objections to the actions described in the document (e.g. starting a business in a rented building or transferring a car to another state).',
    category: 'Legal',
    example: 'You must obtain a signed NOC from your flat owner before applying for a commercial GST registration at that address.'
  },
  {
    term: 'Challan',
    definition: 'An official receipt, ticket, or transaction slip issued by government departments (like RTO, Police, or Tax Department) acknowledging a payment due, a tax deposit, or a traffic violation penalty.',
    category: 'Transport & Finance',
    example: 'If you exceed the speed limit, the traffic police will issue an e-challan, which you must search and pay on the Parivahan portal.'
  },
  {
    term: 'e-EPIC',
    definition: 'Electronic Electoral Photo Identity Card. A secure PDF version of the Voter ID Card that can be downloaded online. It contains a secure QR code and holds legal status equivalent to the physical voter card under Indian law.',
    category: 'Digital Identity',
    example: 'You can download your e-EPIC card instantly on your phone and show it as valid proof of identity on election day.'
  }
];

export function AIHelpGlossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(GLOSSARY_TERMS.map(t => t.category)))];

  const filteredTerms = GLOSSARY_TERMS.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="glass-card bg-white/[0.02] border-white/10 p-8 rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
            📖
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">AI Form Helper & Glossary</h2>
            <p className="text-textSecondary text-sm">Decode complicated bureaucratic guidelines and official terminology instantly.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 search-box bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <Search className="w-4 h-4 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search glossary terms..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-sm text-white focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
              selectedCategory === cat 
                ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                : 'bg-white/5 border-white/5 text-textSecondary hover:text-white hover:border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Glossary Cards grid */}
      {filteredTerms.length === 0 ? (
        <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded-2xl">
          <HelpCircle className="w-10 h-10 text-textMuted mx-auto mb-3 opacity-30" />
          <p className="text-sm text-textSecondary font-medium">No terms matched your query.</p>
          <p className="text-xs text-textMuted mt-1">Try searching for Domicile, Affidavit, or e-KYC.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTerms.map((term, i) => (
            <div 
              key={i}
              className="bg-white/[0.01] border border-white/5 hover:border-primary/20 rounded-2xl p-6 transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-black text-white">{term.term}</h3>
                <span className="px-2.5 py-0.5 bg-white/5 border border-white/5 text-[9px] uppercase font-black text-emerald-400 rounded-full tracking-widest">
                  {term.category}
                </span>
              </div>
              <p className="text-textSecondary text-sm leading-relaxed mb-4">{term.definition}</p>
              
              <div className="bg-white/[0.02] border-l-2 border-primary/50 p-3 rounded-r-xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">Practical Use-Case</span>
                <p className="text-xs text-textMuted leading-relaxed">{term.example}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
