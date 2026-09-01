import React, { useState, useRef } from 'react';
import { 
  X, Check, Upload, Sparkles, MapPin, GraduationCap, 
  Briefcase, Award, Linkedin, Twitter, Github, Globe, Plus, Trash2, CheckCircle2 
} from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose, user, onSaveProfile }) {
  const [activeTab, setActiveTab] = useState('view'); // 'view' or 'edit'
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@university.edu',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    banner: user?.banner || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    headline: user?.headline || 'Community Organizer | Stanford 2026 | Environmental Activist',
    location: user?.location || 'San Francisco Bay Area, CA',
    bio: user?.bio || 'Passionate student leader focused on scaling climate action chapters and youth civic participation. Experienced in community coalition building, volunteer management, and grassroots event hosting.',
    university: user?.university || 'Stanford University',
    degree: user?.degree || 'B.S. Earth Systems & Public Policy',
    gradYear: user?.gradYear || '2026',
    skills: user?.skills || ['Grassroots Organizing', 'Project Management', 'Public Speaking', 'Team Leadership', 'Event Logistics', 'Social Media Strategy'],
    causes: user?.causes || ['Environment', 'Education & Tech', 'Civic Engagement'],
    experience: user?.experience || [
      {
        id: 1,
        title: 'Founding Chapter Lead',
        org: 'EcoRoots Bay Area',
        period: '2025 - Present',
        description: 'Chartered campus branch, mobilized 45+ student volunteers, and coordinated local tree restoration events.'
      },
      {
        id: 2,
        title: 'Community Outreach Intern',
        org: 'Sustainable Futures Coalition',
        period: '2024 - 2025',
        description: 'Coordinated civic town halls and youth climate roundtables across 6 high schools.'
      }
    ],
    socials: user?.socials || {
      linkedin: 'https://linkedin.com/in/alex-morgan',
      github: 'https://github.com/alexmorgan',
      twitter: 'https://x.com/alexmorgan',
      website: 'https://alexmorgan.me'
    }
  });

  const [newSkill, setNewSkill] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result;
      if (type === 'avatar') {
        setProfileData(prev => ({ ...prev, avatar: dataUrl }));
      } else if (type === 'banner') {
        setProfileData(prev => ({ ...prev, banner: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSave = () => {
    onSaveProfile(profileData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveTab('view');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-3xl border border-slate-200 shadow-2xl overflow-hidden text-xs max-h-[92vh] flex flex-col">
        
        {/* Modal Controls Top Bar */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs">Changemaker Profile</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
              Member Showcase
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'view' ? 'edit' : 'view')}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] transition-colors"
            >
              {activeTab === 'view' ? 'Edit Profile' : 'View Public Preview'}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {activeTab === 'view' ? (
            /* VIEW / SHOWCASE MODE (Member) */
            <div className="space-y-6">
              
              {/* Profile Header Card */}
              <div className="clean-card overflow-hidden">
                {/* Banner */}
                <div className="h-32 sm:h-40 w-full bg-slate-100 relative">
                  <img src={profileData.banner} alt="Cover" className="w-full h-full object-cover" />
                </div>

                {/* Info Bar */}
                <div className="px-6 pb-6 pt-0 relative">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
                    <div className="relative">
                      <img 
                        src={profileData.avatar} 
                        alt={profileData.name} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white" 
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('edit')}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-2xs"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {profileData.name}
                    </h1>
                    <p className="text-slate-700 font-medium text-xs sm:text-sm mt-0.5">
                      {profileData.headline}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-slate-500 text-[11px] mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {profileData.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        {profileData.university}
                      </span>
                      <span className="text-blue-700 font-semibold">{profileData.email}</span>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                      {profileData.socials.linkedin && (
                        <a href={profileData.socials.linkedin} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors">
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {profileData.socials.twitter && (
                        <a href={profileData.socials.twitter} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors">
                          <Twitter className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {profileData.socials.github && (
                        <a href={profileData.socials.github} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors">
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {profileData.socials.website && (
                        <a href={profileData.socials.website} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors">
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* About Bio */}
              <div className="clean-card p-6 space-y-2">
                <h3 className="font-bold text-sm text-slate-900">About</h3>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-[13px]">
                  {profileData.bio}
                </p>
              </div>

              {/* Skills & Badges */}
              <div className="clean-card p-6 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Skills & Leadership Endorsements</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200/60 shadow-2xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience & Branch Roles */}
              <div className="clean-card p-6 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Experience & Community Leadership</span>
                </h3>

                <div className="space-y-4 divide-y divide-slate-100">
                  {profileData.experience.map((exp) => (
                    <div key={exp.id} className="pt-3 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-xs">{exp.title}</h4>
                        <span className="text-slate-400 text-[11px] font-medium">{exp.period}</span>
                      </div>
                      <p className="font-semibold text-blue-700 text-[11px]">{exp.org}</p>
                      <p className="text-slate-600 text-xs leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="clean-card p-6 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Education</span>
                </h3>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">{profileData.university}</h4>
                  <p className="text-slate-600">{profileData.degree}</p>
                  <p className="text-slate-400 text-[11px]">Class of {profileData.gradYear}</p>
                </div>
              </div>

            </div>
          ) : (
            /* EDIT MODE */
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="font-bold text-base text-slate-900">Edit Changemaker Profile</h2>
                  <p className="text-slate-500 text-[11px]">Customize your public profile for non-profit review.</p>
                </div>
                {saveSuccess && (
                  <span className="text-blue-700 font-bold flex items-center gap-1 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profile Saved!</span>
                  </span>
                )}
              </div>

              {/* Photos upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Avatar Image</label>
                  <div className="flex items-center gap-3">
                    <img src={profileData.avatar} alt="Avatar" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                    <input 
                      type="file" 
                      ref={avatarInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'avatar')}
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Avatar</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Cover Banner</label>
                  <div className="space-y-1.5">
                    <input 
                      type="file" 
                      ref={bannerInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'banner')}
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Banner</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Professional Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Student Organizer | Stanford 2026 | Environmental Advocate"
                  value={profileData.headline}
                  onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">About Bio</label>
                <textarea
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs"
                />
              </div>

              {/* Education */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">University / High School</label>
                  <input
                    type="text"
                    value={profileData.university}
                    onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={profileData.gradYear}
                    onChange={(e) => setProfileData({ ...profileData, gradYear: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700">Skills & Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a skill (e.g. Budgeting, Web Design)..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {profileData.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs flex items-center gap-1.5">
                      <span>{skill}</span>
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Profiles */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs">Social Profiles</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Changemaker Profile</label>
                    <input
                      type="url"
                      value={profileData.socials.linkedin}
                      onChange={(e) => setProfileData({ ...profileData, socials: { ...profileData.socials, linkedin: e.target.value } })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Personal Portfolio / Website</label>
                    <input
                      type="url"
                      value={profileData.socials.website}
                      onChange={(e) => setProfileData({ ...profileData, socials: { ...profileData.socials, website: e.target.value } })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('view')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-2xs"
                >
                  Save Profile Changes
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
