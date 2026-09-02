import React, { useState, useEffect } from 'react';
import { 
  X, Check, Sparkles, MapPin, 
  Clock, Award, Flame, RefreshCw, ChevronRight, SlidersHorizontal, CheckCircle2
} from 'lucide-react';
import LocationInput from './LocationInput';

export default function GoalDrawer({ 
  isOpen, 
  onClose, 
  preferences, 
  diagnosticPrefs,
  onSave, 
  onSavePreferences,
  onResetAll 
}) {
  const initialPrefs = preferences || diagnosticPrefs || {};
  
  const [causes, setCauses] = useState(initialPrefs.causes || []);
  const [userLocation, setUserLocation] = useState(initialPrefs.userLocation || '');
  const [roleType, setRoleType] = useState(initialPrefs.roleType || 'both');
  const [availability, setAvailability] = useState(initialPrefs.availability || 'medium');
  const [onlyLocal, setOnlyLocal] = useState(initialPrefs.onlyLocal || false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const p = preferences || diagnosticPrefs;
    if (p) {
      if (p.causes) setCauses(p.causes);
      if (p.userLocation) setUserLocation(p.userLocation);
      if (p.roleType) setRoleType(p.roleType);
      if (p.availability) setAvailability(p.availability);
      if (p.onlyLocal !== undefined) setOnlyLocal(p.onlyLocal);
    }
  }, [preferences, diagnosticPrefs]);

  if (!isOpen) return null;

  const saveFn = onSave || onSavePreferences;

  const causeOptions = [
    'Environment & Climate',
    'Education & Youth',
    'Technology & Coding',
    'Mental Health & Wellness',
    'Food Security & Hunger',
    'Healthcare & Medicine',
    'Civic Engagement & Policy',
    'Animal Welfare & Rescue',
    'Arts & Culture',
    'Housing & Homelessness',
    'Human Rights & Justice',
    'Economic Empowerment'
  ];

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

  const toggleCause = (cause) => {
    if (causes.includes(cause)) {
      if (causes.length > 1) {
        setCauses(causes.filter(c => c !== cause));
      }
    } else {
      setCauses([...causes, cause]);
    }
  };

  const handleSave = () => {
    const payload = {
      causes,
      userLocation: userLocation.trim() || 'Remote / All Locations',
      roleType,
      availability,
      onlyLocal,
      completed: true,
      updatedAt: new Date().toISOString()
    };

    if (saveFn) {
      saveFn(payload);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    const defaultPayload = {
      causes: ['Environment & Climate', 'Technology & Coding'],
      userLocation: '',
      roleType: 'both',
      availability: 'medium',
      onlyLocal: false,
      completed: true,
      updatedAt: new Date().toISOString()
    };

    setCauses(defaultPayload.causes);
    setUserLocation(defaultPayload.userLocation);
    setRoleType(defaultPayload.roleType);
    setAvailability(defaultPayload.availability);
    setOnlyLocal(defaultPayload.onlyLocal);

    if (onResetAll) {
      onResetAll();
    } else if (saveFn) {
      saveFn(defaultPayload);
    }

    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 text-xs">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Match Tuning & Goals</h2>
              <p className="text-slate-500 text-[11px]">Adjust your personal mission criteria</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Section: Location */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Your Location (City, Campus, or State)</span>
              </label>
              {savedSuccess && (
                <span className="text-blue-700 font-bold text-[11px] flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </span>
              )}
              {resetSuccess && (
                <span className="text-amber-700 font-bold text-[11px] flex items-center gap-1 animate-in fade-in">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </span>
              )}
            </div>

            <LocationInput
              value={userLocation}
              onChange={setUserLocation}
              placeholder="Search any US city, university campus, or town..."
              showPills={true}
            />
          </div>

          {/* Section: Causes */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Target Causes ({causes.length} selected)</span>
            </label>
            
            <div className="grid grid-cols-2 gap-1.5">
              {causeOptions.map((c) => {
                const isSelected = causes.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCause(c)}
                    className={`p-2 rounded-xl border text-left font-medium text-[11px] transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{c}</span>
                    {isSelected && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Role Preference */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Preferred Involvement Type</span>
            </label>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'branch', label: 'Branch Lead' },
                { id: 'volunteer', label: 'Specialist' },
                { id: 'both', label: 'Both Types' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRoleType(item.id)}
                  className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all ${
                    roleType === item.id
                      ? 'border-blue-600 bg-blue-50 text-blue-950 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Weekly Availability */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Time Commitment</span>
            </label>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'low', label: '1-2 hrs/wk' },
                { id: 'medium', label: '3-5 hrs/wk' },
                { id: 'high', label: '6+ hrs/wk' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAvailability(item.id)}
                  className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all ${
                    availability === item.id
                      ? 'border-blue-600 bg-blue-50 text-blue-950 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Strict Local Toggle */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 text-[11px]">Strictly Local Opportunities Only</div>
              <div className="text-[10px] text-slate-500">Hide remote positions and national roles</div>
            </div>
            <input
              type="checkbox"
              checked={onlyLocal}
              onChange={(e) => setOnlyLocal(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>

      </div>
    </div>
  );
}
