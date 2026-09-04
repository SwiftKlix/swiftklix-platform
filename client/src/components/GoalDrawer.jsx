import React, { useState, useEffect } from 'react';
import { 
  X, Check, Sparkles, MapPin, 
  Clock, Award, RefreshCw, SlidersHorizontal, CheckCircle2, Globe, Shield, Filter
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
  
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'location', 'causes', 'roles'
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

  const toggleCause = (cause) => {
    if (causes.includes(cause)) {
      if (causes.length > 1) {
        setCauses(causes.filter(c => c !== cause));
      }
    } else {
      setCauses([...causes, cause]);
    }
  };

  const selectAllCauses = () => {
    setCauses([...causeOptions]);
  };

  const clearToDefaultCauses = () => {
    setCauses(['Education & Youth', 'Environment & Climate']);
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
    }, 500);
  };

  const handleReset = () => {
    const defaultPayload = {
      causes: ['Education & Youth', 'Environment & Climate'],
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
    setTimeout(() => setResetSuccess(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 text-xs">
        
        {/* Clean Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Settings & Matching</h2>
              <p className="text-slate-400 text-[11px]">Customize your location and preferences</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Organized Content Scrollable Area */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* Card 1: Location & Proximity */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Primary Location</span>
              </div>
              {userLocation && (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold text-[10px]">
                  Active
                </span>
              )}
            </div>

            <LocationInput
              value={userLocation}
              onChange={setUserLocation}
              placeholder="Search your city or campus (e.g. Redlands, CA)..."
              showPills={false}
            />

            {/* iOS-Style Clean Toggle for Local Only */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 text-[11px] block">Strictly Local Only</span>
                <span className="text-slate-400 text-[10px] block">Exclude nationwide and remote openings</span>
              </div>
              <button
                type="button"
                onClick={() => setOnlyLocal(!onlyLocal)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  onlyLocal ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    onlyLocal ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Card 2: Causes & Mission Interests */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Cause Focus ({causes.length})</span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-700">
                <button 
                  type="button" 
                  onClick={selectAllCauses} 
                  className="hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span>•</span>
                <button 
                  type="button" 
                  onClick={clearToDefaultCauses} 
                  className="hover:underline text-slate-500 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Modern Pill Cloud (Uncluttered, compact, clean) */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {causeOptions.map((c) => {
                const isSelected = causes.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCause(c)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-2xs hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <span>{c}</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 3: Role Preference & Availability */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            {/* Role Preference */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Preferred Involvement</span>
              </div>
              
              <div className="p-1 rounded-xl bg-slate-100 grid grid-cols-3 gap-1">
                {[
                  { id: 'branch', label: 'Lead Branch' },
                  { id: 'volunteer', label: 'Member / Role' },
                  { id: 'both', label: 'Open to Both' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRoleType(item.id)}
                    className={`py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer ${
                      roleType === item.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Commitment */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Weekly Time Commitment</span>
              </div>

              <div className="p-1 rounded-xl bg-slate-100 grid grid-cols-3 gap-1">
                {[
                  { id: 'low', label: '1-2 hrs / wk' },
                  { id: 'medium', label: '3-5 hrs / wk' },
                  { id: 'high', label: '6+ hrs / wk' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAvailability(item.id)}
                    className={`py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer ${
                      availability === item.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Clean Fixed Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
