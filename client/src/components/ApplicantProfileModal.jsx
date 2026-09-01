import React, { useState } from 'react';
import { 
  X, MapPin, GraduationCap, Briefcase, Award, Linkedin, Globe, 
  ChevronRight, CheckCircle2, MessageSquare, Mail, UserCheck, Sparkles, Phone, Calendar
} from 'lucide-react';

export default function ApplicantProfileModal({ application, isOpen, onClose, onUpdateStatus }) {
  const [noteText, setNoteText] = useState(application?.notes || '');

  const getNextStatus = (current) => {
    if (current === 'submitted') return 'screening';
    if (current === 'screening') return 'interview';
    if (current === 'interview') return 'approved';
    return null;
  };

  const nextStatus = getNextStatus(application?.status);

  const handleAdvance = () => {
    if (nextStatus && application) {
      onUpdateStatus(application.id, nextStatus, noteText);
      onClose();
    }
  };

  const handleSaveNotes = () => {
    if (application) {
      onUpdateStatus(application.id, application.status, noteText);
    }
  };

  const avatar = application?.applicantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  const banner = application?.applicantBanner || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80';
  const headline = application?.applicantHeadline || 'Community Organizer | Campus Chapter Lead & Volunteer Builder';
  const university = application?.applicantUniversity || 'Stanford University';
  const degree = application?.applicantDegree || 'B.S. Public Policy & Environmental Studies';
  const gradYear = application?.applicantGradYear || 'Class of 2026';
  const bio = application?.applicantBio || application?.statement || 'Passionate student organizer dedicated to mobilizing local volunteers, hosting impactful community events, and scaling grassroots non-profit initiatives.';
  const skills = application?.applicantSkills || ['Grassroots Organizing', 'Volunteer Management', 'Event Logistics', 'Public Speaking', 'Social Media Outreach'];

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-slate-200 shadow-2xl overflow-hidden text-xs max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-xs">Applicant Dossier & Candidate Profile</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          
          {/* Candidate Profile Header Card */}
          <div className="clean-card overflow-hidden">
            {/* Cover Banner */}
            <div className="h-28 w-full bg-slate-100 overflow-hidden relative">
              <img src={banner} alt="Cover" className="w-full h-full object-cover" />
            </div>

            {/* Profile Bar */}
            <div className="p-5 pt-0 relative">
              <div className="flex items-end justify-between -mt-10 mb-3">
                <img 
                  src={avatar} 
                  alt={application.applicantName} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md bg-white" 
                />
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 uppercase tracking-wide border border-slate-200">
                  Status: {application.status}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{application.applicantName}</h2>
                <p className="text-slate-700 font-medium text-xs mt-0.5">{headline}</p>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[11px] mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {application.proposedLocation}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    {university} ({gradYear})
                  </span>
                  <a href={`mailto:${application.applicantEmail}`} className="text-blue-700 font-semibold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {application.applicantEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* About / Bio */}
          <div className="clean-card p-5 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">About Candidate</h3>
            <p className="text-slate-700 leading-relaxed text-xs">
              {bio}
            </p>
          </div>

          {/* Skills & Endorsements */}
          <div className="clean-card p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Skills & Competencies</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium text-[11px] border border-slate-200/60">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Target Role & Applied Opening */}
          <div className="clean-card p-4 bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Target Position</span>
              <span className="font-bold text-slate-900 text-sm">{application.role}</span>
              <p className="text-slate-500 text-[11px]">{application.proposedLocation}</p>
            </div>
            <span className="text-slate-400 text-[11px]">
              Submitted {new Date(application.submittedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Candidate Custom Question Answers */}
          <div className="clean-card p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Application Statement & Experience</h3>
            
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-slate-700 block text-[11px] mb-1">
                  Why do you want to lead or join this branch in your city?
                </span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 leading-relaxed">
                  {application.statement || "Passionate about mobilizing volunteers, planting trees, and driving measurable grassroots impact in our region."}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block text-[11px] mb-1">
                  Relevant Leadership & Community Experience
                </span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 leading-relaxed">
                  {application.experienceRecap || "2+ years organizing student service events, leading campus volunteer drives, and managing youth coalitions."}
                </p>
              </div>
            </div>
          </div>

          {/* Internal Review Notes */}
          <div className="clean-card p-5 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Internal HQ Review Notes</h3>
            <textarea
              rows={2}
              placeholder="Add interviewer notes, review feedback, or screening details..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 text-xs"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-[11px]"
              >
                Save Notes
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`mailto:${application.applicantEmail}?subject=Regarding your application for ${application.role}`}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Applicant</span>
          </a>

          <div className="flex items-center gap-2">
            <select
              value={application.status || 'submitted'}
              onChange={(e) => {
                onUpdateStatus(application.id, e.target.value, noteText);
                onClose();
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 text-xs focus:outline-none"
            >
              <option value="submitted">Stage 1: Submitted</option>
              <option value="screening">Stage 2: Screening</option>
              <option value="interview">Stage 3: Interview / Committee</option>
              <option value="approved">Stage 4: Approved & Active</option>
            </select>

            {nextStatus && (
              <button
                type="button"
                onClick={handleAdvance}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
              >
                <span>Advance to {nextStatus}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
