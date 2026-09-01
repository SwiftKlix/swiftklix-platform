import React, { useState } from 'react';
import { Search, MapPin, Sparkles, ArrowRight, X, Building2, Briefcase } from 'lucide-react';
import VerifiedBadge from '../components/VerifiedBadge';
import { calculateMatchScore, isLocalMatch } from '../utils/matching';

export default function PositionsPage({ 
  opportunities, 
  orgs, 
  chapters,
  onApply, 
  onViewOrg, 
  diagnosticPrefs, 
  openDiagnosticModal 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLocalOnly, setIsLocalOnly] = useState(diagnosticPrefs?.onlyLocal ?? false);

  const categories = [
    'All', 
    'Environment', 
    'Education & Youth', 
    'Tech & Coding', 
    'Mental Health', 
    'Food Security', 
    'Healthcare', 
    'Civic & Policy',
    'Animal Welfare',
    'Arts & Culture',
    'Housing & Relief',
    'Human Rights',
    'Economic Empowerment'
  ];

  // Calculate Match %
  const calculateMatch = (item) => calculateMatchScore(item, diagnosticPrefs, chapters);

  const positionOpps = (opportunities || []).filter(o => o?.type === 'Position' || o?.type === 'Volunteer' || o?.type === 'Core Team');

  const filtered = positionOpps.filter(opp => {
    if (selectedCategory !== 'All' && opp.category !== selectedCategory) return false;
    if (isLocalOnly && diagnosticPrefs?.userLocation && !isLocalMatch(opp, diagnosticPrefs, chapters)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (opp.title || '').toLowerCase().includes(q) ||
        (opp.orgName || '').toLowerCase().includes(q) ||
        (opp.targetLocation || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Always sort positions with highest match % first!
  const sorted = [...filtered].sort((a, b) => {
    const matchA = calculateMatch(a) || 0;
    const matchB = calculateMatch(b) || 0;
    return matchB - matchA;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Positions & Volunteer Roles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Apply to open volunteer roles, branch leadership, and event coordinator positions.
          </p>
        </div>

        <button
          onClick={openDiagnosticModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shrink-0 shadow-2xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>{diagnosticPrefs?.completed ? "Adjust Matching (1-100%)" : "Take Match Quiz"}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-2 w-full">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search positions by role title, skill, or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent focus:outline-none text-slate-900 placeholder-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700 focus:outline-none"
          >
            {categories.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>

          {diagnosticPrefs?.userLocation && (
            <button
              onClick={() => setIsLocalOnly(!isLocalOnly)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors ${
                isLocalOnly 
                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' 
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{isLocalOnly ? `Area: ${diagnosticPrefs.userLocation.split(',')[0]}` : "Local Area"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Position Cards */}
      {sorted.length === 0 ? (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-amber-950 text-sm">
                  No open in-person positions currently listed in {diagnosticPrefs?.userLocation}
                </h4>
                <p className="text-amber-900 mt-0.5 leading-relaxed">
                  There are no in-person volunteer openings in your immediate area right now. We have surfaced top-matching opportunities in nearby branches below, or you can apply to start a new branch in your city!
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsLocalOnly(false)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shrink-0 transition-colors"
            >
              Show All In-Person & Hybrid
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {positionOpps.slice(0, 6).map((opp) => {
              const org = orgs?.find(o => o.id === opp.orgId);
              const match = calculateMatch(opp);
              const img = org?.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80";

              return (
                <div key={opp.id} className="clean-card overflow-hidden flex flex-col justify-between group hover:border-slate-300 hover:shadow-md transition-all">
                  <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                    <img src={img} alt={opp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-slate-900 shadow-xs">
                        {opp.category}
                      </span>
                      {match && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                          {match}% Match
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span className="font-semibold text-blue-800">{opp.orgName}</span>
                        <span>{opp.commitment}</span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 mb-1.5 leading-snug">
                        {opp.title}
                      </h3>

                      <p className="text-slate-600 line-clamp-2 leading-relaxed mb-3">
                        {opp.description}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3 pt-2 border-t border-slate-100">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{opp.targetLocation}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">{opp.focusArea || 'Volunteer Role'}</span>
                      <button
                        onClick={() => onApply(opp)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs"
                      >
                        Apply for Position
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((opp) => {
            const org = orgs?.find(o => o.id === opp.orgId);
            const match = calculateMatch(opp);
            const img = org?.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80";

            return (
              <div key={opp.id} className="clean-card overflow-hidden flex flex-col justify-between group hover:border-slate-300 hover:shadow-md transition-all">
                {/* Photo Banner */}
                <div className="relative h-32 w-full bg-slate-100 overflow-hidden">
                  <img src={img} alt={opp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-slate-900 shadow-xs">
                      {opp.category}
                    </span>
                    {match && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                        {match}% Match
                      </span>
                    )}
                  </div>

                  {/* Logo badge - Circular Crop */}
                  <div className="absolute -bottom-2.5 left-3.5 w-10 h-10 rounded-full bg-white p-0.5 shadow-md border border-slate-200 flex items-center justify-center z-10 overflow-hidden">
                    {org?.logo ? (
                      <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
                        {(opp?.orgName || "O").charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 pt-4 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 mb-1 leading-snug">
                      {opp.title}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => onViewOrg && onViewOrg(opp.orgId)}
                        className="font-semibold text-blue-700 hover:underline flex items-center gap-1 text-xs"
                      >
                        <span>{opp.orgName}</span>
                        <VerifiedBadge />
                      </button>

                      <span className="text-slate-500 flex items-center gap-1 font-medium text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {opp.targetLocation}
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed line-clamp-2 text-xs mb-3">
                      {opp.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => onViewOrg && onViewOrg(opp.orgId)}
                      className="flex-1 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center text-xs"
                    >
                      View Org
                    </button>

                    <button
                      onClick={() => onApply(opp)}
                      className="flex-1 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors text-center text-xs shadow-2xs"
                    >
                      Apply for Role
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
