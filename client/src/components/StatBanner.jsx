import React from 'react';
import { MapPin, Building2, Users, DollarSign, Award } from 'lucide-react';

export default function StatBanner({ stats }) {
  const defaultStats = {
    totalChapters: 218,
    activeOrgs: 24,
    totalMembers: 8400,
    activeProjectsCount: '140+',
    campusFootprint: 140
  };

  const currentStats = stats || defaultStats;

  const items = [
    { label: 'Active Regional Chapters', value: currentStats.totalChapters, icon: MapPin },
    { label: 'Verified 501(c)(3) Networks', value: currentStats.activeOrgs, icon: Building2 },
    { label: 'Changemakers & Leads', value: currentStats.totalMembers?.toLocaleString(), icon: Users },
    { label: 'Direct Branch Launchs Given', value: currentStats.activeProjectsCount, icon: DollarSign },
    { label: 'Campuses & Cities Reached', value: currentStats.campusFootprint, icon: Award }
  ];

  return (
    <div className="bg-white border-b border-zinc-200/80 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 divide-y-0 text-center">
          {items.map((it, idx) => {
            const Icon = it.icon;
            return (
              <div key={idx} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-900 font-display">
                    {it.value}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-zinc-500">
                  {it.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

