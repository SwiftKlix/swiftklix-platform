import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function PostMatchmakerModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    location: '',
    skills: '',
    lookingFor: '',
    bio: '',
    contactEmail: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg border border-zinc-200 shadow-xl overflow-hidden">
        <div className="p-5 flex items-start justify-between border-b border-zinc-100">
          <div>
            <h3 className="font-bold text-lg text-zinc-900">Post a Partner Profile</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Let other organizers in your city know you want to team up.</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Your Name *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Maya Lin"
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-zinc-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Your City / Campus *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Berkeley, CA"
                value={formData.location} 
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">One-Sentence Summary *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Looking for a co-director to start a campus chapter in Chicago"
              value={formData.headline} 
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-zinc-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">Who are you looking to team up with? *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Someone to help with social media and flyer outreach"
              value={formData.lookingFor} 
              onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-zinc-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">Short Bio</label>
            <textarea 
              rows={3}
              placeholder="Tell others what you do, your interests, and what you want to achieve..."
              value={formData.bio} 
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Your Skills (comma separated)</label>
              <input 
                type="text" 
                value={formData.skills} 
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-zinc-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Contact Email *</label>
              <input 
                type="email" 
                required
                placeholder="you@example.com"
                value={formData.contactEmail} 
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-zinc-900"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button type="button" onClick={onClose} className="text-zinc-600 font-medium hover:text-zinc-900">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-semibold hover:bg-zinc-800">
              Post Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
