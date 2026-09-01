import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import CoFounderCard from '../components/CoFounderCard';

export default function MatchmakerPage({ 
  matchmaking, 
  onConnect, 
  openPostProfileModal 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = matchmaking.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.headline || '').toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q) ||
      p.skills.some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
            Find a Co-Lead or Volunteer Partner
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Connect with students and organizers looking to team up to start local chapters.
          </p>
        </div>

        <button
          onClick={openPostProfileModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post Your Profile</span>
        </button>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search by city, name, or skill (e.g. Seattle, Design, Python)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-900"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
          <p className="text-sm font-semibold text-zinc-800">No profiles found</p>
          <p className="text-xs text-zinc-500 mt-1">Be the first to post a profile looking for a partner!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((profile) => (
            <CoFounderCard 
              key={profile.id} 
              profile={profile} 
              onConnect={onConnect} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

