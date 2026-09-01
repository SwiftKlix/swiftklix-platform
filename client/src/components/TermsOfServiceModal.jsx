import React from 'react';
import { X, Scale, FileText, CheckCircle2, ShieldCheck, AlertTriangle, Mail } from 'lucide-react';

export default function TermsOfServiceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl border border-slate-200 shadow-2xl overflow-hidden text-xs max-h-[88vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[10px]">
                  Official Terms of Service
                </span>
                <span className="text-slate-400 text-[10px]">Effective Date: January 1, 2026</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                SwiftKlix Terms & Conditions of Use
              </h2>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Terms Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700 leading-relaxed">
          
          <section className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>1. Agreement to Terms</span>
            </h3>
            <p>
              By accessing, browsing, or utilizing the SwiftKlix platform ("SwiftKlix", "Platform", or "Service"), you agree to be bound by these Terms of Service and all applicable federal, state, and local regulations. If you do not agree, you must immediately discontinue use of the Platform.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>2. Organization & Chapter Charters</span>
            </h3>
            <p>
              Organizations posting branch opportunities on SwiftKlix represent that they are lawful non-profit, student-led, or community initiatives. Approved branch leads agree to uphold the organization's charter, safety guidelines, and campus codes of conduct during all local meetings and public service drives.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>3. User Conduct & Truth in Applications</span>
            </h3>
            <p>
              Applicants and organizers agree to provide accurate, truthful identity and contact information in all branch and position submissions. Harassment, spam, fraudulent listings, and unauthorized data scraping are strictly prohibited and result in immediate revocation of access.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>4. Limitation of Liability & Disclaimers</span>
            </h3>
            <p>
              SwiftKlix serves as an infrastructure platform facilitating connections between community organizers and independent non-profit entities. SwiftKlix does not directly supervise in-person volunteer events and disclaims liability for local chapter activities beyond what is prescribed by law.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>5. Inquiries & Legal Contact</span>
            </h3>
            <p>
              For legal inquiries regarding these terms, please contact:
              <br />
              <strong className="text-slate-900">Email:</strong> <a href="mailto:swiftklix1@gmail.com" className="text-blue-700 hover:underline">swiftklix1@gmail.com</a>
              <br />
              <strong className="text-slate-900">Instagram:</strong> <a href="https://www.instagram.com/swiftklix/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">@swiftklix</a>
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            SwiftKlix Legal & Chapter Operating Standards
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Accept Terms
          </button>
        </div>

      </div>
    </div>
  );
}
