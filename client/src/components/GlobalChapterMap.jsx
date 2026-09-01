import React, { useState } from 'react';
import { Globe2, MapPin, ArrowRight, Sparkles } from 'lucide-react';

export default function GlobalChapterMap({ onSelectLocation }) {
  const hubs = [
    { id: 'boston', name: 'Boston & Cambridge', chapters: 28, activeVolunteers: 180, openTargets: 4, icon: '???' },
    { id: 'sf', name: 'San Francisco & Bay Area', chapters: 34, activeVolunteers: 240, openTargets: 6, icon: '??' },
    { id: 'chicago', name: 'Chicago Metro', chapters: 19, activeVolunteers: 130, openTargets: 3, icon: '???' },
    { id: 'austin', name: 'Austin & Central TX', chapters: 16, activeVolunteers: 110, openTargets: 5, icon: '??' },
    { id: 'seattle', name: 'Seattle & PNW', chapters: 22, activeVolunteers: 150, openTargets: 3, icon: '??' },
    { id: 'nyc', name: 'New York City Hub', chapters: 42, activeVolunteers: 310, openTargets: 8, icon: '??' },
    { id: 'atlanta', name: 'Atlanta & Southeast', chapters: 18, activeVolunteers: 120, openTargets: 4, icon: '??' },
    { id: 'toronto', name: 'Toronto & Great Lakes', chapters: 14, activeVolunteers: 95, openTargets: 2, icon: '??' }
  ];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-zinc-200/80 shadow-soft">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold mb-1">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Interactive Regional Hubs</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-zinc-900 tracking-tight">
            Expansion Hubs & Target Cities
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Click any regional cluster to instantly filter active branches and university openings.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-zinc-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Active Chapters</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Open Branch Launchs</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {hubs.map((hub) => (
          <div
            key={hub.id}
            onClick={() => onSelectLocation && onSelectLocation(hub.name)}
            className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:bg-white hover:border-blue-500/50 hover:shadow-soft transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl p-2 rounded-xl bg-white border border-zinc-200 shadow-soft">
                  {hub.icon}
                </span>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 border border-amber-300 px-2 py-0.5 rounded-full">
                  {hub.openTargets} openings active
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-zinc-900 group-hover:text-blue-700 transition-colors">
                {hub.name}
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs py-2 border-t border-zinc-200">
                <div>
                  <span className="text-[10px] text-zinc-500 block">Chapters</span>
                  <span className="font-bold text-zinc-900 text-sm">{hub.chapters}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">Branch Launchs</span>
                  <span className="font-bold text-blue-700 text-sm">{hub.activeVolunteers} Volunteers</span>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform">
              <span>Filter Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

