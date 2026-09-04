import React, { useState, useEffect } from 'react';
import { Building2, Instagram } from 'lucide-react';
import { api } from './services/api';
import Navbar from './components/Navbar';
import GoalDrawer from './components/GoalDrawer';
import AuthModal from './components/AuthModal';
import DiagnosticModal from './components/DiagnosticModal';
import BranchDetailModal from './components/BranchDetailModal';
import Toast from './components/Toast';
import ApplyModal from './components/ApplyModal';
import CreateCampaignModal from './components/CreateCampaignModal';
import JoinBranchModal from './components/JoinBranchModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsOfServiceModal from './components/TermsOfServiceModal';
import AboutSwiftKlixModal from './components/AboutSwiftKlixModal';
import UserProfileModal from './components/UserProfileModal';

import ExplorePage from './pages/ExplorePage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import PositionsPage from './pages/PositionsPage';
import MyOrgPage from './pages/MyOrgPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import OrgDetailPage from './pages/OrgDetailPage';
import AdminReviewPage from './pages/AdminReviewPage';

export default function App() {
 const [currentTab, setCurrentTab] = useState('explore');
 const [currentGoal, setCurrentGoal] = useState('browse');
 const [selectedOrgId, setSelectedOrgId] = useState(null);
 const [selectedBranch, setSelectedBranch] = useState(null);
 const [initialLocationFilter, setInitialLocationFilter] = useState('');

 // User Auth State
 const [user, setUser] = useState(() => {
  try {
   const saved = localStorage.getItem('SwiftKlix_user');
   return saved ? JSON.parse(saved) : null;
  } catch (e) {
   return null;
  }
 });
 const [isAuthOpen, setIsAuthOpen] = useState(false);

 const isPlatformAdmin = user && (
  user.email?.toLowerCase().includes('swiftklix') || 
  user.email?.toLowerCase() === 'swiftklix1@gmail.com' || 
  user.role === 'admin' || 
  user.accountType === 'admin'
 );

 // Diagnostic / Match State (1-100% Score)
 const [diagnosticPrefs, setDiagnosticPrefs] = useState(() => {
  const saved = localStorage.getItem('SwiftKlix_diagnostic');
  return saved ? JSON.parse(saved) : null;
 });
 const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

 const [stats, setStats] = useState(null);
 const [orgs, setOrgs] = useState([]);
 const [allOrgs, setAllOrgs] = useState([]);
 const [opportunities, setOpportunities] = useState([]);
 const [applications, setApplications] = useState([]);
 const [chapters, setChapters] = useState([]);

 const [toast, setToast] = useState(null);

 // Modals & Drawer State
 const [isGoalDrawerOpen, setIsGoalDrawerOpen] = useState(false);
 const [applyOpportunity, setApplyOpportunity] = useState(null);
 const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
 const [isAboutSwiftKlixOpen, setIsAboutSwiftKlixOpen] = useState(false);
 const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
 const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
 const [isTermsOpen, setIsTermsOpen] = useState(false);
 const [joinBranchTarget, setJoinBranchTarget] = useState(null);
 const [pendingAction, setPendingAction] = useState(null);

 useEffect(() => {
  loadAllData();
 }, []);

 const loadAllData = async () => {
  try {
   const [s, o, allO, opp, a, ch] = await Promise.all([
    api.getStats(),
    api.getOrgs(false),
    api.getOrgs(true),
    api.getOpportunities(),
    api.getApplications(),
    api.getChapters()
   ]);
   setStats(s);
   setOrgs(o);
   setAllOrgs(allO);
   setOpportunities(opp);
   setApplications(a);
   setChapters(ch);
  } catch (err) {
   console.error('Error loading data:', err);
  }
 };

 const pendingOrgsCount = (allOrgs || []).filter(o => 
  o?.approvalStatus === 'pending' || 
  (!o?.approvalStatus && o?.status === 'Pending Review') ||
  (!o?.isApproved && o?.status !== 'Rejected' && !o?.status?.includes('Verified'))
 ).length;

 const handleLogin = (userData) => {
  setUser(userData);
  localStorage.setItem('SwiftKlix_user', JSON.stringify(userData));
  setToast({ type: 'success', title: 'Signed In', message: `Welcome, ${userData.name}!` });

  // Resume pending user action if any
  if (pendingAction) {
    if (pendingAction.type === 'apply') {
      setApplyOpportunity(pendingAction.data);
    } else if (pendingAction.type === 'join') {
      setSelectedBranch(null);
      setJoinBranchTarget(pendingAction.data);
    } else if (pendingAction.type === 'quiz') {
      setIsDiagnosticOpen(true);
    } else if (pendingAction.type === 'tab') {
      setCurrentTab(pendingAction.data);
      setSelectedOrgId(null);
    } else if (pendingAction.type === 'create_campaign') {
      setIsCreateCampaignOpen(true);
    }
    setPendingAction(null);
  }
 };

 const handleLogout = () => {
  setUser(null);
  localStorage.removeItem('SwiftKlix_user');
  setToast({ type: 'info', title: 'Signed Out', message: 'You have been signed out.' });
 };

 const handleSaveUserProfile = (updatedProfile) => {
  setUser(updatedProfile);
  localStorage.setItem('SwiftKlix_user', JSON.stringify(updatedProfile));
  setToast({ type: 'success', title: 'Profile Updated', message: 'Your Changemaker profile has been saved.' });
 };

 const handleSaveDiagnostic = (prefs) => {
  setDiagnosticPrefs(prefs);
  localStorage.setItem('SwiftKlix_diagnostic', JSON.stringify(prefs));
  setIsDiagnosticOpen(false);
  setToast({ type: 'success', title: 'Match Scores Applied', message: 'Personalized match scores calculated across all organizations & positions!' });
 };
 const handleSavePreferences = handleSaveDiagnostic;

 const handleSelectGoal = (goalId, targetTab) => {
  setCurrentGoal(goalId);
  if ((targetTab === 'hq_dashboard' || targetTab === 'my_org' || targetTab === 'applications') && !user) {
    setPendingAction({ type: 'tab', data: targetTab === 'hq_dashboard' ? 'my_org' : targetTab });
    setIsAuthOpen(true);
    setToast({ type: 'info', title: 'Sign In Required', message: 'Please log in to access this section.' });
    return;
  }
  setCurrentTab(targetTab === 'hq_dashboard' ? 'my_org' : targetTab);
  setSelectedOrgId(null);
 };

  const handleSubmitApplication = async (appData) => {
    try {
      const newApp = await api.createApplication({
        ...appData,
        applicantName: appData.applicantName || user?.name || 'Applicant',
        applicantEmail: appData.applicantEmail || user?.email || 'applicant@example.com'
      });
      setApplications(prev => [newApp, ...(prev || [])]);
      await loadAllData();
      setToast({ type: 'success', title: 'Application Sent', message: 'Your application has been received and saved to your dashboard.' });
    } catch (e) {
      console.error(e);
      const fallbackApp = {
        id: `app-${Date.now()}`,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        ...appData,
        applicantName: appData.applicantName || user?.name || 'Applicant',
        applicantEmail: appData.applicantEmail || user?.email || 'applicant@example.com'
      };
      setApplications(prev => [fallbackApp, ...(prev || [])]);
      setToast({ type: 'success', title: 'Application Sent', message: 'Your application has been saved to your dashboard.' });
    }
  };

 const handleResumeDraft = (draftData) => {
  const opp = opportunities.find(o => o.id === draftData.opportunityId) || {
   id: draftData.opportunityId,
   orgId: draftData.orgId,
   orgName: draftData.orgName,
   title: draftData.title,
   focusArea: draftData.focusArea,
   targetLocation: draftData.targetLocation
  };
  setApplyOpportunity(opp);
 };


  const handleApply = (opp) => {
    if (!user) {
      setPendingAction({ type: 'apply', data: opp });
      setIsAuthOpen(true);
      setToast({ type: 'info', title: 'Sign In Required', message: 'Please sign in with Google or your email to apply for a branch or role.' });
      return;
    }
    setApplyOpportunity(opp);
  };

  const handleOpenJoinBranch = (branch) => {
    if (!user) {
      setPendingAction({ type: 'join', data: branch });
      setIsAuthOpen(true);
      setToast({ type: 'info', title: 'Sign In Required', message: 'Please sign in with Google or your email to join a chapter.' });
      return;
    }
    setSelectedBranch(null);
    setJoinBranchTarget(branch);
  };

  const handleOpenDiagnostic = () => {
    if (!user) {
      setPendingAction({ type: 'quiz' });
      setIsAuthOpen(true);
      setToast({ type: 'info', title: 'Sign In Required', message: 'Please sign in with Google or your email to take the match quiz.' });
      return;
    }
    setIsDiagnosticOpen(true);
  };

  const handleSelectTab = (t) => {
    if ((t === 'applications' || t === 'my_applications' || t === 'my_dashboard' || t === 'my_org' || t === 'hq_dashboard') && !user) {
      setPendingAction({ type: 'tab', data: t });
      setIsAuthOpen(true);
      setToast({ type: 'info', title: 'Sign In Required', message: 'Please sign in with Google or your email to access your dashboard.' });
      return;
    }
    setCurrentTab(t);
    setSelectedOrgId(null);
  };

  const handleJoinMembershipSuccess = async (membershipData, branch) => {
    try {
      const isAutoApproved = membershipData.status === 'approved';
      const newApp = await api.createApplication(membershipData);
      setApplications(prev => [newApp, ...prev]);
      
      if (isAutoApproved) {
        if (branch?.id) {
          const updated = await api.updateChapter(branch.id, {
            activeMembers: (branch.activeMembers || 15) + 1
          });
          setChapters(prev => prev.map(c => c.id === branch.id ? updated : c));
        }
        await loadAllData();
        setToast({
          type: 'success',
          title: 'Membership Confirmed',
          message: `Welcome! You have successfully joined ${branch?.name || 'the chapter'}.`
        });
      } else {
        setToast({
          type: 'info',
          title: 'Application Submitted',
          message: `Your membership application for ${branch?.name || 'the chapter'} is submitted for review.`
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinBranch = (branch) => {
    handleOpenJoinBranch(branch);
  };

  const handleUpdateStatus = async (appId, newStatus, notes) => {
    setApplications(prev => (prev || []).map(a => String(a.id) === String(appId) ? { ...a, status: newStatus, notes: notes !== undefined ? notes : a.notes } : a));
    try {
      const updated = await api.updateApplicationStatus(appId, newStatus, notes);
      if (updated) {
        setApplications(prev => (prev || []).map(a => String(a.id) === String(appId) ? updated : a));
      }
      const [freshApps, freshChapters, freshStats] = await Promise.all([
        api.getApplications(),
        api.getChapters(),
        api.getStats()
      ]);
      if (freshApps && freshApps.length > 0) setApplications(freshApps);
      if (freshChapters && freshChapters.length > 0) setChapters(freshChapters);
      if (freshStats) setStats(freshStats);

      setToast({ 
        type: 'success', 
        title: 'Status Updated', 
        message: `Candidate moved to ${newStatus.toUpperCase()}.` 
      });
    } catch (err) {
      console.error('Failed to update status on server', err);
      setToast({ 
        type: 'success', 
        title: 'Status Updated', 
        message: `Candidate moved to ${newStatus.toUpperCase()}.` 
      });
    }
  };

 const handleUpdateOpportunity = async (oppId, updates) => {
  const updated = await api.updateOpportunity(oppId, updates);
  setOpportunities(prev => prev.map(o => o.id === oppId ? updated : o));
  setToast({ type: 'success', title: 'Position Updated', message: 'Position changes saved.' });
 };

 const handleDeleteOpportunity = async (oppId) => {
  await api.deleteOpportunity(oppId);
  setOpportunities(prev => prev.filter(o => o.id !== oppId));
  setToast({ type: 'info', title: 'Position Deleted', message: 'Position listing removed.' });
 };

 const handleCreateCampaign = async (campaignData) => {
  const newOpp = await api.createOpportunity(campaignData);
  setOpportunities(prev => [newOpp, ...prev]);
  setToast({ type: 'success', title: 'Opening Published', message: 'Your listing is now live.' });
 };

 const handleCreateOrg = async (orgData) => {
  const isAutoApproved = isPlatformAdmin;
  const newOrg = await api.createOrg({
    ...orgData,
    submittedBy: user?.email || orgData.contactEmail || '',
    approvalStatus: isAutoApproved ? 'approved' : 'pending',
    status: isAutoApproved ? 'Verified Official' : 'Pending Review'
  });
  await loadAllData();
  setCurrentTab('my_org');
  if (isAutoApproved) {
    setToast({ type: 'success', title: 'Organization Created', message: 'Your organization is registered and live.' });
  } else {
    setToast({ 
      type: 'success', 
      title: 'Submitted for Review', 
      message: 'Your organization request has been submitted to the SwiftKlix Admin Team for verification and will appear in the directory once approved.' 
    });
  }
 };

 const handleApproveOrg = async (orgId, notes) => {
  try {
    await api.approveOrg(orgId, notes);
    await loadAllData();
    setToast({ type: 'success', title: 'Organization Approved', message: 'Organization is now live and published in the Explore directory!' });
  } catch (e) {
    console.error(e);
    setToast({ type: 'error', title: 'Approval Failed', message: 'Could not approve organization.' });
  }
 };

 const handleRejectOrg = async (orgId, reason) => {
  try {
    await api.rejectOrg(orgId, reason);
    await loadAllData();
    setToast({ type: 'info', title: 'Submission Rejected', message: 'Organization submission marked as rejected.' });
  } catch (e) {
    console.error(e);
    setToast({ type: 'error', title: 'Action Failed', message: 'Could not reject organization.' });
  }
 };

 const handleSaveOrg = async (orgId, orgData) => {
  const updated = await api.updateOrg(orgId, orgData);
  setOrgs(prev => prev.map(o => o.id === orgId ? updated : o));
  setToast({ type: 'success', title: 'Profile Updated', message: 'Organization changes and proof saved.' });
 };

 const handleUpdateChapter = async (chapId, updates) => {
  const updated = await api.updateChapter(chapId, updates);
  setChapters(prev => prev.map(c => c.id === chapId ? updated : c));
  setToast({ type: 'success', title: 'Branch Updated', message: 'Chapter details saved.' });
 };

 const handleCreateChapter = async (chapterData) => {
  const newChap = await api.createChapter(chapterData);
  setChapters(prev => [newChap, ...prev]);
  setToast({ type: 'success', title: 'Branch Chartered', message: 'New local chapter is live.' });
 };

 const handleDeleteChapter = async (chapId) => {
  await api.deleteChapter(chapId);
  setChapters(prev => prev.filter(c => c.id !== chapId));
  setToast({ type: 'info', title: 'Branch Removed', message: 'Chapter has been decommissioned.' });
 };

 // Resolve target organization for applying
 const targetApplyOrg = applyOpportunity ? orgs.find(o => o.id === applyOpportunity.orgId) : null;

 return (
  <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-blue-600 selection:text-white">
   {/* Clean Navbar */}
   <Navbar 
    currentTab={currentTab} 
    setCurrentTab={handleSelectTab} 
    user={user}
    onOpenAuth={() => setIsAuthOpen(true)}
    onLogout={handleLogout}
    openGoalDrawer={() => setIsGoalDrawerOpen(true)}
    onOpenAboutSwiftKlix={() => setIsAboutSwiftKlixOpen(true)}
    onOpenUserProfile={() => setIsUserProfileOpen(true)}
    pendingOrgsCount={pendingOrgsCount}
   />

   {/* Main Content */}
   <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
    {selectedOrgId ? (
     <OrgDetailPage
      org={orgs.find(o => o.id === selectedOrgId)}
      opportunities={opportunities}
      chapters={chapters}
      onBack={() => setSelectedOrgId(null)}
      onApply={handleApply}
      onSelectBranch={(branch) => setSelectedBranch(branch)}
      onJoinBranch={handleOpenJoinBranch}
      diagnosticPrefs={diagnosticPrefs}
     />
    ) : currentTab === 'admin_review' ? (
     <AdminReviewPage
      allOrgs={allOrgs}
      onApproveOrg={handleApproveOrg}
      onRejectOrg={handleRejectOrg}
      onViewOrg={(orgId) => setSelectedOrgId(orgId)}
     />
    ) : currentTab === 'explore' ? (
     <ExplorePage
      orgs={orgs}
      opportunities={opportunities}
      chapters={chapters}
      onApply={handleApply}
      onViewOrg={(orgId) => setSelectedOrgId(orgId)}
      onSelectTab={handleSelectTab}
      openCreateOrgModal={() => handleSelectTab('my_org')}
      diagnosticPrefs={diagnosticPrefs}
      openDiagnosticModal={handleOpenDiagnostic}
     />
    ) : currentTab === 'opportunities' ? (
     <OpportunitiesPage
      opportunities={opportunities}
      orgs={orgs}
      chapters={chapters}
      onApply={handleApply}
      onViewOrg={(orgId) => setSelectedOrgId(orgId)}
      onJoinBranch={handleOpenJoinBranch}
      diagnosticPrefs={diagnosticPrefs}
      openDiagnosticModal={handleOpenDiagnostic}
     />
    ) : currentTab === 'positions' ? (
     <PositionsPage
      opportunities={opportunities}
      orgs={orgs}
      chapters={chapters}
      onApply={handleApply}
      onViewOrg={(orgId) => setSelectedOrgId(orgId)}
      diagnosticPrefs={diagnosticPrefs}
      openDiagnosticModal={handleOpenDiagnostic}
     />
    ) : (currentTab === 'my_org' || currentTab === 'hq_dashboard') ? (
      <MyOrgPage
        orgs={orgs}
        allOrgs={allOrgs}
        user={user}
        opportunities={opportunities}
        applications={applications}
        chapters={chapters}
        onSaveOrg={handleSaveOrg}
        onCreateOrg={handleCreateOrg}
        onUpdateStatus={handleUpdateStatus}
        onUpdateOpportunity={handleUpdateOpportunity}
        onDeleteOpportunity={handleDeleteOpportunity}
        onUpdateChapter={handleUpdateChapter}
        onCreateChapter={handleCreateChapter}
        onDeleteChapter={handleDeleteChapter}
        openCreateCampaignModal={() => {
          if (!user) {
            setPendingAction({ type: 'create_campaign' });
            setIsAuthOpen(true);
            setToast({ type: 'info', title: 'Sign In Required', message: 'Please log in to post a campaign.' });
            return;
          }
          setIsCreateCampaignOpen(true);
        }}
        onViewLiveProfile={(orgId) => setSelectedOrgId(orgId)}
      />
     ) : (
      <MyApplicationsPage
       applications={applications}
       chapters={chapters}
       orgs={orgs}
       opportunities={opportunities}
       user={user}
       onViewOrg={(orgId) => setSelectedOrgId(orgId)}
       onSelectBranch={(branch) => setSelectedBranch(branch)}
       onExploreMore={() => setCurrentTab('explore')}
       onResumeDraft={handleResumeDraft}
      />
    )}
   </main>

   {/* Clean Minimal Footer */}
   <footer className="bg-white border-t border-slate-200 py-10 px-4 mt-16">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
     
     {/* Left: Brand Slogan & Instagram Link */}
     <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
      <div className="flex items-center gap-2">
       <span className="font-display font-bold text-slate-900 text-sm">
        SwiftKlix
       </span>
       <span>-</span>
       <span>Where initiatives take root and expand.</span>
      </div>
      
      <a 
       href="https://www.instagram.com/swiftklix/" 
       target="_blank" 
       rel="noopener noreferrer" 
       className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors shadow-2xs cursor-pointer"
      >
       <Instagram className="w-3.5 h-3.5 text-pink-600" />
       <span>@swiftklix</span>
      </a>
     </div>

     {/* Right: Legal Links */}
     <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
      <span>(c) 2026 SwiftKlix Network</span>
      <button 
       onClick={() => setIsPrivacyPolicyOpen(true)}
       className="text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
      >
       Privacy Policy
      </button>
      <button 
       onClick={() => setIsTermsOpen(true)}
       className="text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
      >
       Terms of Service
      </button>
     </div>
    </div>
   </footer>



   {/* Right-Side Goal / Mode Drawer */}
    <GoalDrawer
     isOpen={isGoalDrawerOpen}
     onClose={() => setIsGoalDrawerOpen(false)}
     currentGoal={currentGoal}
     onSelectGoal={handleSelectGoal}
     openCreateOrgModal={() => setCurrentTab('my_org')}
     openDiagnosticModal={() => setIsDiagnosticOpen(true)}
     preferences={diagnosticPrefs}
     diagnosticPrefs={diagnosticPrefs}
     onSave={handleSavePreferences}
     onSavePreferences={handleSavePreferences}
     onResetAll={() => {
        const defaults = {
          causes: [],
          userLocation: '',
          roleType: 'both',
          availability: 'medium',
          onlyLocal: false,
          completed: false,
          updatedAt: new Date().toISOString()
        };
        handleSaveDiagnostic(defaults);
      }}
    />

    {/* Modals */}
    <AuthModal
     isOpen={isAuthOpen}
     onClose={() => setIsAuthOpen(false)}
     onLogin={handleLogin}
    />

    <DiagnosticModal
     isOpen={isDiagnosticOpen}
     onClose={() => setIsDiagnosticOpen(false)}
     onSave={handleSaveDiagnostic}
     onSavePreferences={handleSaveDiagnostic}
     existingPrefs={diagnosticPrefs}
     currentPreferences={diagnosticPrefs}
     diagnosticPrefs={diagnosticPrefs}
    />

   <BranchDetailModal
    branch={selectedBranch}
    org={orgs.find(o => o.id === selectedBranch?.orgId)}
    onClose={() => setSelectedBranch(null)}
    onJoinBranch={handleJoinBranch}
   />

   <ApplyModal
    opportunity={applyOpportunity}
    org={targetApplyOrg}
    user={user}
    chapters={chapters}
    onJoinBranch={(branch) => {
      setApplyOpportunity(null);
      handleOpenJoinBranch(branch);
    }}
    onClose={() => setApplyOpportunity(null)}
    onSubmitApplication={handleSubmitApplication}
   />

   <JoinBranchModal
    isOpen={Boolean(joinBranchTarget)}
    branch={joinBranchTarget}
    org={orgs.find(o => o.id === joinBranchTarget?.orgId)}
    user={user}
    onClose={() => setJoinBranchTarget(null)}
    onJoinSuccess={handleJoinMembershipSuccess}
   />

   <CreateCampaignModal
    isOpen={isCreateCampaignOpen}
    orgs={orgs}
    onClose={() => setIsCreateCampaignOpen(false)}
    onCreate={handleCreateCampaign}
   />

   {/* What is SwiftKlix Breakdown Modal */}
   <AboutSwiftKlixModal
    isOpen={isAboutSwiftKlixOpen}
    onClose={() => setIsAboutSwiftKlixOpen(false)}
    onExplore={() => { setCurrentTab('explore'); setSelectedOrgId(null); }}
    onOpenOrgHub={() => { setCurrentTab('my_org'); setSelectedOrgId(null); }}
   />

   {/* Member Changemaker Profile Modal */}
   <UserProfileModal
    isOpen={isUserProfileOpen}
    onClose={() => setIsUserProfileOpen(false)}
    user={user}
    onSaveProfile={handleSaveUserProfile}
   />

   {/* Legal Policy Modals */}
   <PrivacyPolicyModal
    isOpen={isPrivacyPolicyOpen}
    onClose={() => setIsPrivacyPolicyOpen(false)}
   />

   <TermsOfServiceModal
    isOpen={isTermsOpen}
    onClose={() => setIsTermsOpen(false)}
   />

   <Toast toast={toast} onClose={() => setToast(null)} />
  </div>
 );
}

