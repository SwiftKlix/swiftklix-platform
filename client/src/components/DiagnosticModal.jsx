import React, { useState, useEffect } from 'react';
import { X, Sparkles, MapPin, Check, ArrowRight, ArrowLeft, Search } from 'lucide-react';
import LocationInput from './LocationInput';
import { US_CITIES } from '../utils/usCities';

export default function DiagnosticModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onSavePreferences,
  existingPrefs,
  currentPreferences,
  diagnosticPrefs
}) {
  const [step, setStep] = useState(1);
  const initialPrefs = existingPrefs || currentPreferences || diagnosticPrefs || {};
  
  const [causes, setCauses] = useState(initialPrefs.causes || []);
  const [userLocation, setUserLocation] = useState(initialPrefs.userLocation || '');
  const [roleType, setRoleType] = useState(initialPrefs.roleType || 'both');
  const [availability, setAvailability] = useState(initialPrefs.availability || 'medium');
  const [onlyLocal, setOnlyLocal] = useState(initialPrefs.onlyLocal || false);

  useEffect(() => {
    const p = existingPrefs || currentPreferences || diagnosticPrefs;
    if (p) {
      if (p.causes) setCauses(p.causes);
      if (p.userLocation) setUserLocation(p.userLocation);
      if (p.roleType) setRoleType(p.roleType);
      if (p.availability) setAvailability(p.availability);
      if (p.onlyLocal !== undefined) setOnlyLocal(p.onlyLocal);
    }
  }, [existingPrefs, currentPreferences, diagnosticPrefs]);

  if (!isOpen) return null;

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

  const handleFinish = () => {
    const saveFn = onSave || onSavePreferences;
    if (saveFn) {
      saveFn({
        causes,
        userLocation: userLocation.trim() || 'Austin, TX',
        roleType,
        availability,
        onlyLocal,
        completed: true,
        updatedAt: new Date().toISOString()
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              {step}/5
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Personalized Match Quiz</h3>
              <p className="text-[11px] text-slate-500">Tune compatibility percentages for organizations and openings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-1">
          <div 
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Step 1: Causes */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">1. What causes are you passionate about?</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">Select all that align with your mission.</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {causeOptions.map((c) => {
                  const isSelected = causes.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCause(c)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 text-blue-950 shadow-2xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-1">{c}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Location with GPS Detection & Google Maps Style Search */}
          {step === 2 && (
            <div className="space-y-3.5">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">2. Where are you located?</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Click "Use Precise Location" to auto-detect your city via GPS, or search any US city/town.
                </p>
              </div>

              <div className="pt-1">
                <LocationInput
                  value={userLocation}
                  onChange={setUserLocation}
                  placeholder="Search any US city, university campus, or town..."
                  showPills={true}
                />
              </div>
            </div>
          )}

          {/* Step 3: Role Preference */}
          {step === 3 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">3. What kind of involvement are you seeking?</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">Choose how you prefer to contribute.</p>
              </div>

              <div className="space-y-2 pt-1">
                {[
                  { id: 'branch', title: 'Founding Chapter / Branch Leader', desc: 'Start or lead a local campus/city branch' },
                  { id: 'volunteer', title: 'Specialized Role / Team Volunteer', desc: 'Contribute technical, creative, or operational skills' },
                  { id: 'both', title: 'Open to Both Opportunities', desc: 'Explore all branch leadership and specialized roles' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRoleType(item.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      roleType === item.id
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-2xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{item.title}</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">{item.desc}</div>
                    </div>
                    {roleType === item.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Availability */}
          {step === 4 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">4. How much time can you dedicate weekly?</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">We match you with realistic commitments.</p>
              </div>

              <div className="space-y-2 pt-1">
                {[
                  { id: 'low', title: '1-2 hours / week', desc: 'Light contributor or task-based support' },
                  { id: 'medium', title: '3-5 hours / week', desc: 'Active branch member, officer, or specialist' },
                  { id: 'high', title: '6+ hours / week', desc: 'Chapter founding lead, director, or core staff' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAvailability(item.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      availability === item.id
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-2xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{item.title}</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">{item.desc}</div>
                    </div>
                    {availability === item.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Location Constraint */}
          {step === 5 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">5. Location Proximity Preference</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">Prioritize local branches in your city vs. national/remote.</p>
              </div>

              <div className="space-y-2 pt-1">
                {[
                  { val: false, title: 'Show All Matches (Local + Remote)', desc: 'Prioritize local openings while including high-affinity remote options' },
                  { val: true, title: 'Strictly Local Opportunities Only', desc: `Only show initiatives and chapters physically in or near ${userLocation || 'your city'}` }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setOnlyLocal(item.val)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      onlyLocal === item.val
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-2xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{item.title}</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">{item.desc}</div>
                    </div>
                    {onlyLocal === item.val && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-white text-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply Match Scores</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
