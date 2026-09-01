import React, { useState } from 'react';
import { 
  Search, MapPin, ArrowRight, Sparkles, X, Compass, SlidersHorizontal,
  Building2, Users, CheckCircle2, TreePine, Laptop, Heart, UtensilsCrossed, Activity, Vote, Layers,
  GraduationCap, PawPrint, Palette, Home, Scale, TrendingUp
} from 'lucide-react';
import VerifiedBadge from '../components/VerifiedBadge';
import { calculateMatchScore } from '../utils/matching';

export default function ExplorePage({ 
  orgs, 
  opportunities, 
  chapters,
  onApply, 
  onViewOrg, 
  onSelectTab, 
  openCreateOrgModal, 
  diagnosticPrefs,
  openDiagnosticModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('popular');

  const categories = [
    { name: 'All', icon: Layers },
    { name: 'Environment', icon: TreePine },
    { name: 'Education & Youth', icon: GraduationCap },
    { name: 'Tech & Coding', icon: Laptop },
    { name: 'Mental Health', icon: Heart },
    { name: 'Food Security', icon: UtensilsCrossed },
    { name: 'Healthcare', icon: Activity },
    { name: 'Civic & Policy', icon: Vote },
    { name: 'Animal Welfare', icon: PawPrint },
    { name: 'Arts & Culture', icon: Palette },
    { name: 'Housing & Relief', icon: Home },
    { name: 'Human Rights', icon: Scale },
    { name: 'Economic Empowerment', icon: TrendingUp }
  ];

  // Calculate Match % based on location and cause compatibility
  const calculateMatch = (item) => calculateMatchScore(item, diagnosticPrefs, chapters);

  // Filter organizations
  let filteredOrgs = (orgs || []).filter(org => {
    if (selectedCategory !== 'All' && org.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (org.name || '').toLowerCase().includes(q) ||
        (org.tagline || '').toLowerCase().includes(q) ||
        (org.headquarters || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Sort - Highest match % first when diagnostic is active
  if (selectedSort === 'branches') {
    filteredOrgs.sort((a, b) => (b.activeChaptersCount || 0) - (a.activeChaptersCount || 0));
  } else if (diagnosticPrefs?.completed || selectedSort === 'match') {
    filteredOrgs.sort((a, b) => {
      const matchA = calculateMatch(a) || 0;
      const matchB = calculateMatch(b) || 0;
      if (matchB !== matchA) return matchB - matchA;
      return (b.activeChaptersCount || 0) - (a.activeChaptersCount || 0);
    });
  }

  const featuredOpportunities = (opportunities || []).filter(o => o?.type === 'Start a Chapter' || o?.type === 'Branch');

  return (
    <div className="space-y-8 pb-20">
      
      {/* Onboarding Hero / Active Match Profile Bar */}
      {!diagnosticPrefs?.completed ? (
        <section className="clean-card p-6 sm:p-8 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              <span>Community & Chapter Network</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Discover Organizations & <br className="hidden sm:inline" />
              <span className="text-blue-700">Lead Local Chapters</span>
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Explore verified organizations, initiatives, and community projects. Apply to lead branch chapters or join open positions in your area.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                onClick={openDiagnosticModal}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Take 1-Min Match Quiz</span>
              </button>

              <button
                onClick={() => onSelectTab('opportunities')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
              >
                <Compass className="w-4 h-4 text-slate-500" />
                <span>Start a Branch</span>
              </button>
            </div>
          </div>

          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        </section>
      ) : (
        <div className="clean-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-blue-200/80 bg-gradient-to-r from-blue-50/50 via-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900">Personalized Match Memory Active</span>
                <span className="px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  Saved Profile
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Location: <strong className="text-slate-800">{diagnosticPrefs.userLocation || 'Austin, TX'}</strong> • {(diagnosticPrefs.causes || []).length} Causes Selected • Matches Auto-Ranked
              </p>
            </div>
          </div>

          <button
            onClick={openDiagnosticModal}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Re-tune Match Profile</span>
          </button>
        </div>
      )}

      {/* Unified Search, Category & Sort Bar */}
      <section className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-2.5">
        {/* Search Input */}
        <div className="flex-1 flex items-center gap-2 px-2 w-full">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search organizations by cause, mission, or city..."
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

        {/* Category & Sort Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <div className="flex items-center gap-1.5 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:border-slate-400"
            >
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name === 'All' ? 'All Categories' : c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:border-slate-400"
            >
              <option value="popular">Most Popular</option>
              <option value="branches">Most Active Branches</option>
              {diagnosticPrefs?.completed && <option value="match">Highest Match %</option>}
            </select>
          </div>
        </div>
      </section>

      {/* Organizations Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {selectedCategory === 'All' ? 'All Organizations & Initiatives' : `${selectedCategory} Organizations`}
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredOrgs.length} verified organizations
            </p>
          </div>
        </div>

        {filteredOrgs.length === 0 ? (
          <div className="clean-card p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <p className="text-slate-700 font-semibold text-sm">No organizations found</p>
            <p className="text-slate-400 text-xs">Try selecting a different cause or clear your search term.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => {
              const matchScore = calculateMatch(org);
              return (
                <div 
                  key={org.id} 
                  onClick={() => onViewOrg(org.id)}
                  className="clean-card overflow-hidden cursor-pointer group flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all"
                >
                  {/* Photo & Pills & Logo Avatar */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={org.image} 
                      alt={org.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-slate-900 shadow-xs backdrop-blur-xs">
                        {org.category}
                      </span>
                      {matchScore && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-700 text-white shadow-xs">
                          {matchScore}% Match
                        </span>
                      )}
                    </div>

                    {/* Logo Overlap Badge on Bottom Left - Circular Crop */}
                    <div className="absolute -bottom-3.5 left-3.5 w-12 h-12 rounded-full bg-white p-1 shadow-md border border-slate-200 flex items-center justify-center z-10 overflow-hidden">
                      {org.logo ? (
                        <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center">
                          {(org?.name || "O").charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 pt-6 flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                            {org.name}
                          </h3>
                          <VerifiedBadge />
                        </div>
                        <span className="text-slate-400 text-[11px] font-medium">{org.headquarters}</span>
                      </div>

                      <p className="font-medium text-slate-600 leading-relaxed text-xs">
                        {org.tagline}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-slate-500 mt-4">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                        <Users className="w-3.5 h-3.5 text-blue-700" />
                        <span><strong>{org.activeChaptersCount}</strong> active branches</span>
                      </span>
                      <span className="font-bold text-blue-700 group-hover:underline flex items-center gap-0.5 text-xs">
                        <span>View Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Start a Local Branch in Your Area */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Start a Local Branch in Your Area
            </h2>
            <p className="text-xs text-slate-500">
              Verified organizations ready for you to establish and lead a local chapter.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('opportunities')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>View all branches you can start</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {featuredOpportunities.length === 0 ? (
          <div className="clean-card p-8 text-center space-y-2 border border-dashed border-slate-200">
            <p className="text-slate-700 font-semibold text-xs">No branch founding campaigns currently open</p>
            <p className="text-slate-400 text-[11px]">Check back soon or register an organization to post new chapter campaigns.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredOpportunities.slice(0, 4).map((opp) => {
              const org = orgs.find(o => o.id === opp.orgId);
              const oppMatch = calculateMatch(opp);
              const img = org?.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80";

              return (
                <div key={opp.id} className="clean-card overflow-hidden flex flex-col justify-between group hover:border-slate-300 transition-all">
                  <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                    <img src={img} alt={opp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-slate-900 shadow-xs">
                        {opp.category}
                      </span>
                      {oppMatch && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-700 text-white shadow-xs">
                          {oppMatch}% Match
                        </span>
                      )}
                    </div>

                    {/* Logo badge - Circular Crop */}
                    <div className="absolute -bottom-3 left-3 w-10 h-10 rounded-full bg-white p-0.5 shadow-md border border-slate-200 flex items-center justify-center z-10 overflow-hidden">
                      {org?.logo ? (
                        <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
                          {(opp?.orgName || "O").charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-4 flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 mb-1 leading-snug">{opp.title}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <button
                          onClick={() => onViewOrg(opp.orgId)}
                          className="font-semibold text-blue-700 hover:underline flex items-center gap-1 text-xs"
                        >
                          <span>{opp.orgName}</span>
                          <VerifiedBadge />
                        </button>
                        <span className="text-slate-500 flex items-center gap-1 text-[11px] font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {opp.targetLocation}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <button
                        onClick={() => onViewOrg(opp.orgId)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        View Organization
                      </button>
                      <button
                        onClick={() => onApply(opp)}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-2xs"
                      >
                        Apply for Branch
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
