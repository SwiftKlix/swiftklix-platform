import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles, CheckCircle2, MapPin, Check } from 'lucide-react';
import LocationInput from './LocationInput';

export default function CreateCampaignModal({ isOpen, orgs, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    orgId: orgs?.[0]?.id || '',
    title: '',
    type: 'Start a Chapter',
    targetLocation: '',
    commitment: '',
    focusArea: '',
    category: orgs?.[0]?.category || '',
    prerequisites: '',
    deadline: '',
    spotsAvailable: 1,
    description: '',
    tags: ''
  });

  const popularCities = [
    'Austin, TX',
    'Boston, MA',
    'New York, NY',
    'San Francisco, CA',
    'Chicago, IL',
    'Seattle, WA',
    'Ann Arbor, MI',
    'Atlanta, GA',
    'Remote / All Locations'
  ];

  useEffect(() => {
    if (orgs && orgs.length > 0 && (!formData.orgId || !orgs.some(o => o.id === formData.orgId))) {
      setFormData(prev => ({
        ...prev,
        orgId: orgs[0].id,
        category: orgs[0].category || prev.category
      }));
    }
  }, [orgs, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedOrg = orgs?.find(o => o.id === formData.orgId) || orgs?.[0];
    onCreate({
      ...formData,
      orgId: selectedOrg?.id || formData.orgId || 'org-1',
      targetLocation: (formData.targetLocation || '').trim() || 'Remote / All Locations',
      orgName: selectedOrg?.name || 'Organization',
      category: selectedOrg?.category || formData.category,
      tags: typeof formData.tags === 'string' 
        ? formData.tags.split(',').map(s => s.trim()).filter(Boolean)
        : (formData.tags || ['Branch Lead'])
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 flex items-start justify-between border-b border-slate-100">
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {formData.type === 'Start a Chapter' ? 'Post a New Branch to Start' : 'Post a Specialized Position'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Set title, target location, commitment, and role prerequisites.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[82vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Organization *</label>
              <select
                value={formData.orgId}
                onChange={(e) => setFormData({ ...formData, orgId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white font-medium focus:outline-none"
              >
                {(orgs || []).map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Opportunity Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white font-medium focus:outline-none"
              >
                <option value="Start a Chapter">Start a Local Branch</option>
                <option value="Position">Specialized Staff / Volunteer Position</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Listing Title *</label>
            <input
              type="text"
              required
              placeholder={formData.type === 'Start a Chapter' ? 'e.g. Founding Chapter Lead - Austin & Central Texas' : 'e.g. Youth Coding Instructor'}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none font-medium"
            />
          </div>

          {/* Location with GPS Auto-detect and Google Maps Style Search */}
          <LocationInput
            label="Target City, Campus, or Location *"
            value={formData.targetLocation}
            onChange={(val) => setFormData({ ...formData, targetLocation: val })}
            placeholder="Search any US city, university campus, or town..."
            showPills={true}
          />

          {/* Prerequisites Field */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Prerequisites & Requirements *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Enrolled college student, 3+ hrs/wk availability, strong communication"
              value={formData.prerequisites}
              onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none font-medium"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Prerequisites will be displayed directly to applicants on their application form.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Weekly Commitment</label>
              <input
                type="text"
                placeholder="e.g. 3-4 hours / week"
                value={formData.commitment}
                onChange={(e) => setFormData({ ...formData, commitment: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Focus Area / Department</label>
              <input
                type="text"
                placeholder="e.g. Chapter Leadership or Instruction"
                value={formData.focusArea}
                onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description & Role Responsibilities *</label>
            <textarea
              rows={3}
              required
              placeholder="Outline what the branch director or volunteer will execute, meeting structure, and milestone goals..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none font-normal leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-2xs transition-colors"
            >
              Publish Opening
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
