import React from 'react';
import { Compass, Building2, Layers, Check } from 'lucide-react';

export default function PersonaBar({ activePersona, onSelectPersona }) {
  const personas = [
    {
      id: 'changemaker',
      label: 'Changemaker / Student',
      tag: 'Apply for Chapters & Positions',
      icon: Compass,
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      id: 'hq_founder',
      label: 'Non-Profit HQ Founder',
      tag: 'Manage Expansions & CRM',
      icon: Building2,
      color: 'text-amber-800 bg-amber-50 border-amber-200'
    },
    {
      id: 'chapter_lead',
      label: 'Active Chapter Lead',
      tag: 'Branch Roster & Events',
      icon: Layers,
      color: 'text-blue-800 bg-blue-50 border-blue-200'
    }
  ];

  return (
    <div className="bg-zinc-900 text-white border-b border-zinc-800 py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400">
            Interactive User Mode:
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {personas.map((p) => {
            const Icon = p.icon;
            const isSelected = activePersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPersona(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-zinc-800 border-zinc-600 text-white shadow-xs'
                    : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-zinc-400'}`} />
                <span>{p.label}</span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">
                    ?
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

