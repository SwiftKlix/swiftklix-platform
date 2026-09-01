import React from 'react';

export default function RoleCard({ role, onApply, onViewOrg }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col justify-between hover:border-zinc-300 hover:shadow-xs transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
            {role.focusArea || 'Volunteer Role'}
          </span>
          <span className="text-xs text-zinc-500 font-medium">
            {role.targetLocation}
          </span>
        </div>

        <h3 className="font-bold text-base text-zinc-900 mb-1 leading-snug">
          {role.title}
        </h3>

        <button
          onClick={() => onViewOrg && onViewOrg(role.orgId)}
          className="text-xs font-semibold text-blue-700 hover:underline block mb-2 text-left"
        >
          {role.orgName}
        </button>

        <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed mb-4">
          {role.description}
        </p>

        <div className="text-xs text-zinc-500 mb-4 pb-2 border-b border-zinc-100">
          Commitment: <strong>{role.commitment || '2-4 hrs/wk'}</strong>
        </div>
      </div>

      <div className="pt-1">
        <button
          onClick={() => onApply(role)}
          className="w-full py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors text-center"
        >
          Apply for Role
        </button>
      </div>
    </div>
  );
}

