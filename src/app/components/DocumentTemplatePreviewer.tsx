import { useState, useRef } from 'react';
import { FileText, Printer, Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

type TemplateType = 'rent_agreement' | 'affidavit' | 'minor_undertaking';

interface RentAgreementData {
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  tenantAddress: string;
  propertyAddress: string;
  monthlyRent: string;
  securityDeposit: string;
  startDate: string;
  agreementDuration: string;
}

interface AffidavitData {
  deponentName: string;
  deponentAge: string;
  deponentFather: string;
  deponentAddress: string;
  affidavitPurpose: string;
  statement1: string;
  statement2: string;
}

interface MinorUndertakingData {
  parentName: string;
  parentAddress: string;
  minorName: string;
  minorDob: string;
  passportOffice: string;
  declarationDate: string;
}

export function DocumentTemplatePreviewer() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('rent_agreement');
  
  const [rentData, setRentData] = useState<RentAgreementData>({
    landlordName: 'Aarav Sharma',
    landlordAddress: 'Flat 402, Green Glen Layout, Bengaluru, Karnataka - 560103',
    tenantName: 'Ishaan Verma',
    tenantAddress: 'C-72, Sector 15, Noida, Uttar Pradesh - 201301',
    propertyAddress: 'Flat 201, Maple Heights, HSR Sector 2, Bengaluru, Karnataka - 560102',
    monthlyRent: '22,000',
    securityDeposit: '1,00,000',
    startDate: '2026-07-01',
    agreementDuration: '11 Months'
  });

  const [affidavitData, setAffidavitData] = useState<AffidavitData>({
    deponentName: 'Priya Patel',
    deponentAge: '28',
    deponentFather: 'Rajesh Patel',
    deponentAddress: '45, Sunrise Villa, Girdhar Nagar, Ahmedabad, Gujarat - 380004',
    affidavitPurpose: 'name correction in educational marksheets',
    statement1: 'That in my high school marksheet, my name is recorded as Priya R. Patel, whereas my official registered name in my Aadhaar Card is Priya Patel.',
    statement2: 'That Priya R. Patel and Priya Patel refer to one and the same person, i.e., myself, and I request the educational board to issue corrected documents accordingly.'
  });

  const [minorData, setMinorData] = useState<MinorUndertakingData>({
    parentName: 'Ramesh Kumar',
    parentAddress: 'House No. 12, Sector 4, Panchkula, Haryana - 134112',
    minorName: 'Karan Kumar',
    minorDob: '2015-05-15',
    passportOffice: 'Delhi Regional Passport Office',
    declarationDate: '2026-06-16'
  });

  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      // Open print window
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Document</title>
              <style>
                body {
                  font-family: 'Georgia', serif;
                  padding: 40px;
                  color: #000;
                  background: #fff;
                  line-height: 1.6;
                  position: relative;
                }
                .border-4 { border-width: 4px; }
                .border-double { border-style: double; }
                .border-emerald-950 { border-color: #022c22; }
                .text-emerald-950 { color: #022c22; }
                .text-emerald-900 { color: #064e3b; }
                .border-emerald-800 { border-color: #065f46; }
                .border-y { border-top-width: 1px; border-bottom-width: 1px; border-style: solid; }
                .font-sans { font-family: sans-serif; }
                .font-mono { font-family: monospace; }
                .text-xl { font-size: 20px; }
                .text-xs { font-size: 12px; }
                .text-sm { font-size: 14px; }
                .text-3xl { font-size: 30px; }
                .font-bold { font-weight: bold; }
                .font-black { font-weight: 900; }
                .tracking-widest { letter-spacing: 0.1em; }
                .tracking-wider { letter-spacing: 0.05em; }
                .my-6 { margin-top: 24px; margin-bottom: 24px; }
                .py-3 { padding-top: 12px; padding-bottom: 12px; }
                .px-8 { padding-left: 32px; padding-right: 32px; }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .items-center { align-items: center; }
                .text-center { text-align: center; }
                .text-left { text-align: left; }
                .text-right { text-align: right; }
                .mb-10 { margin-bottom: 40px; }
                .mb-8 { margin-bottom: 32px; }
                .mb-6 { margin-bottom: 24px; }
                .mb-4 { margin-bottom: 16px; }
                .mb-12 { margin-bottom: 48px; }
                .mb-16 { margin-bottom: 64px; }
                .relative { position: relative; }
                .absolute { position: absolute; }
                .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
                .opacity-03 { opacity: 0.03; }
                .rotate-30 { transform: rotate(-30deg); }
                .w-96 { width: 384px; }
                .h-96 { height: 384px; }
                .rounded-full { border-radius: 9999px; }
                .border-12 { border-width: 12px; border-style: solid; }
                .legal-content {
                  text-align: justify;
                  white-space: pre-wrap;
                }
                .legal-title {
                  text-align: center;
                  font-weight: bold;
                  font-size: 18px;
                  margin-bottom: 30px;
                  text-decoration: underline;
                }
                .signature-section {
                  margin-top: 80px;
                  display: flex;
                  justify-content: space-between;
                }
                .signature-box {
                  border-top: 1px solid #000;
                  width: 200px;
                  text-align: center;
                  padding-top: 5px;
                  font-size: 14px;
                }
                /* Print Watermark styling */
                .watermark-container {
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  pointer-events: none;
                  opacity: 0.03;
                  z-index: 0;
                  overflow: hidden;
                }
                .watermark-seal {
                  border: 12px solid #064e3b;
                  border-radius: 50%;
                  width: 384px;
                  height: 384px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  color: #064e3b;
                  font-family: sans-serif;
                  font-weight: 900;
                  text-align: center;
                  transform: rotate(-30deg);
                }
              </style>
            </head>
            <body>
              ${printContent.replace(
                'opacity-[0.03]',
                'watermark-container'
              ).replace(
                'border-[12px] border-emerald-900 rounded-full w-96 h-96 flex flex-col items-center justify-center text-emerald-900 font-sans font-black text-center rotate-[-30deg]',
                'watermark-seal'
              )}
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                }
              </script>
            </body>
          </html>
         `);
        printWindow.document.close();
      }
    }
  };

  const copyText = () => {
    let content = '';
    if (activeTemplate === 'rent_agreement') {
      content = getRentAgreementText();
    } else if (activeTemplate === 'affidavit') {
      content = getAffidavitText();
    } else {
      content = getMinorUndertakingText();
    }
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRentAgreementText = () => {
    return `RENT AGREEMENT

This Rent Agreement is made and executed on this ${rentData.startDate} by and between:

LANDLORD / OWNER:
${rentData.landlordName}, residing at: ${rentData.landlordAddress} (hereinafter referred to as the 'LESSOR', which expression shall include heirs, executors, and assigns).

AND

TENANT:
${rentData.tenantName}, residing at: ${rentData.tenantAddress} (hereinafter referred to as the 'LESSEE', which expression shall include heirs, executors, and assigns).

WHEREAS the Lessor is the absolute owner of the property situated at: ${rentData.propertyAddress} (hereinafter referred to as the 'Demised Premises').

NOW THIS RENT AGREEMENT WITNESSETH AS FOLLOWS:
1. That the tenancy shall commence from ${rentData.startDate} and shall be for a fixed duration of ${rentData.agreementDuration}.
2. That the Lessee shall pay a Monthly Rent of Rs. ${rentData.monthlyRent}/- (Rupees only) on or before the 5th day of every calendar month.
3. That the Lessee has deposited an interest-free Security Deposit of Rs. ${rentData.securityDeposit}/- (Rupees only) with the Lessor, which shall be refunded at the time of vacating the Demised Premises.
4. That the Lessee shall pay the electricity, water charges, and maintenance fees to the appropriate departments as per their utility meters.
5. That the Lessee shall keep the Demised Premises in good, clean, and tenantable condition and shall not carry out any structural modifications without written consent.

IN WITNESS WHEREOF, the Lessor and Lessee have signed this agreement on the day, month, and year first written above.


___________________________                    ___________________________
Lessor (Landlord) Signature                     Lessee (Tenant) Signature`;
  };

  const getAffidavitText = () => {
    return `GENERAL AFFIDAVIT

I, ${affidavitData.deponentName}, aged about ${affidavitData.deponentAge} years, child of Shri ${affidavitData.deponentFather}, residing at ${affidavitData.deponentAddress}, do hereby solemnly affirm and declare on oath as under:

1. That I am a permanent resident of India and residing at the address mentioned above.
2. ${affidavitData.statement1}
3. ${affidavitData.statement2}
4. That the statements made in the paragraphs above are true and correct to the best of my knowledge, belief, and records, and nothing has been concealed or misrepresented.

Solemnly affirmed and declared at this place on this date.


___________________________
DEPONENT (Signature)`;
  };

  const getMinorUndertakingText = () => {
    return `UNDERTAKING / DECLARATION FOR MINOR PASSPORT

I, ${minorData.parentName}, residing at ${minorData.parentAddress}, do hereby solemnly declare and affirm as follows:

1. That I am the parent/guardian of ${minorData.minorName} who was born on ${minorData.minorDob} and is a minor.
2. That I am submitting an application for a fresh passport / renewal of passport for the said minor to the ${minorData.passportOffice}.
3. That the details of the minor given in the application form are correct to the best of my knowledge and belief.
4. That the minor is a citizen of India and does not hold any foreign passport or citizenship.
5. That I shall be responsible for all expenses, conduct, and legal obligations of the minor.

Declared at Panchkula on ${minorData.declarationDate}.


___________________________
Declarant (Parent/Guardian Signature)`;
  };

  return (
    <div className="glass-card bg-white/[0.02] border-white/10 p-8 rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
            📜
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Interactive Document Template Previewer</h2>
            <p className="text-textSecondary text-sm">Draft Rent Agreements or Affidavits dynamically on simulated stamp paper.</p>
          </div>
        </div>

        {/* Template Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTemplate('rent_agreement')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              activeTemplate === 'rent_agreement' ? 'bg-primary text-white' : 'text-textSecondary hover:text-white'
            }`}
          >
            Rent Agreement
          </button>
          <button
            onClick={() => setActiveTemplate('affidavit')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              activeTemplate === 'affidavit' ? 'bg-primary text-white' : 'text-textSecondary hover:text-white'
            }`}
          >
            Affidavit
          </button>
          <button
            onClick={() => setActiveTemplate('minor_undertaking')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              activeTemplate === 'minor_undertaking' ? 'bg-primary text-white' : 'text-textSecondary hover:text-white'
            }`}
          >
            Minor Passport Undertaking
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Editor Form - 2 Columns */}
        <div className="xl:col-span-2 bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
            Document Parameters
          </h3>

          {activeTemplate === 'rent_agreement' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Landlord Full Name</label>
                <input 
                  type="text" 
                  value={rentData.landlordName}
                  onChange={(e) => setRentData({ ...rentData, landlordName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Landlord Address</label>
                <textarea 
                  rows={2}
                  value={rentData.landlordAddress}
                  onChange={(e) => setRentData({ ...rentData, landlordAddress: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Tenant Name</label>
                  <input 
                    type="text" 
                    value={rentData.tenantName}
                    onChange={(e) => setRentData({ ...rentData, tenantName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Agreement Duration</label>
                  <input 
                    type="text" 
                    value={rentData.agreementDuration}
                    onChange={(e) => setRentData({ ...rentData, agreementDuration: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Tenant Current Address</label>
                <textarea 
                  rows={2}
                  value={rentData.tenantAddress}
                  onChange={(e) => setRentData({ ...rentData, tenantAddress: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Rental Property Address</label>
                <textarea 
                  rows={2}
                  value={rentData.propertyAddress}
                  onChange={(e) => setRentData({ ...rentData, propertyAddress: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Monthly Rent (INR)</label>
                  <input 
                    type="text" 
                    value={rentData.monthlyRent}
                    onChange={(e) => setRentData({ ...rentData, monthlyRent: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Security Deposit (INR)</label>
                  <input 
                    type="text" 
                    value={rentData.securityDeposit}
                    onChange={(e) => setRentData({ ...rentData, securityDeposit: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Start / Commencement Date</label>
                <input 
                  type="date" 
                  value={rentData.startDate}
                  onChange={(e) => setRentData({ ...rentData, startDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {activeTemplate === 'affidavit' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Deponent Name</label>
                <input 
                  type="text" 
                  value={affidavitData.deponentName}
                  onChange={(e) => setAffidavitData({ ...affidavitData, deponentName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Age (Years)</label>
                  <input 
                    type="number" 
                    value={affidavitData.deponentAge}
                    onChange={(e) => setAffidavitData({ ...affidavitData, deponentAge: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Father / Spouse Name</label>
                  <input 
                    type="text" 
                    value={affidavitData.deponentFather}
                    onChange={(e) => setAffidavitData({ ...affidavitData, deponentFather: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Deponent Address</label>
                <textarea 
                  rows={2}
                  value={affidavitData.deponentAddress}
                  onChange={(e) => setAffidavitData({ ...affidavitData, deponentAddress: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Affidavit Purpose</label>
                <input 
                  type="text" 
                  value={affidavitData.affidavitPurpose}
                  onChange={(e) => setAffidavitData({ ...affidavitData, affidavitPurpose: e.target.value })}
                  placeholder="e.g. name correction in high school certificates"
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Declaration Statement 1</label>
                <textarea 
                  rows={3}
                  value={affidavitData.statement1}
                  onChange={(e) => setAffidavitData({ ...affidavitData, statement1: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Declaration Statement 2</label>
                <textarea 
                  rows={3}
                  value={affidavitData.statement2}
                  onChange={(e) => setAffidavitData({ ...affidavitData, statement2: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {activeTemplate === 'minor_undertaking' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Parent / Guardian Full Name</label>
                <input 
                  type="text" 
                  value={minorData.parentName}
                  onChange={(e) => setMinorData({ ...minorData, parentName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Parent / Guardian Address</label>
                <textarea 
                  rows={2}
                  value={minorData.parentAddress}
                  onChange={(e) => setMinorData({ ...minorData, parentAddress: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Minor Full Name</label>
                  <input 
                    type="text" 
                    value={minorData.minorName}
                    onChange={(e) => setMinorData({ ...minorData, minorName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Minor Date of Birth</label>
                  <input 
                    type="date" 
                    value={minorData.minorDob}
                    onChange={(e) => setMinorData({ ...minorData, minorDob: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Regional Passport Office (RPO)</label>
                <input 
                  type="text" 
                  value={minorData.passportOffice}
                  onChange={(e) => setMinorData({ ...minorData, passportOffice: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-black text-textSecondary uppercase tracking-widest block mb-2">Declaration Date</label>
                <input 
                  type="date" 
                  value={minorData.declarationDate}
                  onChange={(e) => setMinorData({ ...minorData, declarationDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={copyText}
              className="py-3.5 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-wider text-textSecondary hover:text-white transition-all flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Draft' : 'Copy Plain Draft'}
            </button>
            <button
              onClick={handlePrint}
              className="py-3.5 px-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* Live Preview Column - 3 Columns */}
        <div className="xl:col-span-3">
          <div className="border border-white/10 rounded-2xl p-6 bg-white flex flex-col justify-start text-black min-h-[600px] max-h-[720px] overflow-y-auto shadow-2xl relative">
            <div className="absolute top-2 right-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] text-green-700 font-bold uppercase tracking-wider select-none pointer-events-none">
              Interactive Preview
            </div>

            {/* Document Stamp Print Template Wrapper */}
            <div ref={printRef} className="w-full select-text text-left font-serif leading-relaxed text-black text-sm">
              
              {/* Ornate Stamp Paper Graphic Header */}
              <div className="border-4 border-double border-emerald-950 p-6 text-center mb-10 select-none">
                <div className="text-xl font-bold tracking-widest text-emerald-950 font-sans">GOVERNMENT OF INDIA</div>
                <div className="text-xs uppercase tracking-widest text-emerald-900 mt-1 font-sans">NON-JUDICIAL STAMP PAPER</div>
                
                <div className="my-6 border-y border-emerald-800 py-3 flex justify-between items-center px-8">
                  <div className="text-left font-sans">
                    <div className="text-[9px] text-emerald-900 font-bold uppercase tracking-wider">DOCUMENT CODE</div>
                    <div className="text-sm font-mono font-bold text-black">MH-IND-88392091A</div>
                  </div>
                  <div className="text-3xl font-black text-emerald-950 tracking-wider">₹ 100</div>
                  <div className="text-right font-sans">
                    <div className="text-[9px] text-emerald-900 font-bold uppercase tracking-wider">STAMP DUTY PAID</div>
                    <div className="text-sm font-mono font-bold text-black">ONE HUNDRED RUPEES</div>
                  </div>
                </div>

                <div className="text-[10px] text-emerald-800 font-sans max-w-md mx-auto italic leading-tight">
                  This mock preview acts as an interactive drafting utility. Official stamp papers must be purchased from authorized state vendors or official e-stamp portals.
                </div>
              </div>

              {/* Notary Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none z-0 overflow-hidden">
                <div className="border-[12px] border-emerald-900 rounded-full w-96 h-96 flex flex-col items-center justify-center text-emerald-900 font-sans font-black text-center rotate-[-30deg]">
                  <div className="text-3xl tracking-widest leading-none">NOTARY PUBLIC</div>
                  <div className="text-xl tracking-wider mt-2">GOVERNMENT OF INDIA</div>
                  <div className="text-sm border-t border-emerald-900 mt-2 pt-1 font-mono">SEAL INTEGRITY</div>
                </div>
              </div>

              {/* Legal Text content */}
              {activeTemplate === 'rent_agreement' && (
                <div className="px-4 text-justify relative z-10">
                  <h4 className="text-center font-bold text-base underline mb-8 uppercase tracking-wide">RENT AGREEMENT</h4>
                  <p className="mb-4">
                    This Rent Agreement is made and executed on this <strong>{rentData.startDate || '________'}</strong> by and between:
                  </p>
                  
                  <p className="mb-4">
                    <strong>{rentData.landlordName || 'Lessor Name'}</strong>, residing at: {rentData.landlordAddress || 'Lessor address details'} (hereinafter referred to as the <strong>"LESSOR"</strong>, which expression shall unless repugnant to the context include heirs, executors, and administrators).
                  </p>
                  
                  <p className="mb-6">
                    AND
                  </p>
                  
                  <p className="mb-4">
                    <strong>{rentData.tenantName || 'Lessee Name'}</strong>, residing at: {rentData.tenantAddress || 'Lessee current address details'} (hereinafter referred to as the <strong>"LESSEE"</strong>, which expression shall unless repugnant to the context include heirs, executors, and administrators).
                  </p>
                  
                  <p className="mb-4">
                    WHEREAS the Lessor is the absolute owner of the residential property situated at: <strong>{rentData.propertyAddress || 'Tenancy property address'}</strong> (hereinafter referred to as the <strong>"Demised Premises"</strong>).
                  </p>
                  
                  <p className="mb-6">
                    NOW THIS AGREEMENT WITNESSETH AND IT IS HEREBY MUTUALLY AGREED BY AND BETWEEN THE PARTIES AS UNDER:
                  </p>
                  
                  <ol className="list-decimal pl-6 space-y-3 mb-8">
                    <li>
                      That the tenancy hereby created shall commence from <strong>{rentData.startDate || 'Start Date'}</strong> and shall remain in force for a fixed duration of <strong>{rentData.agreementDuration || '11 Months'}</strong>.
                    </li>
                    <li>
                      That the Lessee shall pay to the Lessor a Monthly Rent of <strong>Rs. {rentData.monthlyRent || '0'}/-</strong> (Rupees only), payable on or before the 5th day of each calendar month.
                    </li>
                    <li>
                      That the Lessee has deposited an interest-free Security Deposit of <strong>Rs. {rentData.securityDeposit || '0'}/-</strong> (Rupees only) with the Lessor. This deposit is refundable upon vacant and peaceful possession transfer of the premises.
                    </li>
                    <li>
                      That the Lessee shall bear and pay the consumption charges for electricity, water, and gas directly as per utility bills.
                    </li>
                    <li>
                      That the Lessee shall keep the premises in good sanitary conditions and shall not carry out structural changes or sublet the property.
                    </li>
                  </ol>

                  <p className="mb-12">
                    IN WITNESS WHEREOF, the Lessor and Lessee have set their signatures on this agreement in the presence of witnesses.
                  </p>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
                    <div>
                      <div className="h-16"></div>
                      <div className="border-t border-gray-400 pt-2 text-center text-xs font-bold font-sans uppercase">
                        LESSOR (LANDLORD) SIGNATURE
                      </div>
                    </div>
                    <div>
                      <div className="h-16"></div>
                      <div className="border-t border-gray-400 pt-2 text-center text-xs font-bold font-sans uppercase">
                        LESSEE (TENANT) SIGNATURE
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTemplate === 'affidavit' && (
                <div className="px-4 text-justify relative z-10">
                  <h4 className="text-center font-bold text-base underline mb-8 uppercase tracking-wide">AFFIDAVIT</h4>
                  <p className="mb-6">
                    I, <strong>{affidavitData.deponentName || 'Deponent Name'}</strong>, aged about <strong>{affidavitData.deponentAge || '__'}</strong> years, child of Shri <strong>{affidavitData.deponentFather || 'Father Name'}</strong>, residing at <strong>{affidavitData.deponentAddress || 'Deponent address details'}</strong>, do hereby solemnly affirm, declare and state on oath as under:
                  </p>

                  <ol className="list-decimal pl-6 space-y-4 mb-8">
                    <li>
                      That I am a permanent citizen of India and competent to swear this affidavit for <strong>{affidavitData.affidavitPurpose || 'Purpose of Affidavit'}</strong>.
                    </li>
                    <li>
                      {affidavitData.statement1 || 'Declaration statement number one.'}
                    </li>
                    <li>
                      {affidavitData.statement2 || 'Declaration statement number two.'}
                    </li>
                    <li>
                      That the statements made in the paragraphs above are true and correct to the best of my knowledge, and nothing materials has been concealed.
                    </li>
                  </ol>

                  <p className="text-right mb-16 font-sans text-xs">
                    Verified at local office on this day.
                  </p>

                  <div className="flex justify-end pt-8">
                    <div className="w-64 text-center">
                      <div className="h-16"></div>
                      <div className="border-t border-gray-400 pt-2 text-xs font-bold font-sans uppercase">
                        DEPONENT SIGNATURE
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTemplate === 'minor_undertaking' && (
                <div className="px-4 text-justify relative z-10">
                  <h4 className="text-center font-bold text-base underline mb-8 uppercase tracking-wide">DECLARATION BY PARENT OR GUARDIAN</h4>
                  <p className="mb-6">
                    I, <strong>{minorData.parentName || 'Parent Name'}</strong>, residing at <strong>{minorData.parentAddress || 'Parent address details'}</strong>, do hereby solemnly declare and affirm as follows:
                  </p>

                  <ol className="list-decimal pl-6 space-y-4 mb-8">
                    <li>
                      That I am the parent/legal guardian of <strong>{minorData.minorName || 'Minor Name'}</strong>, a minor child born on <strong>{minorData.minorDob || 'Date of Birth'}</strong>.
                    </li>
                    <li>
                      That I am submitting an application for a fresh passport / renewal of passport for the said minor to the <strong>{minorData.passportOffice || 'Passport Office'}</strong>.
                    </li>
                    <li>
                      That the details of the minor given in the application form are correct to the best of my knowledge, belief, and records.
                    </li>
                    <li>
                      That the minor is a citizen of India and does not hold any foreign passport or foreign citizenship.
                    </li>
                    <li>
                      That I shall be responsible for all expenses, conduct, and legal obligations arising out of the minor's travel documents.
                    </li>
                  </ol>

                  <p className="text-left mb-16 font-sans text-xs">
                    Declared at RPO zone on date: <strong>{minorData.declarationDate || 'Date'}</strong>.
                  </p>

                  <div className="flex justify-end pt-8">
                    <div className="w-64 text-center">
                      <div className="h-16"></div>
                      <div className="border-t border-gray-400 pt-2 text-xs font-bold font-sans uppercase">
                        PARENT / GUARDIAN SIGNATURE
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
