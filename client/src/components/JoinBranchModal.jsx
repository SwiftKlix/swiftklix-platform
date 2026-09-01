import React, { useState, useEffect } from 'react';
import { X, Check, CheckCircle2, Users, MapPin, ArrowRight, ExternalLink, HelpCircle } from 'lucide-react';
import LocationInput from './LocationInput';

export default function JoinBranchModal({ isOpen, branch, org, user, onClose, onJoinSuccess }) {

  const defaultCommittees = [
    'Event Organizing & Planning',
    'Community Outreach & Partnerships',
    'Marketing & Social Media',
    'Logistics & Operations',
    'General Volunteer & Participant'
  ];

  const committees = (org?.membershipCommittees && org.membershipCommittees.length > 0)
    ? org.membershipCommittees
    : defaultCommittees;

  const membershipQuestions = (org?.membershipQuestions && org.membershipQuestions.length > 0)
    ? org.membershipQuestions
    : [
        'What specific projects or initiatives in our cause area interest you most?',
        'What previous volunteering or campus club experience do you bring?'
      ];

  const requirements = org?.membershipRequirements || 'Open to all enrolled students and local community members.';

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [location, setLocation] = useState(branch?.institution || branch?.location || user?.location || '');
  const [affiliation, setAffiliation] = useState('Student / Local Resident');
  const [committee, setCommittee] = useState(committees[0] || 'Event Organizing & Planning');
  const [hours, setHours] = useState('1-2 hours / week');
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (branch) {
      setLocation(branch.institution || branch.location || '');
    }
  }, [branch]);

  useEffect(() => {
    if (committees && committees.length > 0 && !committees.includes(committee)) {
      setCommittee(committees[0]);
    }
  }, [committees]);

  const handleAnswerChange = (question, value) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isReviewRequired = org?.membershipApprovalMode === 'review';
    const targetStatus = isReviewRequired ? 'submitted' : 'approved';

    const membershipData = {
      orgId: branch?.orgId || org?.id,
      orgName: org?.name || branch?.orgName || 'Organization',
      applicantName: name,
      applicantEmail: email,
      proposedLocation: location || branch?.institution || branch?.location || 'Local Chapter',
      title: `Branch Member - ${branch?.name || 'Chapter'}`,
      type: 'Branch Member',
      chapterId: branch?.id,
      affiliation,
      committee,
      commitment: hours,
      answers,
      status: targetStatus,
      appliedAt: new Date().toISOString()
    };

    if (onJoinSuccess) {
      await onJoinSuccess(membershipData, branch);
    }

    setIsSubmitting(false);
    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      onClose();
    }, 1800);
  };

  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 shadow-2xl overflow-hidden text-xs flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[10px] uppercase">
                Branch or Chapter Membership
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-bold text-slate-700 text-xs">{org?.name || branch?.orgName}</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
              Join {branch?.name || 'Local Chapter'}
            </h2>
            <p className="text-slate-500 mt-0.5 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{branch?.institution || branch?.location || 'Local Campus'}</span>
            </p>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isDone ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {org?.membershipApprovalMode === 'review' ? 'Application Submitted!' : 'Welcome to the Branch or Chapter!'}
            </h3>
            <p className="text-slate-600 text-xs max-w-xs mx-auto">
              {org?.membershipApprovalMode === 'review'
                ? `Your membership application for ${branch?.name || 'the chapter'} has been received. Chapter leadership will review your answers and follow up.`
                : `You are now registered as an active volunteer in ${branch?.name || 'the chapter'}. Chapter leadership will reach out with meeting details.`}
            </p>
          </div>
        ) : (
          <form id="joinBranchForm" onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
            
            {/* Single Compact Notice Pill */}
            <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex items-center justify-between gap-3 text-slate-700">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[11px] leading-tight">
                  Join <strong>{branch?.activeMembers || 15}+ active volunteers</strong> in {branch?.institution || branch?.location || 'your area'}.
                </span>
              </div>
              <span className="text-[10px] text-blue-800 font-bold bg-white px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                Privacy Guaranteed
              </span>
            </div>

            {/* External Portal Option */}
            {org?.externalMembershipUrl && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-slate-900">
                <span className="text-[11px] font-medium">
                  {org?.name} also offers an external membership portal:
                </span>
                <a
                  href={org.externalMembershipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 shrink-0"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                />
              </div>
            </div>

            {/* Location & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your City / Campus *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Austin, TX or Stanford"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Affiliation / Status</label>
                <input
                  type="text"
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  placeholder="e.g. Enrolled Student, Resident"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                />
              </div>
            </div>

            {/* Committee Selection & Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Committee Track *</label>
                <select
                  value={committee}
                  onChange={(e) => setCommittee(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                >
                  {committees.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Weekly Availability</label>
                <select
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                >
                  <option value="1-2 hours / week">1-2 hrs / wk (Meetings & events)</option>
                  <option value="2-4 hours / week">2-4 hrs / wk (Committee lead track)</option>
                  <option value="4+ hours / week">4+ hrs / wk (Core organizer)</option>
                </select>
              </div>
            </div>

            {/* Screening Questions (if customized by org) */}
            {membershipQuestions.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <span className="font-bold text-slate-800 text-[11px] block">
                  Chapter Questions
                </span>

                {membershipQuestions.map((q, idx) => (
                  <div key={idx} className="space-y-1">
                    <label className="block font-medium text-slate-700 text-[11px] leading-tight">
                      {idx + 1}. {q}
                    </label>
                    <textarea
                      rows={2}
                      value={answers[q] || ''}
                      onChange={(e) => handleAnswerChange(q, e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-600 text-xs font-normal"
                    />
                  </div>
                ))}
              </div>
            )}
          </form>
        )}

        {/* Footer Actions */}
        {!isDone && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold hover:bg-slate-100 text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="joinBranchForm"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <span>
                {isSubmitting 
                  ? 'Submitting...' 
                  : (org?.membershipApprovalMode === 'review' ? 'Submit Membership Application' : 'Confirm Chapter Membership')}
              </span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
