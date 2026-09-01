import React from 'react';
import { X, ArrowRight } from 'lucide-react';

export default function BranchGuideModal({ org, onClose, onApply }) {
  if (!org) return null;

  const kit = org?.branchGuide || {
    curriculumOverview: 'Step-by-step meeting guides and activity plans.',
    guidelines: 'Official chapter resources, meeting agendas, and event guides.',
    legalSupport: '501(c)(3) tax exemption umbrella and insurance.',
    toolkitAssets: ['Volunteer Guide', 'Poster & Flyer Templates', 'Budget Sheet']
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg border border-zinc-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 flex items-start justify-between border-b border-zinc-100">
          <div>
            <h2 className="font-bold text-lg text-zinc-900">
              What {org?.name || 'Organization'} Provides
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Everything national HQ sends you when you launch a local chapter.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="font-bold text-zinc-900 block mb-0.5">1. Chapter Guidelines</span>
            <p className="text-zinc-600 leading-relaxed">{kit.guidelines || "Official chapter resources and event materials."}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="font-bold text-zinc-900 block mb-0.5">2. Training & Curriculum</span>
            <p className="text-zinc-600 leading-relaxed">{kit.curriculumOverview}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="font-bold text-zinc-900 block mb-0.5">3. Legal & Tax Exemption</span>
            <p className="text-zinc-600 leading-relaxed">{kit.legalSupport}</p>
          </div>

          <div>
            <span className="font-bold text-zinc-700 block mb-2">Included Resources:</span>
            <ul className="space-y-1 text-zinc-600 list-disc list-inside">
              {kit.toolkitAssets.map((asset, idx) => (
                <li key={idx}>{asset}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
          >
            Close
          </button>

          <button
            onClick={() => { onClose(); onApply(org); }}
            className="px-4 py-2 rounded-lg bg-blue-700 text-white font-semibold text-xs hover:bg-blue-800 transition-colors flex items-center gap-1"
          >
            <span>Apply to Start a Chapter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

