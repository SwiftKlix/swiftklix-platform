import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function PostRoleModal({ isOpen, orgs, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    orgId: orgs[0]?.id || '',
    title: '',
    type: 'Executive Role',
    roleCategory: 'Executive / Board',
    targetLocation: 'Remote (Global)',
    commitment: '5-7 hrs/week',
    focusArea: 'National Staff Role',
    deadline: 'Rolling',
    spotsAvailable: 1,
    description: '',
    tags: 'Remote, Leadership, Strategy'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedOrg = orgs.find(o => o.id === formData.orgId) || orgs[0];
    onCreate({
      ...formData,
      orgName: selectedOrg?.name || 'Non-Profit',
      orgEmoji: selectedOrg?.logoEmoji || '??',
      cause: selectedOrg?.cause || 'Social Impact',
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-zinc-200 shadow-modal overflow-hidden">
        <div className="p-6 sm:p-8 flex items-start justify-between border-b border-zinc-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold w-fit mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Leadership Roles Board</span>
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-zinc-900">Post Executive or Board Role</h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Organization *</label>
              <select 
                value={formData.orgId} 
                onChange={(e) => setFormData({ ...formData, orgId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm shadow-soft focus:ring-2 focus:ring-blue-500"
              >
                {(orgs || []).map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Role Category *</label>
              <select 
                value={formData.roleCategory} 
                onChange={(e) => setFormData({ ...formData, roleCategory: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm shadow-soft focus:ring-2 focus:ring-blue-500"
              >
                <option value="Executive / Board">Executive / Board</option>
                <option value="Tech & Curriculum">Tech & Curriculum</option>
                <option value="Marketing & Media">Marketing & Media</option>
                <option value="Operations & Finance">Operations & Finance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Position Title *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. VP of Chapter Success / Lead Web Developer"
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm shadow-soft focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Role Description *</label>
            <textarea 
              required
              rows={3}
              placeholder="Write about responsibilities, hours, and goals..."
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm shadow-soft focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
            <button type="button" onClick={onClose} className="text-xs font-semibold text-zinc-600 hover:text-zinc-900">Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 shadow-soft">
              Post Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

