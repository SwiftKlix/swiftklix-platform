import React, { useState, useEffect } from 'react';
import { ArrowLeft, Globe, Mail, MapPin, CheckCircle2, Plus, Sparkles, ExternalLink, Users, Calendar, ArrowRight, ThumbsUp, MessageSquare, Share2, Instagram, Twitter } from 'lucide-react';
import { api } from '../services/api';
import VerifiedBadge from '../components/VerifiedBadge';
import { calculateMatchScore } from '../utils/matching';

export default function OrgDetailPage({ 
  org, 
  opportunities, 
  chapters, 
  onBack, 
  onApply, 
  onInspectBranchGuide,
  onSelectBranch,
  onJoinBranch,
  diagnosticPrefs 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    if (org?.id) {
      api.getPosts(org.id)
        .then(data => setPosts(data))
        .catch(err => console.error('Error loading posts:', err));
    }
  }, [org?.id]);

  const handleLike = async (postId) => {
    if (likedPosts[postId]) return;
    try {
      const updated = await api.likePost(postId);
      setPosts(prev => prev.map(p => p.id === postId ? updated : p));
      setLikedPosts(prev => ({ ...prev, [postId]: true }));
    } catch (e) {
      console.error('Error liking post', e);
    }
  };

  if (!org) return null;

  const orgOpps = (opportunities || []).filter(o => o.orgId === org.id);
  const orgBranches = (chapters || []).filter(c => c.orgId === org.id);

  // Calculate Match %
  const orgMatch = calculateMatchScore(org, diagnosticPrefs, chapters);

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Organizations</span>
      </button>

      {/* Member Profile Header Card */}
      <div className="clean-card overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 w-full bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
          {org.image ? (
            <img 
              src={org.image} 
              alt={org.name} 
              className="w-full h-full object-cover opacity-85" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <Sparkles className="w-16 h-16 text-white/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-8 pt-0 relative">
          {/* Logo Avatar overlapping cover */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-14 mb-4 gap-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white p-2 shadow-xl border-2 border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {org.logo ? (
                <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-3xl">
                  {(org?.name || "O").charAt(0)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {orgMatch && (
                <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>{orgMatch}% Match</span>
                </span>
              )}

              {orgBranches.length > 0 ? (
                <button
                  type="button"
                  onClick={() => onJoinBranch ? onJoinBranch(orgBranches[0]) : null}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Join Local Branch</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const branchOpp = (orgOpps || []).find(o => o?.type === 'Start a Chapter' || o?.type === 'Branch');
                    if (branchOpp) onApply(branchOpp);
                    else onApply({ orgId: org?.id, orgName: org?.name || 'Organization', title: `Start a ${org?.name || 'Local'} Branch or Chapter`, targetLocation: 'Your City' });
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  + Start a Branch or Chapter
                </button>
              )}
            </div>
          </div>

          {/* Org Title & Badges */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {org.name}
              </h1>
              <VerifiedBadge />
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                {org.category}
              </span>
            </div>

            <p className="text-sm font-medium text-slate-700 leading-snug">
              {org.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{org?.headquarters || 'Remote / National'}</span>
              </span>
              {org?.website && (
                <a 
                  href={org.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1 text-blue-700 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{org.website.replace('https://', '')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {org?.contactEmail && (
                <a 
                  href={`mailto:${org.contactEmail}`}
                  className="flex items-center gap-1 text-slate-600 hover:text-blue-700"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{org.contactEmail}</span>
                </a>
              )}

              {/* Social Channels */}
              <div className="flex items-center gap-2.5 ml-auto">
                {org?.socials?.instagram && (
                  <a 
                    href={org.socials.instagram} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1 rounded-lg hover:bg-slate-100 text-pink-600"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {org?.socials?.twitter && (
                  <a 
                    href={org.socials.twitter} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1 rounded-lg hover:bg-slate-100 text-sky-500"
                    title="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {org?.socials?.tiktok && (
                  <a 
                    href={org.socials.tiktok} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-900"
                    title="TikTok"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Member Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Active Branches</span>
              <span className="font-bold text-slate-900 text-base">{org?.activeChaptersCount || 0}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Volunteers Involved</span>
              <span className="font-bold text-slate-900 text-base">{org?.membersCount ? `${org.membersCount}+` : "0"}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Verification</span>
              <span className="font-bold text-blue-700 text-base">{org?.status || 'Verified Official'}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-slate-200 px-6 bg-slate-50/50 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: 'About & Mission' },
            { id: 'posts', label: `Activity & Updates (${posts.length})` },
            { id: 'openings', label: `Open Positions & Branches (${orgOpps.length})` },
            { id: 'branches', label: `Active Branches (${orgBranches.length})` }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === t.id
                  ? 'border-slate-900 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: About & Mission */}
      {activeTab === 'overview' && (
        <div className="clean-card p-6 sm:p-8 space-y-6 text-xs sm:text-sm">
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-2">About {org.name}</h3>
            <p className="text-slate-600 leading-relaxed">
              {org.description}
            </p>
          </div>


        </div>
      )}

      {/* Tab: Member Activity & Updates Feed */}
      {activeTab === 'posts' && (
        <div className="space-y-4 text-xs">
          {posts.length === 0 ? (
            <div className="clean-card p-10 text-center text-slate-500">
              No recent updates posted by this organization yet.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="clean-card p-6 space-y-4">
                {/* Author Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                      {(org?.name || "O").charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-sm">{org.name}</h4>
                        <VerifiedBadge />
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Posted by {post.authorName || 'Team'} - {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                {post.title && (
                  <h3 className="font-bold text-sm text-slate-900">{post.title}</h3>
                )}
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">{post.content}</p>

                {/* Photo attachment */}
                {post.image && (
                  <div className="rounded-2xl overflow-hidden max-h-72 w-full border border-slate-200">
                    <img src={post.image} alt="Update" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Like & Interact Bar */}
                <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-semibold">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors ${
                      likedPosts[post.id] 
                        ? 'text-blue-700 bg-blue-50' 
                        : 'hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.likes || 0} Likes</span>
                  </button>

                  <div className="flex items-center gap-1 py-1 px-2.5 text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsCount || 0} Comments</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Openings */}
      {activeTab === 'openings' && (
        <div className="space-y-4">
          {orgOpps.length === 0 ? (
            <div className="clean-card p-8 text-center text-xs text-slate-500">
              No specific openings listed right now. You can still apply to start a new branch!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {orgOpps.map((opp) => (
                <div key={opp.id} className="clean-card p-5 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {opp.targetLocation}
                      </span>
                      <span className="text-slate-500 font-medium">{opp.commitment}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1">{opp.title}</h4>
                    <p className="text-slate-600 line-clamp-2 leading-relaxed mb-4">{opp.description}</p>
                  </div>
                  <button
                    onClick={() => onApply(opp)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
                  >
                    Apply for Position
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Branches Tab */}
      {activeTab === 'branches' && (
        <div className="clean-card divide-y divide-slate-100 text-xs">
          {orgBranches.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No active branches chartered yet. Be the first to start one!</div>
          ) : (
            orgBranches.map((b) => (
              <div 
                key={b.id} 
                onClick={() => onSelectBranch && onSelectBranch(b)}
                className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{b.name}</h4>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold text-[10px]">
                      Active
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">Director: {b.leadName} - {b.institution || b.location}</p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-slate-100 font-semibold text-slate-700">
                    {b.activeMembers} Volunteers
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onJoinBranch) onJoinBranch(b);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>Join Branch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-slate-600 font-semibold flex items-center gap-0.5 text-xs hover:text-slate-900">
                    <span>Details</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Prominent Bottom Action: Become a Member */}
      <div className="clean-card p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl border border-slate-800">
        <div className="space-y-1 max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block">
            Get Involved Locally
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white">
            Become a Member of {org?.name}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Join thousands of student volunteers taking action on the ground. Connect with an active local branch or chapter or help expand our mission.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          {org?.applicationSetupComplete === false ? (
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-slate-300 text-xs font-medium text-center max-w-sm">
              <span>Application screening questions are currently being configured by {org?.name} leadership. Check back shortly to apply!</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  if (onJoinBranch) {
                    onJoinBranch(
                      orgBranches.length > 0 
                        ? orgBranches[0] 
                        : { orgId: org?.id, name: `${org?.name || 'Organization'} Volunteer Network`, location: org?.headquarters || 'Remote / Local', institution: org?.headquarters || 'National' }
                    );
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Join as Member / Volunteer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const branchOpp = (orgOpps || []).find(o => o?.type === 'Start a Chapter' || o?.type === 'Branch');
                  if (branchOpp) onApply(branchOpp);
                  else onApply({ orgId: org?.id, orgName: org?.name, title: `Start a ${org?.name || 'Local'} Branch or Chapter`, type: 'Start a Chapter', targetLocation: '' });
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer text-center"
              >
                <span>Start a Chapter in Your City</span>
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}

