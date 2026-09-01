import React from 'react';

export default function CoFounderCard({ profile, onConnect }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col justify-between hover:border-zinc-300 hover:shadow-xs transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-base text-zinc-900 leading-tight">
            {profile.name}
          </h3>
          <span className="text-xs text-zinc-500 font-medium">
            {profile.location}
          </span>
        </div>

        <p className="text-xs font-semibold text-blue-800 mb-2 leading-snug">
          {profile.headline}
        </p>

        <p className="text-xs text-zinc-600 mb-3 line-clamp-3 leading-relaxed">
          {profile.bio}
        </p>

        <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 mb-3 text-xs">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Looking for</span>
          <span className="text-zinc-800 font-medium">{profile.lookingFor}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {profile.skills.map((skill, idx) => (
            <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-[11px] text-zinc-400 truncate max-w-[150px]">
          {profile.contactEmail}
        </span>

        <button
          onClick={() => onConnect(profile)}
          className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 transition-colors"
        >
          Contact
        </button>
      </div>
    </div>
  );
}

