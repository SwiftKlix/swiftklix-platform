import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Plus, CheckCircle2, ShieldCheck, Globe, 
  Linkedin, Twitter, Instagram, Github, MessageSquare, 
  Save, Sparkles, FileText, ImageIcon, Trash2, ArrowUpRight,
  Send, ThumbsUp, Upload, X, Check, MapPin, Users, Briefcase, UserCheck, Eye, Edit3, Link, Calendar, Sliders, HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import KanbanBoard from '../components/KanbanBoard';
import VerifiedBadge from '../components/VerifiedBadge';

export default function MyOrgPage({ 
  orgs, 
  opportunities, 
  applications, 
  chapters, 
  onSaveOrg, 
  onCreateOrg, 
  onUpdateStatus, 
  onUpdateOpportunity,
  onDeleteOpportunity,
  onUpdateChapter,
  onCreateChapter,
  onDeleteChapter,
  openCreateCampaignModal,
  onViewLiveProfile 
}) {
  const [selectedOrgId, setSelectedOrgId] = useState(orgs?.[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState('profile'); // profile, posts, branches, branch_apps, members, openings, position_crm, verification
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [profileViewMode, setProfileViewMode] = useState('edit');
  const [memberViewMode, setMemberViewMode] = useState('pipeline'); // 'pipeline' or 'roster'

  // Branch Editing State
  const [editingChapter, setEditingChapter] = useState(null);
  const [isCharteringNewBranch, setIsCharteringNewBranch] = useState(false);
  const [branchFormData, setBranchFormData] = useState({
    name: '',
    location: '',
    institution: '',
    leadName: '',
    leadEmail: '',
    activeMembers: 15,
    eventsHosted: 2,
    recentEvent: 'Inaugural Meeting',
    meetingSchedule: 'Bi-weekly Wednesdays 6:00 PM',
    status: 'Active'
  });

  // Opportunity / Role Specific Editing State
  const [editingOpp, setEditingOpp] = useState(null);
  const [oppFormData, setOppFormData] = useState({
    title: '',
    type: 'Position',
    targetLocation: 'Remote / All Locations',
    commitment: '3-5 hours / week',
    focusArea: 'General',
    category: 'Environment',
    spotsAvailable: 2,
    description: '',
    customQuestions: []
  });

  // File Input Refs
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const postImageInputRef = useRef(null);

  // Post Creator State
  const [orgPosts, setOrgPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);

  const currentOrg = orgs?.find(o => o.id === selectedOrgId) || orgs?.[0] || {
    name: 'New Organization',
    tagline: 'Empowering community action and local chapters',
    category: 'Environment & Climate',
    headquarters: 'Austin, TX',
    description: '',
    contactEmail: 'contact@org.org',
    website: 'https://org.org',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    logo: '',
    externalApplyUrl: '',
    socials: {},
    verification: { ein: '84-1928472', registryDoc: 'https://irs.gov/501c3', status: 'Verified Official' },
    customQuestions: [],
    externalMembershipUrl: '',
    membershipRequirements: 'Open to all enrolled students and local community members.',
    membershipQuestions: [],
    membershipCommittees: []
  };

  const [formData, setFormData] = useState({
    name: currentOrg.name || '',
    tagline: currentOrg.tagline || '',
    category: currentOrg.category || 'Environment & Climate',
    headquarters: currentOrg.headquarters || '',
    description: currentOrg.description || '',
    contactEmail: currentOrg.contactEmail || '',
    website: currentOrg.website || '',
    image: currentOrg.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    logo: currentOrg.logo || '',
    externalApplyUrl: currentOrg.externalApplyUrl || '',
    socials: {
      linkedin: currentOrg.socials?.linkedin || 'https://linkedin.com',
      twitter: currentOrg.socials?.twitter || 'https://x.com',
      instagram: currentOrg.socials?.instagram || 'https://instagram.com',
      github: currentOrg.socials?.github || '',
      discord: currentOrg.socials?.discord || ''
    },
    verification: {
      ein: currentOrg.verification?.ein || '84-1928472',
      registryDoc: currentOrg.verification?.registryDoc || '',
      status: currentOrg.verification?.status || 'Verified Official'
    },
    customQuestions: currentOrg.customQuestions || [
      'Which university campus or city do you plan to establish this branch in?',
      'What is your target timeline for hosting your inaugural chapter kickoff?',
      'How many founding co-leads or student officers will help you organize?'
    ],
    externalMembershipUrl: currentOrg.externalMembershipUrl || '',
    membershipRequirements: currentOrg.membershipRequirements || 'Open to all enrolled students and local community members.',
    membershipQuestions: currentOrg.membershipQuestions || [
      'What specific initiatives or cause areas in our organization interest you most?',
      'What previous volunteering, campus club, or project experience do you bring?'
    ],
    membershipCommittees: currentOrg.membershipCommittees || [
      'Event Organizing & Planning',
      'Community Outreach & Partnerships',
      'Marketing & Social Media',
      'Logistics & Operations',
      'General Volunteer & Participant'
    ]
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (currentOrg && !isRegisterMode) {
      setFormData({
        name: currentOrg.name || '',
        tagline: currentOrg.tagline || '',
        category: currentOrg.category || 'Environment & Climate',
        headquarters: currentOrg.headquarters || '',
        description: currentOrg.description || '',
        contactEmail: currentOrg.contactEmail || '',
        website: currentOrg.website || '',
        image: currentOrg.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
        logo: currentOrg.logo || '',
        externalApplyUrl: currentOrg.externalApplyUrl || '',
        socials: {
          linkedin: currentOrg.socials?.linkedin || 'https://linkedin.com',
          twitter: currentOrg.socials?.twitter || 'https://x.com',
          instagram: currentOrg.socials?.instagram || 'https://instagram.com',
          github: currentOrg.socials?.github || '',
          discord: currentOrg.socials?.discord || ''
        },
        verification: {
          ein: currentOrg.verification?.ein || '84-1928472',
          registryDoc: currentOrg.verification?.registryDoc || '',
          status: currentOrg.verification?.status || 'Verified Official'
        },
        customQuestions: currentOrg.customQuestions || [
          'Which university campus or city do you plan to establish this branch in?',
          'What is your target timeline for hosting your inaugural chapter kickoff?',
          'How many founding co-leads or student officers will help you organize?'
        ],
        externalMembershipUrl: currentOrg.externalMembershipUrl || '',
        membershipRequirements: currentOrg.membershipRequirements || 'Open to all enrolled students and local community members.',
        membershipQuestions: currentOrg.membershipQuestions || [
          'What specific initiatives or cause areas in our organization interest you most?',
          'What previous volunteering, campus club, or project experience do you bring?'
        ],
        membershipCommittees: currentOrg.membershipCommittees || [
          'Event Organizing & Planning',
          'Community Outreach & Partnerships',
          'Marketing & Social Media',
          'Logistics & Operations',
          'General Volunteer & Participant'
        ]
      });
      loadPosts(currentOrg.id);
    }
  }, [selectedOrgId, isRegisterMode]);

  const loadPosts = async (orgId) => {
    try {
      const p = await api.getPosts(orgId);
      setOrgPosts(p);
    } catch (e) {}
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result;
      if (type === 'logo') {
        setFormData(prev => ({ ...prev, logo: dataUrl }));
      } else if (type === 'banner') {
        setFormData(prev => ({ ...prev, image: dataUrl }));
      } else if (type === 'post') {
        setNewPostImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSubmit = (e) => {
    if (e) e.preventDefault();
    if (isRegisterMode) {
      const newOrgData = {
        ...formData,
        status: 'Verified Official',
        verification: {
          ...formData.verification,
          status: 'Verified Official'
        }
      };
      onCreateOrg(newOrgData);
      setIsRegisterMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      onSaveOrg(currentOrg.id, formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    try {
      const newPost = await api.createPost({
        orgId: currentOrg.id,
        orgName: currentOrg.name,
        orgLogo: currentOrg.logo,
        title: newPostTitle,
        content: newPostContent,
        image: newPostImage
      });
      setOrgPosts(prev => [newPost, ...prev]);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostImage('');
      setPostSuccess(true);
      setTimeout(() => setPostSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  // Branch Questions Helpers
  const addCustomQuestion = () => {
    setFormData(prev => ({
      ...prev,
      customQuestions: [...(prev.customQuestions || []), ""]
    }));
  };

  const updateCustomQuestion = (index, value) => {
    setFormData(prev => {
      const updated = [...(prev.customQuestions || [])];
      updated[index] = value;
      return { ...prev, customQuestions: updated };
    });
  };

  const removeCustomQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      customQuestions: (prev.customQuestions || []).filter((_, i) => i !== index)
    }));
  };

  // Membership Questions Helpers
  const addMembershipQuestion = () => {
    setFormData(prev => ({
      ...prev,
      membershipQuestions: [...(prev.membershipQuestions || []), ""]
    }));
  };

  const updateMembershipQuestion = (index, value) => {
    setFormData(prev => {
      const updated = [...(prev.membershipQuestions || [])];
      updated[index] = value;
      return { ...prev, membershipQuestions: updated };
    });
  };

  const removeMembershipQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      membershipQuestions: (prev.membershipQuestions || []).filter((_, i) => i !== index)
    }));
  };

  // Membership Committees Helpers
  const addMembershipCommittee = () => {
    setFormData(prev => ({
      ...prev,
      membershipCommittees: [...(prev.membershipCommittees || []), ""]
    }));
  };

  const updateMembershipCommittee = (index, value) => {
    setFormData(prev => {
      const updated = [...(prev.membershipCommittees || [])];
      updated[index] = value;
      return { ...prev, membershipCommittees: updated };
    });
  };

  const removeMembershipCommittee = (index) => {
    setFormData(prev => ({
      ...prev,
      membershipCommittees: (prev.membershipCommittees || []).filter((_, i) => i !== index)
    }));
  };

  // Branch Editing Handlers
  const handleOpenEditBranch = (chap) => {
    setEditingChapter(chap);
    setBranchFormData({
      name: chap.name || '',
      location: chap.location || '',
      institution: chap.institution || '',
      leadName: chap.leadName || '',
      leadEmail: chap.leadEmail || '',
      activeMembers: chap.activeMembers || 15,
      eventsHosted: chap.eventsHosted || 2,
      recentEvent: chap.recentEvent || 'Regular Meeting',
      meetingSchedule: chap.meetingSchedule || 'Bi-weekly Wednesdays 6:00 PM',
      status: chap.status || 'Active'
    });
  };

  const handleOpenCharterNewBranch = () => {
    setIsCharteringNewBranch(true);
    setBranchFormData({
      name: `${currentOrg?.name || 'Local'} Chapter`,
      location: '',
      institution: '',
      leadName: '',
      leadEmail: '',
      activeMembers: 1,
      eventsHosted: 0,
      recentEvent: 'Chapter Inauguration',
      meetingSchedule: 'TBD',
      status: 'Active'
    });
  };

  const handleBranchFormSubmit = (e) => {
    e.preventDefault();
    if (isCharteringNewBranch) {
      if (onCreateChapter) {
        onCreateChapter({
          ...branchFormData,
          orgId: currentOrg.id,
          orgName: currentOrg.name
        });
      }
      setIsCharteringNewBranch(false);
    } else if (editingChapter) {
      if (onUpdateChapter) {
        onUpdateChapter(editingChapter.id, branchFormData);
      }
      setEditingChapter(null);
    }
  };

  const handleDeleteBranchSubmit = (chapId) => {
    if (window.confirm("Are you sure you want to remove this chartered branch?")) {
      if (onDeleteChapter) onDeleteChapter(chapId);
      setEditingChapter(null);
    }
  };

  // Opportunity / Role Questions Editing Handlers
  const handleOpenEditOpp = (opp) => {
    setEditingOpp(opp);
    setOppFormData({
      title: opp.title || '',
      type: opp.type || 'Position',
      targetLocation: opp.targetLocation || 'Remote / All Locations',
      commitment: opp.commitment || '3-5 hours / week',
      focusArea: opp.focusArea || 'General',
      category: opp.category || currentOrg.category,
      spotsAvailable: opp.spotsAvailable || 2,
      description: opp.description || '',
      customQuestions: opp.customQuestions || [
        `What relevant experience or technical skills qualify you for this ${opp.title} role?`,
        'How many hours per week can you reliably dedicate to team syncs and milestones?',
        'Describe a past initiative or project where you led similar responsibilities.'
      ]
    });
  };

  const handleSaveOppSubmit = (e) => {
    e.preventDefault();
    if (editingOpp && onUpdateOpportunity) {
      onUpdateOpportunity(editingOpp.id, oppFormData);
      setEditingOpp(null);
    }
  };

  const addOppQuestion = () => {
    setOppFormData(prev => ({
      ...prev,
      customQuestions: [...(prev.customQuestions || []), ""]
    }));
  };

  const updateOppQuestion = (index, value) => {
    setOppFormData(prev => {
      const updated = [...(prev.customQuestions || [])];
      updated[index] = value;
      return { ...prev, customQuestions: updated };
    });
  };

  const removeOppQuestion = (index) => {
    setOppFormData(prev => ({
      ...prev,
      customQuestions: (prev.customQuestions || []).filter((_, i) => i !== index)
    }));
  };

  // Data Categorization
  const orgOpportunities = (opportunities || []).filter(o => o?.orgId === currentOrg?.id);
  const orgAllApplications = (applications || []).filter(a => 
    a?.orgId === currentOrg?.id || 
    (currentOrg?.name && (a?.orgName || '').toLowerCase() === currentOrg.name.toLowerCase()) ||
    (currentOrg?.name && (a?.role || a?.title || '').toLowerCase().includes(currentOrg.name.toLowerCase()))
  );

  const orgMembers = orgAllApplications.filter(a => 
    a?.type === 'Branch Member' || 
    a?.type === 'Join Branch' || 
    Boolean(a?.committee) ||
    (a?.role || '').toLowerCase().includes('member') || 
    (a?.title || '').toLowerCase().includes('member')
  );

  const orgBranchApplicants = orgAllApplications.filter(a => 
    !orgMembers.includes(a) && (
      a?.type === 'Start a Chapter' || 
      a?.type === 'Branch' || 
      (a?.role || '').toLowerCase().includes('branch') || 
      (a?.role || '').toLowerCase().includes('chapter') || 
      (a?.role || '').toLowerCase().includes('founding') || 
      (a?.role || '').toLowerCase().includes('lead') ||
      (a?.title || '').toLowerCase().includes('branch') ||
      (a?.title || '').toLowerCase().includes('chapter') ||
      (a?.title || '').toLowerCase().includes('lead')
    )
  );

  const orgPositionApplicants = orgAllApplications.filter(a => 
    !orgMembers.includes(a) && !orgBranchApplicants.includes(a)
  );

  const orgChapters = (chapters || []).filter(c => c?.orgId === currentOrg?.id);
  const totalVolunteers = orgChapters.reduce((acc, chap) => acc + (chap?.activeMembers || 0), 24);

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto">
      
      {/* Top Header & Org Switcher */}
      <div className="clean-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-blue-800 uppercase block mb-1">
            {isRegisterMode ? "New Organization Registration" : "Platform Management Hub"}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {isRegisterMode ? "Register & Launch New Organization" : "Organization Dashboard"}
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            {isRegisterMode 
              ? "Publish your organization profile, branch openings, and screening questions."
              : `Managing ${currentOrg?.name} • Oversee profiles, branches, candidates, and community updates.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isRegisterMode && (
            <>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="text-xs px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none"
              >
                {(orgs || []).map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>

              <button
                onClick={() => onViewLiveProfile && onViewLiveProfile(currentOrg.id)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                <span>Live Page</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shrink-0 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>{isRegisterMode ? "Back to Dashboard" : "+ Register New Organization"}</span>
          </button>
        </div>
      </div>

      {/* Organization KPI Summary Badges */}
      {!isRegisterMode && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="clean-card p-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Chartered Branches</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">{orgChapters.length} Active</span>
          </div>
          <div className="clean-card p-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Registered Members</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">{orgMembers.length} Volunteers</span>
          </div>
          <div className="clean-card p-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Branch Applicants</span>
            <span className="text-xl font-black text-blue-800 mt-1 block">{orgBranchApplicants.length} In Review</span>
          </div>
          <div className="clean-card p-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Position Applicants</span>
            <span className="text-xl font-black text-purple-800 mt-1 block">{orgPositionApplicants.length} Candidates</span>
          </div>
        </div>
      )}

      {/* Sleek Horizontal Tab Navigation Bar */}
      {!isRegisterMode && (
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            
            {/* 1. Organization Profile */}
            <button
              type="button"
              onClick={() => setActiveSubTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Organization Profile</span>
            </button>

            {/* 2. Community Updates */}
            <button
              type="button"
              onClick={() => setActiveSubTab('posts')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'posts'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Updates & News</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeSubTab === 'posts' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {orgPosts.length}
              </span>
            </button>

            {/* 3. Chartered Branches */}
            <button
              type="button"
              onClick={() => setActiveSubTab('branches')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'branches'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Chartered Branches</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeSubTab === 'branches' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {orgChapters.length}
              </span>
            </button>

            {/* 4. Branch Applications & Questions */}
            <button
              type="button"
              onClick={() => setActiveSubTab('branch_apps')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'branch_apps'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Branch Applications & Questions</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeSubTab === 'branch_apps' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-800'
              }`}>
                {orgBranchApplicants.length}
              </span>
            </button>

            {/* 5. Chapter Membership & Signups */}
            <button
              type="button"
              onClick={() => setActiveSubTab('members')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'members'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Chapter Membership & Signups</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeSubTab === 'members' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-800'
              }`}>
                {orgMembers.length}
              </span>
            </button>

            {/* 6. Open Positions & Role Questions */}
            <button
              type="button"
              onClick={() => setActiveSubTab('openings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'openings'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Open Positions & Role Questions</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeSubTab === 'openings' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {orgOpportunities.length}
              </span>
            </button>

            {/* 7. Positions Applicants CRM */}
            <button
              type="button"
              onClick={() => setActiveSubTab('position_crm')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'position_crm'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Position Applicants CRM</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeSubTab === 'position_crm' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-800'
              }`}>
                {orgPositionApplicants.length}
              </span>
            </button>

            {/* 8. Verification & Credentials */}
            <button
              type="button"
              onClick={() => setActiveSubTab('verification')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'verification'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verification</span>
            </button>

          </div>
        </div>
      )}

      {/* TAB 1: Organization Profile & Identity */}
      {(activeSubTab === 'profile' || isRegisterMode) && (
        <form onSubmit={handleSaveSubmit} className="space-y-6">
          <div className="clean-card p-6 sm:p-8 space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Organization Profile & Brand Identity</h3>
                <p className="text-slate-500 text-[11px]">Manage public showcase details, logo, banner, and social channels.</p>
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile Saved Successfully</span>
                </div>
              )}
            </div>

            {/* Visual Brand Assets: Logo & Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Organization Square Logo</span>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-[11px] flex items-center gap-1 shadow-2xs"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Logo</span>
                  </button>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={(e) => handleFileUpload(e, 'logo')}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-7 h-7 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Or paste image URL"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Hero Banner Background</span>
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-[11px] flex items-center gap-1 shadow-2xs"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Banner</span>
                  </button>
                  <input
                    type="file"
                    ref={bannerInputRef}
                    onChange={(e) => handleFileUpload(e, 'banner')}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 rounded-2xl bg-slate-200 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                    <img src={formData.image} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    placeholder="Or paste banner image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Core Organization Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. EcoRoots National"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Impact Sector</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="Environment & Climate">Environment & Climate</option>
                  <option value="Education & Youth">Education & Youth</option>
                  <option value="Technology & Coding">Technology & Coding</option>
                  <option value="Mental Health & Wellness">Mental Health & Wellness</option>
                  <option value="Food Security & Hunger">Food Security & Hunger</option>
                  <option value="Healthcare & Medicine">Healthcare & Medicine</option>
                  <option value="Civic Engagement & Policy">Civic Engagement & Policy</option>
                  <option value="Animal Welfare & Rescue">Animal Welfare & Rescue</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tagline / Mission Summary *</label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Empowering youth to restore urban ecosystems"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headquarters Location</label>
                <input
                  type="text"
                  value={formData.headquarters}
                  onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                  placeholder="e.g. Austin, TX"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Organization Overview & Story</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Explain the background of your non-profit, key programs, and how local student chapters make an impact..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
              />
            </div>

            {/* Official Links & Social Media */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="font-bold text-slate-800 text-xs block">Contact Information & Web Presence</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Official Contact Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="contact@yourorg.org"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Website URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourorg.org"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Social Channels: Instagram, Twitter/X, TikTok */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram (Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.instagram || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socials: { ...(prev.socials || {}), instagram: e.target.value }
                    }))}
                    placeholder="https://instagram.com/yourhandle"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <Twitter className="w-3.5 h-3.5 text-sky-500" />
                    <span>Twitter / X (Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.twitter || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socials: { ...(prev.socials || {}), twitter: e.target.value }
                    }))}
                    placeholder="https://x.com/yourhandle"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-700" />
                    <span>TikTok (Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.tiktok || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socials: { ...(prev.socials || {}), tiktok: e.target.value }
                    }))}
                    placeholder="https://tiktok.com/@yourhandle"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Changes update your live public profile immediately.</span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Organization Profile</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: Community Updates & News */}
      {activeSubTab === 'posts' && !isRegisterMode && (
        <div className="space-y-6">
          <form onSubmit={handleCreatePost} className="clean-card p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Broadcast a Community Announcement</span>
            </h3>

            <div>
              <input
                type="text"
                required
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Announcement Title (e.g. 5 New Chapters Launched in Texas!)"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <textarea
                rows={3}
                required
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share stories from the ground, meeting highlights, milestone accomplishments, or upcoming events..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => postImageInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-[11px] flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>{newPostImage ? "Change Image" : "Attach Image"}</span>
                </button>
                <input
                  type="file"
                  ref={postImageInputRef}
                  onChange={(e) => handleFileUpload(e, 'post')}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Update</span>
              </button>
            </div>
          </form>

          {/* Updates Feed */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Live Organization Feed ({orgPosts.length})</h3>
            {orgPosts.length === 0 ? (
              <div className="clean-card p-12 text-center text-slate-500 text-xs">
                No community updates published yet. Post your first story above.
              </div>
            ) : (
              orgPosts.map((post) => (
                <div key={post.id} className="clean-card p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{post.title}</h4>
                    <span className="text-[11px] text-slate-400">
                      {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{post.content}</p>
                  {post.image && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 max-h-64">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Chartered Branches */}
      {activeSubTab === 'branches' && !isRegisterMode && (
        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Active Chartered Branches & Chapters ({orgChapters.length})</h3>
              <p className="text-slate-500 text-[11px]">Manage local branch directors, member counts, and chapter information.</p>
            </div>

            <button
              onClick={handleOpenCharterNewBranch}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Charter New Branch</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orgChapters.length === 0 ? (
              <div className="clean-card p-12 text-center text-slate-500 md:col-span-2">
                No active branches chartered yet. Click "+ Charter New Branch" above or approve applicants from Branch Applications.
              </div>
            ) : (
              orgChapters.map(chap => (
                <div key={chap.id} className="clean-card p-5 text-xs flex flex-col justify-between space-y-4 group hover:border-slate-300 transition-all">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 uppercase tracking-wider inline-block mb-1">
                          {chap.status || 'Active Chapter'}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{chap.name}</h4>
                        <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{chap.institution || chap.location}</span>
                        </p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-700 text-[11px]">
                        {chap.activeMembers || 15} Volunteers
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div><strong className="text-slate-800">Chapter Lead:</strong> {chap.leadName} ({chap.leadEmail})</div>
                      <div><strong className="text-slate-800">Schedule:</strong> {chap.meetingSchedule || 'Bi-weekly'}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditBranch(chap)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-[11px] flex items-center gap-1 shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Chapter</span>
                    </button>

                    <button
                      onClick={() => handleDeleteBranchSubmit(chap.id)}
                      className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold flex items-center gap-1 px-2 py-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Branch Applications & Setup */}
      {activeSubTab === 'branch_apps' && !isRegisterMode && (
        <div className="space-y-6 text-xs">
          
          {/* Branch Application Screening Questions Setup */}
          <div className="clean-card p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Branch Founding Application & Screening Setup</h3>
                <p className="text-slate-500 text-[11px]">
                  Customize the screening questions and external link for changemakers applying to establish a new chapter.
                </p>
              </div>

              <button
                onClick={handleSaveSubmit}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs self-start sm:self-auto"
              >
                Save Branch Questions
              </button>
            </div>

            {/* External Portal Option */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>External Branch Application Link (Optional)</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                If your organization uses a custom website portal or Typeform for branch founders, paste it here.
              </p>
              <input
                type="url"
                value={formData.externalApplyUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, externalApplyUrl: e.target.value }))}
                placeholder="https://yourorg.org/apply-chapter"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none text-xs text-slate-900"
              />
            </div>

            {/* In-App Branch Questions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-xs block">
                    Custom Branch Founding Questions ({(formData.customQuestions || []).length})
                  </span>
                  <p className="text-slate-500 text-[11px]">Presented to changemakers applying to start a branch.</p>
                </div>

                <button
                  type="button"
                  onClick={addCustomQuestion}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px]"
                >
                  + Add Question
                </button>
              </div>

              {(formData.customQuestions || []).map((q, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 w-6">#{idx + 1}</span>
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => updateCustomQuestion(idx, e.target.value)}
                    placeholder="Enter custom branch founding screening question..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeCustomQuestion(idx)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Branch Applicants CRM Kanban Pipeline */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Branch Founding Applicants Pipeline ({orgBranchApplicants.length})</h3>
              <p className="text-slate-500 text-xs">Review candidate dossiers, inspect screening answers, and charter new branches upon approval.</p>
            </div>
            <KanbanBoard 
              applications={orgBranchApplicants} 
              onUpdateStatus={onUpdateStatus} 
            />
          </div>

        </div>
      )}

      {/* TAB 5: Chapter Membership & Signups */}
      {activeSubTab === 'members' && !isRegisterMode && (
        <div className="space-y-6 text-xs">
          
          {/* Customizable Membership Settings */}
          <div className="clean-card p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Chapter Membership Application Setup</h3>
                <p className="text-slate-500 text-[11px]">
                  Customize screening questions, available committee tracks, and requirements for volunteers joining local chapters.
                </p>
              </div>

              <button
                onClick={handleSaveSubmit}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs self-start sm:self-auto"
              >
                Save Membership Setup
              </button>
            </div>

            {/* Membership Onboarding & Approval Mode */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
              <div>
                <span className="font-bold text-slate-800 text-xs block">
                  Membership Onboarding & Approval Mode
                </span>
                <p className="text-slate-500 text-[11px]">
                  Choose whether new volunteers are confirmed immediately or require screening review by branch directors.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setFormData(prev => ({ ...prev, membershipApprovalMode: 'auto' }))}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    (formData.membershipApprovalMode || 'auto') === 'auto'
                      ? 'border-blue-600 bg-white shadow-xs'
                      : 'border-slate-200 bg-white/60 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">Automatic Instant Confirmation</span>
                      {(formData.membershipApprovalMode || 'auto') === 'auto' && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Volunteers are instantly confirmed upon signup, headcount updates immediately, and they can participate in chapter events right away.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setFormData(prev => ({ ...prev, membershipApprovalMode: 'review' }))}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    formData.membershipApprovalMode === 'review'
                      ? 'border-blue-600 bg-white shadow-xs'
                      : 'border-slate-200 bg-white/60 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">Requires Application & Review</span>
                      {formData.membershipApprovalMode === 'review' && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Volunteers submit an application to the CRM pipeline. Leadership reviews answers and approves members before they become active.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* External Portal Option */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>External Member Signup Link (Optional)</span>
              </div>
              <input
                type="url"
                value={formData.externalMembershipUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, externalMembershipUrl: e.target.value }))}
                placeholder="https://yourorg.org/join-chapter"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none text-xs text-slate-900"
              />
            </div>

            {/* Committee Tracks */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-xs block">
                    Available Chapter Committees ({(formData.membershipCommittees || []).length})
                  </span>
                  <p className="text-slate-500 text-[11px]">Tracks volunteers choose from when joining a chapter.</p>
                </div>

                <button
                  type="button"
                  onClick={addMembershipCommittee}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px]"
                >
                  + Add Committee
                </button>
              </div>

              {(formData.membershipCommittees || []).map((comm, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 w-6">#{idx + 1}</span>
                  <input
                    type="text"
                    value={comm}
                    onChange={(e) => updateMembershipCommittee(idx, e.target.value)}
                    placeholder="e.g. Event Organizing, Campus Outreach, Marketing..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => removeMembershipCommittee(idx)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Membership Questions */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-xs block">
                    Custom Member Screening Questions ({(formData.membershipQuestions || []).length})
                  </span>
                  <p className="text-slate-500 text-[11px]">Asked when volunteers click 'Join Local Branch'.</p>
                </div>

                <button
                  type="button"
                  onClick={addMembershipQuestion}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px]"
                >
                  + Add Question
                </button>
              </div>

              {(formData.membershipQuestions || []).map((q, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 w-6">#{idx + 1}</span>
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => updateMembershipQuestion(idx, e.target.value)}
                    placeholder="Enter custom membership question..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeMembershipQuestion(idx)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Members Pipeline & Roster Views */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {memberViewMode === 'pipeline' ? 'Chapter Member Onboarding Pipeline' : 'Local Chapter Volunteer Roster'} ({orgMembers.length})
                </h3>
                <p className="text-slate-500 text-[11px]">
                  {memberViewMode === 'pipeline' 
                    ? 'Track member progression through onboarding, committee assignment, and active status.' 
                    : 'Search and communicate directly with registered volunteers across all local branches.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setMemberViewMode('pipeline')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                      memberViewMode === 'pipeline'
                        ? 'bg-white text-blue-800 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pipeline Board
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberViewMode('roster')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                      memberViewMode === 'roster'
                        ? 'bg-white text-blue-800 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Roster Table
                  </button>
                </div>

                <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 font-bold text-[11px] border border-blue-200">
                  {orgMembers.length} Volunteers
                </span>
              </div>
            </div>

            {/* Pipeline View (Kanban) */}
            {memberViewMode === 'pipeline' && (
              <KanbanBoard
                applications={orgMembers}
                onUpdateStatus={onUpdateStatus}
                customColumns={[
                  { id: 'submitted', title: 'New Signups', countColor: 'bg-blue-100 text-blue-800' },
                  { id: 'screening', title: 'Welcome & Intro', countColor: 'bg-amber-100 text-amber-800' },
                  { id: 'interview', title: 'Committee Assigned', countColor: 'bg-purple-100 text-purple-800' },
                  { id: 'approved', title: 'Active Volunteer', countColor: 'bg-blue-100 text-blue-800' }
                ]}
              />
            )}

            {/* Roster Table View */}
            {memberViewMode === 'roster' && (
              <div className="clean-card overflow-hidden">
                {orgMembers.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 space-y-2">
                    <Users className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-semibold text-slate-700">No local branch signups yet</p>
                    <p className="text-xs text-slate-400">When community members click 'Join Local Branch', their details appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left divide-y divide-slate-100">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="p-3.5 pl-5">Member Name</th>
                          <th className="p-3.5">Email</th>
                          <th className="p-3.5">City / Campus Location</th>
                          <th className="p-3.5">Committee Track</th>
                          <th className="p-3.5">Weekly Hours</th>
                          <th className="p-3.5">Date Joined</th>
                          <th className="p-3.5 pr-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                        {orgMembers.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3.5 pl-5 font-bold text-slate-900">{m.applicantName}</td>
                            <td className="p-3.5 text-slate-600">
                              <a href={`mailto:${m.applicantEmail}`} className="text-blue-700 hover:underline">{m.applicantEmail}</a>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-800 text-[11px] flex items-center gap-1 w-fit">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{m.proposedLocation || 'Local Chapter'}</span>
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-800 font-semibold">{m.committee || m.focusArea || 'General Volunteer'}</td>
                            <td className="p-3.5 text-slate-500">{m.commitment || '1-2 hrs/wk'}</td>
                            <td className="p-3.5 text-slate-400 text-[11px]">{m.appliedAt ? new Date(m.appliedAt).toLocaleDateString() : 'Recent'}</td>
                            <td className="p-3.5 pr-5 text-right">
                              <a
                                href={`mailto:${m.applicantEmail}?subject=Welcome to ${formData.name} Local Chapter!`}
                                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 font-bold text-[11px] hover:bg-blue-100 border border-blue-200 transition-colors inline-block"
                              >
                                Email Member
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 6: Open Positions & Role Specific Questions */}
      {activeSubTab === 'openings' && !isRegisterMode && (
        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Open Positions & Campaigns ({orgOpportunities.length})</h3>
              <p className="text-slate-500 text-[11px]">
                Create new roles and customize specific application screening questions for each position.
              </p>
            </div>

            <button
              onClick={openCreateCampaignModal}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Post New Position or Branch</span>
            </button>
          </div>

          <div className="space-y-3">
            {orgOpportunities.length === 0 ? (
              <div className="clean-card p-12 text-center text-slate-500">
                No active openings posted yet. Click "+ Post New Position or Branch" above to publish your first campaign.
              </div>
            ) : (
              orgOpportunities.map(opp => (
                <div key={opp.id} className="clean-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-slate-300 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                        {opp.type}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-500">{opp.category}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{opp.targetLocation}</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{opp.title}</h4>
                    <p className="text-slate-600 line-clamp-1">{opp.description}</p>
                    
                    {opp.customQuestions && opp.customQuestions.length > 0 && (
                      <div className="pt-1 text-[11px] text-blue-800 font-medium">
                        {opp.customQuestions.length} custom role-specific questions configured
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditOpp(opp)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1 shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Role & Specific Questions</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm("Remove this opening?")) {
                          onDeleteOpportunity(opp.id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 7: Position Applicants CRM */}
      {activeSubTab === 'position_crm' && !isRegisterMode && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Position Applicants Pipeline ({orgPositionApplicants.length})</h3>
            <p className="text-slate-500 text-xs">
              Review candidates applying for specialized volunteer and staff roles, inspect their role-specific answers, and advance statuses.
            </p>
          </div>
          <KanbanBoard 
            applications={orgPositionApplicants} 
            onUpdateStatus={onUpdateStatus} 
          />
        </div>
      )}

      {/* TAB 8: Verification & Credentials */}
      {activeSubTab === 'verification' && !isRegisterMode && (
        <div className="clean-card p-6 sm:p-8 space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900">Non-Profit & Student Club Verification Credentials</h3>
            <p className="text-slate-500 text-[11px]">Verify your 501(c)(3) tax ID, campus registry, or state non-profit status.</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-bold text-slate-900">Official Verification Status</h4>
                <p className="text-slate-600 text-[11px]">Displays verified badge on organization profile and branch cards.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-[11px]">
              {formData.verification?.status || 'Verified Official'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Registration / Tax ID (EIN)</label>
              <input
                type="text"
                value={formData.verification?.ein || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  verification: { ...(prev.verification || {}), ein: e.target.value }
                }))}
                placeholder="e.g. 84-1928472 or Campus Registry #"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Registry Document / Verification Link</label>
              <input
                type="text"
                value={formData.verification?.registryDoc || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  verification: { ...(prev.verification || {}), registryDoc: e.target.value }
                }))}
                placeholder="e.g. IRS 501(c)(3) Letter or Student Club Registry Link"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveSubmit}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Update Credentials
            </button>
          </div>
        </div>
      )}

      {/* Edit Role Specific Questions Modal */}
      {editingOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 shadow-2xl overflow-hidden text-xs flex flex-col max-h-[88vh]">
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[10px] uppercase">
                  Role-Specific Question Setup
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{oppFormData.title}</h3>
                <p className="text-slate-500 text-[11px]">Configure screening questions specific to this opening.</p>
              </div>

              <button onClick={() => setEditingOpp(null)} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOppSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={oppFormData.title}
                  onChange={(e) => setOppFormData({ ...oppFormData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Location</label>
                  <input
                    type="text"
                    value={oppFormData.targetLocation}
                    onChange={(e) => setOppFormData({ ...oppFormData, targetLocation: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Commitment</label>
                  <input
                    type="text"
                    value={oppFormData.commitment}
                    onChange={(e) => setOppFormData({ ...oppFormData, commitment: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role Description</label>
                <textarea
                  rows={3}
                  value={oppFormData.description}
                  onChange={(e) => setOppFormData({ ...oppFormData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                />
              </div>

              {/* Role-Specific Screening Questions */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">
                      Specific Questions for this Role ({(oppFormData.customQuestions || []).length})
                    </span>
                    <p className="text-slate-500 text-[11px]">These questions will be asked when candidates apply for this role.</p>
                  </div>

                  <button
                    type="button"
                    onClick={addOppQuestion}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px]"
                  >
                    + Add Question
                  </button>
                </div>

                {(oppFormData.customQuestions || []).map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-bold text-slate-400 w-6">#{idx + 1}</span>
                    <input
                      type="text"
                      value={q}
                      onChange={(e) => updateOppQuestion(idx, e.target.value)}
                      placeholder="Enter specific question for this role..."
                      className="flex-1 p-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeOppQuestion(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingOpp(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-2xs"
                >
                  Save Role Questions & Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Chartered Branch Modal */}
      {(editingChapter || isCharteringNewBranch) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 shadow-2xl overflow-hidden text-xs flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {isCharteringNewBranch ? 'Charter New Chapter' : `Edit ${editingChapter?.name}`}
                </h3>
                <p className="text-slate-500 text-[11px]">Set branch name, university campus/city, and chapter lead.</p>
              </div>
              <button onClick={() => { setEditingChapter(null); setIsCharteringNewBranch(false); }} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBranchFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branch / Chapter Name *</label>
                <input
                  type="text"
                  required
                  value={branchFormData.name}
                  onChange={(e) => setBranchFormData({ ...branchFormData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Metro / City Location</label>
                  <input
                    type="text"
                    value={branchFormData.location}
                    onChange={(e) => setBranchFormData({ ...branchFormData, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Campus / Host Institution</label>
                  <input
                    type="text"
                    value={branchFormData.institution}
                    onChange={(e) => setBranchFormData({ ...branchFormData, institution: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chapter Director Name</label>
                  <input
                    type="text"
                    value={branchFormData.leadName}
                    onChange={(e) => setBranchFormData({ ...branchFormData, leadName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Director Email</label>
                  <input
                    type="email"
                    value={branchFormData.leadEmail}
                    onChange={(e) => setBranchFormData({ ...branchFormData, leadEmail: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setEditingChapter(null); setIsCharteringNewBranch(false); }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-2xs"
                >
                  {isCharteringNewBranch ? 'Charter Branch' : 'Save Branch Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
