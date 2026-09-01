import React, { useState } from 'react';
import { X, MapPin, Users, Calendar, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';

export default function BranchDetailModal({ branch, org, onClose, onJoinBranch }) {
  if (!branch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-xs">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[11px]">
                Active Local Branch
              </span>
              <VerifiedBadge />
            </div>
            <h2 className="font-extrabold text-lg text-slate-900 leading-tight">
              {branch.name}
            </h2>
            <p className="text-slate-500 mt-0.5 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{branch.institution || branch.location}</span>
            </p>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Branch Info Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Active Team</span>
                <span className="font-bold text-slate-900 text-sm">{branch.activeMembers || 1} Volunteers</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Events Hosted</span>
                <span className="font-bold text-slate-900 text-sm">{branch.eventsHosted || 0} Events</span>
              </div>
            </div>
          </div>

          {/* Director & Contact */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="font-bold text-slate-900 block text-xs">Branch Director</span>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-sm">{branch.leadName}</p>
                <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{branch.leadEmail}</span>
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-blue-100/80 text-blue-900 font-bold text-[10px]">
                Chartered Lead
              </span>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 block">Recent Local Initiatives:</span>
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>{branch.recentEvent || "Inaugural Chapter Kickoff & Volunteer Drive"}</span>
              </div>
              <p className="text-slate-500 text-[11px] pl-5.5">
                Organized and hosted for students and local community members.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onJoinBranch(branch);
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>View Organization & Branch Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

