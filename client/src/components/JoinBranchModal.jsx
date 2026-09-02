import React, { useState, useEffect } from 'react';
import { X, Check, CheckCircle2, Users, MapPin, ArrowRight, ExternalLink, HelpCircle, Sparkles, Building2 } from 'lucide-react';
import LocationInput from './LocationInput';

export default function JoinBranchModal({ isOpen, branch, org, user, onClose, onJoinSuccess }) {
  const userEmail = (user?.email || '').toLowerCase().trim();
  const isOwnOrg = Boolean(
    user && (
      (userEmail && org?.submittedBy && userEmail === org.submittedBy.toLowerCase()) ||
      (userEmail && org?.contactEmail && userEmail === org.contactEmail.toLowerCase()) ||
      (userEmail && branch?.leadEmail && userEmail === branch.leadEmail.toLowerCase()) ||
      (org?.adminEmails && Array.isArray(org.adminEmails) && org.adminEmails.some(e => e.toLowerCase() === userEmail)) ||
      (user.id && org?.creatorId && user.id === org.creatorId)
    )
  );

  const isSetupPending = Boolean(
    org && (
      org.applicationSetupComplete === false ||
      (!org.applicationSetupComplete && (!org.membershipQuestions || org.membershipQuestions.length === 0) && (!org.customQuestions || org.customQuestions.length === 0))
    )
  );

  const committees = (org?.membershipCommittees && org.membershipCommittees.length > 0)
    ? org.membershipCommittees
    : ['General Volunteer / Member'];

  const membershipQuestions = (org?.membershipQuestions && Array.isArray(org.membershipQuestions))
    ? org.membershipQuestions
    : [];

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [location, setLocation] = useState(branch?.institution || branch?.location || user?.location || '');
  const [affiliation, setAffiliation] = useState('');
  const [committee, setCommittee] = useState(committees[0] || '');
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
    if (isOwnOrg || isSetupPending) return;

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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wider text-blue-700 uppercase">
                Branch or Chapter Membership
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-semibold text-slate-500">{org?.name || branch?.orgName || 'Organization'}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              {branch ? `Join ${branch.name}` : `Join ${org?.name || 'Organization'} Member Network`}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{branch?.institution || branch?.location || org?.headquarters || 'Local & Remote'}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer">
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
              {org?.membershipApprovalMode === 'review' ? 'Application Submitted!' : 'Welcome to the Chapter!'}
            </h3>
            <p className="text-slate-600 text-xs max-w-xs mx-auto leading-relaxed">
              {org?.membershipApprovalMode === 'review'
                ? `Your membership application for ${branch?.name || 'the chapter'} has been received. Chapter leadership will review your answers.`
                : `You are now registered as an active member in ${branch?.name || 'the chapter'}.`}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : isOwnOrg ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200 shadow-2xs">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-slate-900">
                You Lead {org?.name || 'this Organization'}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                You are registered as the administrator and lead of this organization. You can manage member rosters, charter campus branches, and log events directly from your <strong>Organization Dashboard</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-2xs"
            >
              Close
            </button>
          </div>
        ) : isSetupPending ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-2xs">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-slate-900">
                Volunteer Applications Opening Soon
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                <strong>{org?.name || 'Organization'}</strong> leadership is currently configuring their volunteer committee tracks and screening questions. Public applications will open as soon as setup is published.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-2xs"
            >
              Close
            </button>
          </div>
        ) : (
          <>
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
                    placeholder="City or School Name"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Affiliation / Status</label>
                  <input
                    type="text"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    placeholder="e.g. Student, Resident, Volunteer"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                  />
                </div>
              </div>

              {/* Committee Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Committee Track *</label>
                  <select
                    value={committee}
                    onChange={(e) => setCommittee(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                  >
                    {committees.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
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
                    Chapter Screening Questions
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

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold hover:bg-slate-100 text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="joinBranchForm"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>
                  {isSubmitting 
                    ? 'Submitting...' 
                    : (org?.membershipApprovalMode === 'review' ? 'Submit Membership Application' : 'Confirm Chapter Membership')}
                </span>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
