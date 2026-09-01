import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function CreateOrgModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    category: 'Environment',
    headquarters: '',
    description: '',
    focusArea: 'Branch Opening',
    website: '',
    contactEmail: '',
    customQuestions: [
      "Why do you want to start or lead a chapter in your city?",
      "What relevant experience or club leadership do you have?"
    ]
  });

  const [newQuestionText, setNewQuestionText] = useState('');

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    setFormData(prev => ({
      ...prev,
      customQuestions: [...prev.customQuestions, newQuestionText.trim()]
    }));
    setNewQuestionText('');
  };

  const handleRemoveQuestion = (idx) => {
    setFormData(prev => ({
      ...prev,
      customQuestions: prev.customQuestions.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 flex items-start justify-between border-b border-slate-100">
          <div>
            <h3 className="font-bold text-lg text-slate-900">List Your Organization</h3>
            <p className="text-xs text-slate-500 mt-0.5">Recruit chapter founders and volunteers with custom application questions.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Organization Name *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Solar Clean Youth"
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 bg-white"
              >
                <option value="Environment">Environment</option>
                <option value="Education & Tech">Education & Tech</option>
                <option value="Mental Health">Mental Health</option>
                <option value="Food & Hunger">Food & Hunger</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Civic Engagement">Civic Engagement</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Headquarters City *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Chicago, IL"
                value={formData.headquarters} 
                onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">One-Sentence Tagline *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Providing solar energy education workshops in community centers."
              value={formData.tagline} 
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">About the Organization *</label>
            <textarea 
              rows={3}
              required
              placeholder="Explain your mission and what your chapters do..."
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Branch Opening for Chapters</label>
              <input 
                type="text" 
                placeholder="e.g. Branch Opening"
                value={formData.focusArea} 
                onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Email *</label>
              <input 
                type="email" 
                required
                placeholder="director@example.org"
                value={formData.contactEmail} 
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
              />
            </div>
          </div>

          {/* Custom Application Questions Builder */}
          <div className="pt-3 border-t border-slate-100">
            <span className="block font-bold text-slate-800 mb-1">
              Your Chapter Application Questions
            </span>
            <p className="text-slate-500 mb-2">Applicants will answer these questions when applying to lead a chapter.</p>

            <div className="space-y-2 mb-3">
              {formData.customQuestions.map((q, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-700 font-medium truncate mr-2">{idx + 1}. {q}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveQuestion(idx)}
                    className="text-slate-400 hover:text-red-600 p-1 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Add another custom question..."
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg shrink-0"
              >
                + Add
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button type="button" onClick={onClose} className="text-slate-600 font-medium hover:text-slate-900">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800">
              Create & Open Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

