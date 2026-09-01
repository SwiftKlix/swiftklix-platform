import React, { useState, useEffect } from 'react';
import { X, Check, Save, Sparkles, MapPin, Briefcase, Globe, ArrowUpRight } from 'lucide-react';
import LocationInput from './LocationInput';

export default function ApplyModal({ opportunity, org, user, chapters, onJoinBranch, onClose, onSubmitApplication }) {
  const isJoinBranch = opportunity?.type === 'Join Branch' || 
                       opportunity?.type === 'Branch Member' || 
                       (opportunity?.title || '').toLowerCase().startsWith('join ');

  const isBranchApplication = !isJoinBranch && (
    opportunity?.type === 'Start a Chapter' || 
    opportunity?.type === 'Branch' || 
    (opportunity?.title || '').toLowerCase().includes('branch') || 
    (opportunity?.title || '').toLowerCase().includes('chapter') || 
    (opportunity?.title || '').toLowerCase().includes('founding')
  );

  const defaultJoinBranchQuestions = [
    "What role or committee are you most interested in joining (e.g. Event Organizer, Marketing & Outreach, Logistics, General Member)?",
    "What relevant skills, campus ties, or community experience do you bring to this chapter?",
    "How many hours per week can you dedicate to chapter meetings and volunteer initiatives?",
    "What motivated you to join this specific local branch?"
  ];

  const defaultBranchQuestions = [
    "Which university campus, school, or metropolitan neighborhood do you plan to establish this branch in?",
    "What is your target timeline for hosting your inaugural chapter kickoff event?",
    "How many founding co-leads or student officers will help you organize the branch?",
    "What local community partners, clubs, or venues do you plan to collaborate with?"
  ];

  const defaultPositionQuestions = [
    "What specific technical or leadership skills qualify you for this role? (Include portfolio, GitHub, or LinkedIn if applicable)",
    "How many weekly hours can you dedicate to team syncs and role deliverables?",
    "Describe a past project or initiative where you executed similar responsibilities.",
    "Why are you interested in joining our team in this specific capacity?"
  ];

  const customQuestions = (opportunity?.customQuestions && Array.isArray(opportunity.customQuestions) && opportunity.customQuestions.length > 0)
    ? opportunity.customQuestions
    : ((org?.customQuestions && Array.isArray(org.customQuestions) && org.customQuestions.length > 0)
      ? org.customQuestions
      : (isJoinBranch ? defaultJoinBranchQuestions : (isBranchApplication ? defaultBranchQuestions : defaultPositionQuestions)));

  const externalUrl = org?.externalApplyUrl || org?.branchApplyUrl || opportunity?.externalApplyUrl || '';

  const [applicantName, setApplicantName] = useState(user?.name || '');
  const [applicantEmail, setApplicantEmail] = useState(user?.email || '');
  const [proposedLocation, setProposedLocation] = useState(opportunity?.targetLocation || '');
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Load existing draft
  useEffect(() => {
    try {
      const savedDrafts = JSON.parse(localStorage.getItem('SwiftKlix_drafts') || '{}');
      if (opportunity && savedDrafts[opportunity.id]) {
        const d = savedDrafts[opportunity.id];
        if (d.applicantName) setApplicantName(d.applicantName);
        if (d.applicantEmail) setApplicantEmail(d.applicantEmail);
        if (d.proposedLocation) setProposedLocation(d.proposedLocation);
        if (d.answers) setAnswers(d.answers);
      } else if (user) {
        if (!applicantName) setApplicantName(user.name);
        if (!applicantEmail) setApplicantEmail(user.email);
      }
    } catch (e) {
      console.error('Error loading draft', e);
    }
  }, [opportunity, user]);

  const handleAnswerChange = (question, val) => {
    setAnswers(prev => ({ ...prev, [question]: val }));
  };

  const existingBranch = (isBranchApplication && proposedLocation && proposedLocation.trim().length > 2)
    ? (chapters || []).find(c => 
        c?.orgId === (opportunity?.orgId || org?.id) && 
        (
          (c?.location && proposedLocation.toLowerCase().includes(c.location.toLowerCase().trim())) ||
          (c?.location && c.location.toLowerCase().includes(proposedLocation.toLowerCase().trim())) ||
          (c?.institution && proposedLocation.toLowerCase().includes(c.institution.toLowerCase().trim())) ||
          (c?.institution && c.institution.toLowerCase().includes(proposedLocation.toLowerCase().trim()))
        )
      )
    : null;

  const handleSaveDraft = () => {
    if (!opportunity) return;
    try {
      const savedDrafts = JSON.parse(localStorage.getItem('SwiftKlix_drafts') || '{}');
      savedDrafts[opportunity.id] = {
        opportunityId: opportunity.id,
        orgId: opportunity.orgId,
        orgName: opportunity.orgName,
        title: opportunity.title,
        type: opportunity.type,
        focusArea: opportunity.focusArea,
        targetLocation: proposedLocation || opportunity.targetLocation,
        applicantName,
        applicantEmail,
        proposedLocation,
        answers,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('SwiftKlix_drafts', JSON.stringify(savedDrafts));
      setDraftSavedToast(true);
      setTimeout(() => setDraftSavedToast(false), 2500);
    } catch (e) {
      console.error('Error saving draft', e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!opportunity) return;
    try {
      const savedDrafts = JSON.parse(localStorage.getItem('SwiftKlix_drafts') || '{}');
      delete savedDrafts[opportunity.id];
      localStorage.setItem('SwiftKlix_drafts', JSON.stringify(savedDrafts));
    } catch (err) {}

    onSubmitApplication({
      orgId: opportunity.orgId || org?.id,
      orgName: opportunity.orgName || org?.name || 'Organization',
      opportunityId: opportunity.id,
      role: opportunity.title,
      title: opportunity.title,
      type: opportunity.type || 'Start a Chapter',
      applicantName,
      applicantEmail,
      proposedLocation: proposedLocation || opportunity.targetLocation || 'Local Campus',
      answers,
      responses: answers
    });

    setIsSubmitted(true);
  };

  if (!opportunity) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <div className="bg-white rounded-3xl w-full max-w-md border border-slate-200 shadow-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Application Submitted!</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your application for <strong>{opportunity.title}</strong> has been sent to {opportunity.orgName}. They will review your answers and contact you at <strong>{applicantEmail}</strong>.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-xl border border-slate-200 shadow-2xl overflow-hidden text-xs max-h-[90vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wider text-blue-700 uppercase">
                {isJoinBranch ? "Local Chapter Membership Application" : (isBranchApplication ? "Chapter Founding Application" : "Role Application")}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-semibold text-slate-500">{opportunity.orgName}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">{opportunity.title}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="applyForm" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 pr-3">
          
          {/* Optional External Website Apply Direct Option */}
          {externalUrl && (
            <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-blue-950">
                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                <span><strong>{org?.name || 'Organization'}</strong> accepts applications on their portal.</span>
              </div>
              <a
                href={externalUrl.startsWith('http') ? externalUrl : `https://${externalUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 text-center justify-center transition-colors shadow-2xs"
              >
                <span>Apply on External Site</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Prerequisites Notice Banner */}
          {opportunity.prerequisites && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Requirements & Prerequisites:
              </span>
              <p className="text-slate-700 font-medium leading-relaxed">
                {opportunity.prerequisites}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Email *</label>
              <input
                type="email"
                required
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <LocationInput
            label={isBranchApplication ? "Target City, Campus, or Community *" : "Your City / Location *"}
            value={proposedLocation}
            onChange={setProposedLocation}
            placeholder="Search any US city, university campus, or town..."
            showPills={true}
          />

          {/* Existing Branch or Chapter Collision Alert */}
          {existingBranch && (
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2.5 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Active Branch or Chapter Already Exists in this Area</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                <strong>{org?.name || opportunity?.orgName || 'This organization'}</strong> already has an active chartered chapter in <strong>{existingBranch.institution || existingBranch.location}</strong> ({existingBranch.name}). You cannot open a duplicate chapter in the same area, but you can join the active branch or chapter as a member or co-lead!
              </p>
              {onJoinBranch && (
                <button
                  type="button"
                  onClick={() => onJoinBranch(existingBranch)}
                  className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <span>Join {existingBranch.name} Instead</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Differentiated Questions List */}
          <div className="space-y-3 pt-2">
            <span className="font-bold text-slate-800 text-xs block border-b border-slate-100 pb-1">
              {isBranchApplication ? "Branch or Chapter Founding Questions" : "Role Competency Questions"}
            </span>

            {(customQuestions || []).map((q, idx) => (
              <div key={idx} className="space-y-1">
                <label className="block font-medium text-slate-700 leading-snug">
                  {idx + 1}. {q}
                </label>
                <textarea
                  rows={2}
                  required
                  value={answers[q] || ''}
                  onChange={(e) => handleAnswerChange(q, e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-400 leading-relaxed font-normal"
                />
              </div>
            ))}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            {draftSavedToast && (
              <span className="text-[11px] font-bold text-blue-700 animate-in fade-in">Draft saved!</span>
            )}
          </div>

          <button
            type="submit"
            form="applyForm"
            disabled={Boolean(existingBranch)}
            className={`px-5 py-2 rounded-xl font-bold text-xs shadow-2xs transition-colors ${
              existingBranch 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {existingBranch 
              ? "Branch Exists in this Area" 
              : (isBranchApplication ? "Submit Branch or Chapter Application" : "Submit Role Application")}
          </button>
        </div>

      </div>
    </div>
  );
}
