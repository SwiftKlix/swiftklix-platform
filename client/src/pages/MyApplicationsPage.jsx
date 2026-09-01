import React, { useState, useEffect } from 'react';
import { 
  FileText, Clock, CheckCircle2, X, ArrowRight, Trash2, Users, MapPin, 
  Building2, Briefcase, Sparkles, BookOpen, ExternalLink, Mail, Plus, ArrowUpRight 
} from 'lucide-react';

export default function MyApplicationsPage({ 
  applications = [], 
  chapters = [], 
  orgs = [], 
  opportunities = [], 
  user,
  onViewOrg,
  onSelectBranch,
  onInspectBranchGuide,
  onExploreMore, 
  onResumeDraft 
}) {
  const [activeTab, setActiveTab] = useState('joined');
  const [selectedApp, setSelectedApp] = useState(null);
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('swiftklix_drafts') || '{}');
      setDrafts(saved);
    } catch (e) {}
  }, []);

  const handleDeleteDraft = (oppId, e) => {
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem('swiftklix_drafts') || '{}');
      delete saved[oppId];
      localStorage.setItem('swiftklix_drafts', JSON.stringify(saved));
      setDrafts(saved);
    } catch (e) {}
  };

  const draftList = Object.values(drafts);

  const statusMap = {
    submitted: { label: 'Under Review', color: 'bg-blue-50 text-blue-800 border-blue-200', step: 1 },
    screening: { label: 'Intro Call / Screening', color: 'bg-amber-50 text-amber-800 border-amber-200', step: 2 },
    interview: { label: 'Committee Assigned', color: 'bg-purple-50 text-purple-800 border-purple-200', step: 3 },
    approved: { label: 'Active & Confirmed', color: 'bg-blue-50 text-blue-800 border-blue-200', step: 4 }
  };

  // 1. Joined Chapter Memberships
  const joinedMemberships = (applications || []).filter(a => 
    a?.type === 'Branch Member' || 
    a?.type === 'Join Branch' || 
    Boolean(a?.committee) || 
    (a?.role || '').toLowerCase().includes('member') ||
    (a?.title || '').toLowerCase().includes('member')
  );

  // 2. Founded / Led Chapters
  const userLedChapters = (chapters || []).filter(c => 
    (user?.name && c?.leadName?.toLowerCase().includes(user.name.toLowerCase())) ||
    (user?.email && c?.leadEmail?.toLowerCase() === user.email.toLowerCase()) ||
    (applications || []).some(a => 
      (a?.type === 'Start a Chapter' || a?.type === 'Branch' || (a?.role || '').toLowerCase().includes('branch') || (a?.role || '').toLowerCase().includes('chapter')) && 
      (a?.applicantName === c?.leadName || a?.proposedLocation === c?.location || a?.proposedLocation === c?.institution)
    )
  );

  // 3. Active Positions
  const activePositions = (applications || []).filter(a => 
    a?.type === 'Position' || 
    (!a?.type?.includes('Branch') && !a?.type?.includes('Chapter') && !a?.committee)
  );

  // 4. Pending / In-Review Applications
  const pendingApplications = (applications || []).filter(a => 
    a?.status === 'submitted' || a?.status === 'screening' || a?.status === 'interview'
  );

  const approvedApplications = (applications || []).filter(a => 
    a?.status === 'approved'
  );

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 block">
            Personal Impact & Involvement
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Dashboard
          </h1>
          <p className="text-slate-500 mt-0.5">
            Manage your joined chapter memberships, founded branch leadership, active positions, and in-review applications.
          </p>
        </div>

        <button
          onClick={onExploreMore}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs self-start sm:self-auto transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Explore More Chapters</span>
        </button>
      </div>

      {/* Metrics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="clean-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-[11px]">Joined Chapters</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900">{joinedMemberships.length}</p>
          <span className="text-[10px] text-slate-400 block">Active volunteer roles</span>
        </div>

        <div className="clean-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-[11px]">Branches Led</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900">{userLedChapters.length}</p>
          <span className="text-[10px] text-slate-400 block">Chapter Director status</span>
        </div>

        <div className="clean-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-[11px]">Core Positions</span>
            <Briefcase className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900">{activePositions.length}</p>
          <span className="text-[10px] text-slate-400 block">Staff & specialty roles</span>
        </div>

        <div className="clean-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-[11px]">In Review / Drafts</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900">{pendingApplications.length + draftList.length}</p>
          <span className="text-[10px] text-slate-400 block">Applications & proposals</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold gap-2 sm:gap-6 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('joined')}
          className={`pb-3 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'joined'
              ? 'border-blue-600 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>My Joined Chapters ({joinedMemberships.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leading')}
          className={`pb-3 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'leading'
              ? 'border-blue-600 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Branches Led ({userLedChapters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('positions')}
          className={`pb-3 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'positions'
              ? 'border-blue-600 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Positions Held ({activePositions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'applications'
              ? 'border-blue-600 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Applications & Drafts ({pendingApplications.length + draftList.length})</span>
        </button>
      </div>

      {/* TAB 1: My Joined Chapters */}
      {activeTab === 'joined' && (
        <div className="space-y-4">
          {joinedMemberships.length === 0 ? (
            <div className="clean-card p-12 text-center text-slate-500 space-y-3">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">No Chapter Memberships Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  When you click 'Join Local Branch' or 'Become a Member' on any organization, your active chapter memberships will be saved here.
                </p>
              </div>
              <button
                onClick={onExploreMore}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 inline-block transition-colors"
              >
                Browse Active Chapters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {joinedMemberships.map((m) => {
                const org = (orgs || []).find(o => o.id === m.orgId);
                const chapter = (chapters || []).find(c => c.id === m.chapterId || c.orgId === m.orgId);
                return (
                  <div key={m.id} className="clean-card p-5 space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[10px]">
                          Active Volunteer Member
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          Joined {m.appliedAt ? new Date(m.appliedAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-slate-500">{m.orgName || org?.name}</span>
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                          {m.title || (chapter ? chapter.name : 'Local Chapter Member')}
                        </h3>
                        <p className="text-slate-500 font-medium flex items-center gap-1 mt-0.5 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{m.proposedLocation || chapter?.institution || chapter?.location || 'Local Chapter'}</span>
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-semibold">Committee Track:</span>
                          <span className="font-bold text-slate-900">{m.committee || 'General Volunteer'}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-semibold">Commitment:</span>
                          <span>{m.commitment || m.weeklyAvailability || '1-2 hrs/wk'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {org && (
                        <button
                          type="button"
                          onClick={() => onViewOrg && onViewOrg(org.id)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] transition-colors"
                        >
                          View Org
                        </button>
                      )}

                      {chapter && (
                        <button
                          type="button"
                          onClick={() => onSelectBranch && onSelectBranch(chapter)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <span>Chapter Hub</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Branches Led */}
      {activeTab === 'leading' && (
        <div className="space-y-4">
          {userLedChapters.length === 0 ? (
            <div className="clean-card p-12 text-center text-slate-500 space-y-3">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">No Chartered Chapters Under Your Leadership</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  When you apply to 'Start a Branch or Chapter' and are approved, your chartered chapter leadership dashboard will appear here.
                </p>
              </div>
              <button
                onClick={onExploreMore}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 inline-block transition-colors"
              >
                Start a Branch or Chapter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userLedChapters.map((chap) => {
                const org = (orgs || []).find(o => o.id === chap.orgId);
                return (
                  <div key={chap.id} className="clean-card p-5 space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-bold text-[10px]">
                          Chapter Director
                        </span>
                        <span className="text-slate-400 text-[10px]">Active Chartered Chapter</span>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-slate-500">{org?.name || 'Chartered Organization'}</span>
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug">{chap.name}</h3>
                        <p className="text-slate-500 font-medium flex items-center gap-1 mt-0.5 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{chap.institution || chap.location}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                          <span className="text-[10px] text-slate-400 block font-semibold">Active Volunteers</span>
                          <span className="text-sm font-extrabold text-slate-900">{chap.activeMembers || 15}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                          <span className="text-[10px] text-slate-400 block font-semibold">Events Hosted</span>
                          <span className="text-sm font-extrabold text-slate-900">{chap.eventsHosted || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {org && (
                        <button
                          type="button"
                          onClick={() => onViewOrg && onViewOrg(org.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] transition-colors"
                        >
                          <span>View Org</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectBranch && onSelectBranch(chap)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <span>Chapter Portal</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Positions Held */}
      {activeTab === 'positions' && (
        <div className="space-y-4">
          {activePositions.length === 0 ? (
            <div className="clean-card p-12 text-center text-slate-500 space-y-3">
              <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">No Active Specialized Positions Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Apply for open engineering, marketing, operations, or leadership roles across verified organizations.
                </p>
              </div>
              <button
                onClick={onExploreMore}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 inline-block transition-colors"
              >
                Browse Open Positions
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activePositions.map((pos) => {
                const org = (orgs || []).find(o => o.id === pos.orgId);
                return (
                  <div key={pos.id} className="clean-card p-5 space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px]">
                          Staff / Volunteer Role
                        </span>
                        <span className="text-slate-400 text-[10px]">Active Position</span>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-slate-500">{pos.orgName || org?.name}</span>
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug">{pos.role || pos.title}</h3>
                        <p className="text-slate-500 font-medium flex items-center gap-1 mt-0.5 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{pos.proposedLocation || 'National / Remote'}</span>
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-semibold">Weekly Hours:</span>
                          <span>{pos.commitment || pos.weeklyAvailability || '2-4 hrs/wk'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {org && (
                        <button
                          type="button"
                          onClick={() => onViewOrg && onViewOrg(org.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] transition-colors"
                        >
                          View Org
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Applications & Drafts */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          
          {/* Pending Applications Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Submitted Applications in Review ({pendingApplications.length})</h3>
            </div>

            {pendingApplications.length === 0 ? (
              <div className="clean-card p-8 text-center text-slate-400">
                No applications currently in review.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApplications.map((app) => {
                  const status = statusMap[app?.status] || statusMap.submitted;
                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="clean-card p-5 cursor-pointer hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full font-bold border ${status.color}`}>
                            {status.label}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{app.role || app.title}</h4>
                        <p className="text-slate-500 flex items-center gap-2">
                          <span>{app.orgName || 'Organization'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{app.proposedLocation}</span>
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                          <span>Stage {status.step}/4</span>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Saved Drafts Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-base text-slate-900">Saved Application Drafts ({draftList.length})</h3>
            
            {draftList.length === 0 ? (
              <div className="clean-card p-8 text-center text-slate-400">
                No saved drafts in progress.
              </div>
            ) : (
              <div className="space-y-3">
                {draftList.map((draft) => (
                  <div
                    key={draft.opportunityId}
                    className="clean-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Saved Draft
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{draft.title}</h4>
                      <p className="text-slate-500">{draft.orgName} • {draft.targetLocation}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleDeleteDraft(draft.opportunityId, e)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onResumeDraft && onResumeDraft(draft)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>Resume Application</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-50 text-blue-800 border border-blue-200">
                  {statusMap[selectedApp.status]?.label || 'Under Review'}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">{selectedApp.role || selectedApp.title}</h3>
                <p className="text-slate-500">{selectedApp.orgName} • {selectedApp.proposedLocation}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Progress Timeline */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 block mb-3">Review Progress:</span>
                <div className="grid grid-cols-4 gap-1 text-center">
                  {[
                    { label: 'Submitted', step: 1 },
                    { label: 'Screening', step: 2 },
                    { label: 'Interview', step: 3 },
                    { label: 'Approved', step: 4 }
                  ].map((s) => {
                    const currentStepNum = statusMap[selectedApp?.status]?.step || 1;
                    const isDone = currentStepNum >= s.step;
                    return (
                      <div key={s.step} className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mb-1 ${
                          isDone ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                        </div>
                        <span className={`text-[10px] ${isDone ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Organization Notes */}
              {selectedApp.notes && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100">
                  <span className="font-bold text-blue-950 block mb-0.5">Latest Update from Leadership:</span>
                  <p className="text-blue-900 italic leading-relaxed">"{selectedApp.notes}"</p>
                </div>
              )}

              {/* Your Submitted Answers */}
              <div>
                <span className="font-bold text-slate-900 block mb-2">Your Submitted Responses:</span>
                {selectedApp.answers && Object.keys(selectedApp.answers).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(selectedApp.answers).map(([q, ans], idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-semibold text-slate-800 block mb-0.5">{q}</span>
                        <p className="text-slate-600 leading-relaxed">{ans}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 leading-relaxed">
                    {selectedApp.background || 'Application submitted successfully.'}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

