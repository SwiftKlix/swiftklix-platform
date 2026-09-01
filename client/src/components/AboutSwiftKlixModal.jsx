import React from 'react';
import { X, ArrowRight, Users, Building2, Briefcase, MapPin, CheckCircle2, Mail, Instagram } from 'lucide-react';
import Logo from './Logo';

export default function AboutSwiftKlixModal({ isOpen, onClose, onExplore, onOpenOrgHub }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-xl border border-slate-200 shadow-2xl overflow-hidden text-xs max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
              About SwiftKlix
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white transition-colors border border-transparent hover:border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Main Description */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Connecting People with Organizations, Initiatives & Roles
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              SwiftKlix is a community platform designed to help you discover verified organizations, student initiatives, and projects, explore branch openings and volunteer positions, and get directly involved in causes you care about.
            </p>
          </div>

          {/* 3 Core Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Discover Orgs</h3>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Browse organizations and initiatives across environment, tech, health, and civic causes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Find Open Roles</h3>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Explore open positions, branch coordinator roles, and volunteer teams.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Local Branches</h3>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Connect directly with active chapters and team leaders in your city.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-xs">What You Can Do on SwiftKlix:</h3>
            <ul className="space-y-2 text-slate-600 text-[11px]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Browse & Apply:</strong> Search by cause or location, fill out simple applications, and save drafts anytime.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Personal Profile:</strong> Build your profile with your education, skills, and past volunteer experience.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>For Organizations:</strong> Post openings, review applicants in a simple pipeline, and share story updates.</span>
              </li>
            </ul>
          </div>

          {/* Official Contact & Socials */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-slate-600">Official Contact:</span>
              <a href="mailto:swiftklix1@gmail.com" className="font-bold text-slate-900 hover:text-blue-600 hover:underline">
                swiftklix1@gmail.com
              </a>
            </div>

            <a
              href="https://www.instagram.com/swiftklix/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold hover:bg-slate-100 transition-colors shadow-2xs self-start sm:self-auto"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-600" />
              <span>@swiftklix</span>
            </a>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => { onClose(); onOpenOrgHub(); }}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Organization Hub
          </button>

          <button
            onClick={() => { onClose(); onExplore(); }}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>Explore Organizations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
