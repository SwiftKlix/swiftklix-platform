import React from 'react';

export default function ChapterCard({ opportunity, onApply, onViewOrg }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col justify-between hover:border-zinc-300 hover:shadow-xs transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
            {opportunity.focusArea}
          </span>
          <span className="text-xs text-zinc-500 font-medium">
            {opportunity.targetLocation}
          </span>
        </div>

        <h3 className="font-bold text-base text-zinc-900 mb-1 leading-snug">
          {opportunity.title}
        </h3>

        <button
          onClick={() => onViewOrg && onViewOrg(opportunity.orgId)}
          className="text-xs font-semibold text-blue-700 hover:underline block mb-2 text-left"
        >
          {opportunity.orgName}
        </button>

        <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed mb-4">
          {opportunity.description}
        </p>

        <div className="text-xs text-zinc-500 mb-4 pb-2 border-b border-zinc-100 flex items-center gap-4">
          <span>Time: <strong>{opportunity.commitment}</strong></span>
          <span>Open spots: <strong>{opportunity.spotsAvailable}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onViewOrg && onViewOrg(opportunity.orgId)}
          className="flex-1 py-2 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors text-center"
        >
          View Org
        </button>

        <button
          onClick={() => onApply(opportunity)}
          className="flex-1 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors text-center shadow-2xs"
        >
          Apply to Lead
        </button>
      </div>
    </div>
  );
}

