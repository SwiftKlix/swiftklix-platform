import React from 'react';
import { X, Shield, Lock, Eye, FileText, CheckCircle2, Globe, Mail } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl border border-slate-200 shadow-2xl overflow-hidden text-xs max-h-[88vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[10px]">
                  GDPR & CCPA Compliant
                </span>
                <span className="text-slate-400 text-[10px]">Effective Date: January 1, 2026</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                SwiftKlix Platform Privacy Policy
              </h2>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Policy Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700 leading-relaxed">
          
          <section className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>1. Overview & Commitment to Privacy</span>
            </h3>
            <p>
              SwiftKlix ("we", "our", or "the Platform") operates a decentralized network connecting students, community organizers, and registered non-profit initiatives to launch local chapters and volunteer positions. We are committed to upholding stringent privacy standards compliant with the General Data Protection Regulation (GDPR), the California Consumer Privacy Act as amended by the CPRA (CCPA), the Children's Online Privacy Protection Act (COPPA), and applicable US State Privacy Laws.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>2. Information We Collect</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Account & Profile Information:</strong> Name, contact email address, university or community affiliation, student status, and user-provided bio data.
              </li>
              <li>
                <strong>Match Preferences & Diagnostic Criteria:</strong> Cause passions, preferred leadership role, target city/region, and weekly commitment hours utilized strictly to compute personalized 1-100% compatibility scores.
              </li>
              <li>
                <strong>Branch & Opportunity Applications:</strong> Screening responses, proposed launch locations, timeline targets, and applicant dossiers submitted directly to organization directors.
              </li>
              <li>
                <strong>Geolocation Data:</strong> When you voluntarily click "Use Precise Location", your browser coordinates (latitude/longitude) are temporarily queried to resolve your city and state name via client-side geocoding. We do not track or persist live background GPS coordinates.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>3. Zero Sale of Personal Data</span>
            </h3>
            <p>
              <strong>SwiftKlix does not sell, rent, monetize, or trade personal data or applicant dossiers to data brokers, third-party advertisers, or external marketing entities.</strong> Personal data is shared solely with the specific non-profit organization or chapter director to whom you voluntarily submit a branch founding application or membership signup.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>4. Data Security, Storage & Encryption</span>
            </h3>
            <p>
              All traffic between your browser and our application servers is encrypted in transit using industry-standard Transport Layer Security (TLS 1.3). Database storage utilizes AES-256 encryption at rest. Draft applications and quiz criteria stored on your local browser cache can be cleared at any time via the "Reset Defaults" or "Reset Cache" buttons.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>5. Your Rights & Data Deletion</span>
            </h3>
            <p>
              Under GDPR and CCPA, you retain full rights to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Request an export copy of all stored profile and application records.</li>
              <li>Request immediate, permanent deletion of your account and submitted applications.</li>
              <li>Opt out of any non-essential analytics or email communications.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>6. Contact Our Privacy & Legal Officer</span>
            </h3>
            <p>
              For any legal inquiries, data deletion requests, or compliance questions, please contact our team directly at:
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
            SwiftKlix Legal & Compliance Framework
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
}
