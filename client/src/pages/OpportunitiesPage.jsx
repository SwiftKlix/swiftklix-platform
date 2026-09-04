import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, X, Building2, Users, CheckCircle2, Shield, MapPin, Check } from 'lucide-react';
import VerifiedBadge from '../components/VerifiedBadge';
import { calculateMatchScore } from '../utils/matching';

export default function OpportunitiesPage({ 
  opportunities, 
  orgs, 
  chapters,
  onApply, 
  onViewOrg, 
  onJoinBranch,
  diagnosticPrefs, 
  openDiagnosticModal 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All', 
    'Environment & Climate', 
    'Education & Youth', 
    'Technology & Coding', 
    'Mental Health & Wellness', 
    'Food Security & Hunger', 
    'Healthcare & Medicine', 
    'Civic Engagement & Policy',
    'Animal Welfare & Rescue',
    'Arts & Culture',
    'Housing & Homelessness',
    'Human Rights & Justice',
    'Economic Empowerment'
  ];

  // Calculate Match %
  const calculateMatch = (item) => calculateMatchScore(item, diagnosticPrefs, chapters);

  const filtered = (orgs || []).filter(org => {
    if (selectedCategory !== 'All' && !org.category?.toLowerCase().includes(selectedCategory.toLowerCase()) && !selectedCategory.toLowerCase().includes(org.category?.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (org.name || '').toLowerCase().includes(q) ||
        (org.tagline || '').toLowerCase().includes(q) ||
        (org.category || '').toLowerCase().includes(q) ||
        (org.headquarters || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Always sort organizations with highest match % first!
  const sorted = [...filtered].sort((a, b) => {
    const matchA = calculateMatch(a) || 0;
    const matchB = calculateMatch(b) || 0;
    if (matchB !== matchA) return matchB - matchA;
    return (b.activeChaptersCount || 0) - (a.activeChaptersCount || 0);
  });

  const userCity = diagnosticPrefs?.userLocation && !(diagnosticPrefs?.userLocation || '').toLowerCase().includes('remote')
    ? diagnosticPrefs.userLocation.split(',')[0].trim() 
    : '';

  // Helper to find if an org has an active chapter in user's city/state
  const getLocalChapter = (org) => {
    if (!userCity) return null;
    const cityLower = userCity.toLowerCase();
    
    // Check in chapters prop
    const match = (chapters || []).find(c => 
      c.orgId === org.id && (
        (c.location || '').toLowerCase().includes(cityLower) ||
        (c.institution || '').toLowerCase().includes(cityLower) ||
        (c.name || '').toLowerCase().includes(cityLower)
      )
    );
    if (match) return match;

    // Check headquarters match
    if ((org.headquarters || '').toLowerCase().includes(cityLower)) {
      return {
        name: `${org.name} ${userCity} Chapter`,
        location: org.headquarters,
        leadName: org.leadDirector || 'Regional Director',
        activeMembers: 35
      };
    }

    return null;
  };

  const hasLocalEstablished = userCity ? (orgs || []).some(o => getLocalChapter(o) !== null) : true;

  const handleStartBranch = (org) => {
    onApply({
      id: `start-${org.id}`,
      orgId: org.id,
      orgName: org.name,
      title: `Found a ${org.name} Chapter`,
      type: 'Start a Chapter',
      targetLocation: diagnosticPrefs?.userLocation || 'Your City / Campus',
      commitment: '3-4 hours / week',
      focusArea: 'Branch Leadership',
      category: org.category,
      externalApplyUrl: org.externalApplyUrl || org.branchApplyUrl || '',
      prerequisites: org.prerequisites || 'Enrolled student or community resident • 3+ hrs/wk commitment • Passion for mission'
    });
  };

  const handleJoinLocalChapter = (org, localChapter) => {
    onApply({
      id: `join-${localChapter.id || org.id}`,
      orgId: org.id,
      orgName: org.name,
      title: `Join ${localChapter.name || `${org.name} ${userCity} Branch`}`,
      type: 'Join Branch',
      targetLocation: localChapter.location || localChapter.institution || userCity,
      commitment: '2-3 hours / week',
      focusArea: 'Local Chapter Member / Officer',
      category: org.category,
      externalApplyUrl: org.externalApplyUrl || org.branchApplyUrl || '',
      prerequisites: 'Open to all local students and community members'
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Start a Branch or Join Local Chapters
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore verified organizations. If a chapter already exists in your city, join directly — or apply to pioneer a new branch in your community.
          </p>
        </div>

        <button
          onClick={openDiagnosticModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shrink-0 shadow-2xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>{diagnosticPrefs?.completed ? `Match Scores Active (${diagnosticPrefs.userLocation || 'Your Area'})` : "Take Match Quiz"}</span>
        </button>
      </div>

      {/* Notice if No In-Person Organizations or Chapters in Set Location */}
      {diagnosticPrefs?.completed && userCity && !hasLocalEstablished && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-amber-950 text-sm">
                No active in-person chapters currently established in {diagnosticPrefs.userLocation}
              </h4>
              <p className="text-amber-900 mt-0.5 leading-relaxed">
                Be the pioneer! There are no established physical branches in your area yet. You can be the first to launch an official local chapter in {userCity} for any of the recommended organizations below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-2 w-full">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search organizations by name, mission, or cause..."
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
        </div>
      </div>

      {/* Grid of Organization Placards */}
      {sorted.length === 0 ? (
        <div className="clean-card p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <p className="text-slate-700 font-semibold text-sm">No organizations found</p>
          <p className="text-slate-400 text-xs">Try selecting a different cause category or reset your search.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((org) => {
            const match = calculateMatch(org);
            const localChapter = getLocalChapter(org);
            const img = org.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80";

            return (
              <div key={org.id} className="clean-card overflow-hidden flex flex-col justify-between group hover:border-slate-300 hover:shadow-md transition-all">
                {/* Photo Banner */}
                <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                  <img src={img} alt={org.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-slate-900 shadow-xs">
                      {org.category}
                    </span>
                    {match && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                        {match}% Match
                      </span>
                    )}
                  </div>

                  {/* Established Local Chapter Ribbon */}
                  {localChapter && (
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-700 text-white shadow-md flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>Active in {userCity}</span>
                    </div>
                  )}

                  {/* Logo badge - Circular Crop */}
                  <div className="absolute -bottom-6 left-4 w-20 h-20 rounded-full bg-white p-1.5 shadow-xl border-3 border-white flex items-center justify-center z-10 overflow-hidden ring-1 ring-slate-200/80">
                    {org.logo ? (
                      <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-900 text-white font-black text-xl flex items-center justify-center">
                        {(org?.name || "O").charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 pt-9 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-bold text-base text-slate-900 leading-snug">
                        {org.name}
                      </h3>
                      <VerifiedBadge showText={false} />
                    </div>

                    <p className="text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {org.tagline}
                    </p>

                    {/* Active Local Chapter Callout */}
                    {localChapter ? (
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200/90 mb-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-blue-900 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                          <span>Active Local Chapter Established</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-tight">
                          <strong>{localChapter.name || `${org.name} ${userCity} Branch`}</strong> • Lead: {localChapter.leadName || 'Director'} • {localChapter.activeMembers || 25} active members
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <span><strong>{org.activeChaptersCount || 5}</strong> active branches</span>
                        </span>
                        <button
                          onClick={() => onViewOrg && onViewOrg(org.id)}
                          className="text-blue-700 hover:underline font-semibold"
                        >
                          View Profile
                        </button>
                      </div>
                    )}

                    {/* Prerequisites Box */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 space-y-0.5">
                      <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider">
                        Requirements & Scope:
                      </span>
                      <p className="text-slate-600 text-[11px] leading-tight">
                        {org.prerequisites || "Enrolled student or community resident • 3+ hrs/wk commitment • Passion for mission"}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Join Existing Chapter vs Start New Branch */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {localChapter ? (
                      <>
                        <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                          Active Branch in {localChapter.institution || localChapter.location}
                        </span>

                        <button
                          onClick={() => {
                            if (onJoinBranch) onJoinBranch(localChapter);
                            else if (onViewOrg) onViewOrg(org.id);
                          }}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <span>Join Local Branch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] font-medium text-slate-500">Open to all locations</span>

                        <button
                          onClick={() => handleStartBranch(org)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                        >
                          <span>Start a Branch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
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
