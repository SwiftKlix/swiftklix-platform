import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, X, Check, Loader2, Sparkles } from 'lucide-react';
import { searchUSPlaces, detectPreciseLocation } from '../utils/locationService';

export default function LocationInput({ 
  value, 
  onChange, 
  placeholder = "Search any US city, campus, or town (e.g. Austin, Boston, Stanford)...",
  label,
  showPills = true,
  className = ""
}) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [detectedToast, setDetectedToast] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for US places (Google Maps style)
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      const results = await searchUSPlaces(query);
      if (active) {
        setSuggestions(results);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const handleSelect = (cityName) => {
    setQuery(cityName);
    onChange(cityName);
    setIsOpen(false);
    setLocationError('');
  };

  const handleUsePreciseLocation = async () => {
    setIsLocating(true);
    setLocationError('');
    try {
      const detected = await detectPreciseLocation();
      setQuery(detected);
      onChange(detected);
      setDetectedToast(true);
      setTimeout(() => setDetectedToast(false), 3000);
      setIsOpen(false);
    } catch (err) {
      setLocationError("Could not access precise location. Please allow browser location permissions or type your city.");
      setTimeout(() => setLocationError(''), 4000);
    } finally {
      setIsLocating(false);
    }
  };

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

  return (
    <div className={`space-y-2 ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block font-semibold text-slate-700 text-xs">{label}</label>
          {detectedToast && (
            <span className="text-blue-700 font-bold text-[11px] flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Precise GPS Location Set!</span>
            </span>
          )}
        </div>
      )}

      {/* Input Box with Precise GPS Action Button */}
      <div className="relative">
        <div className="flex items-center gap-2 p-2.5 rounded-2xl border border-slate-200 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
          <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
          
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange(e.target.value);
              setIsOpen(true);
            }}
            className="w-full bg-transparent focus:outline-none text-xs font-semibold text-slate-900 placeholder-slate-400"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                onChange('');
                setSuggestions([]);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* 1-Click Precise GPS Location Detector Button */}
          <button
            type="button"
            onClick={handleUsePreciseLocation}
            disabled={isLocating}
            title="Use current GPS location"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-bold text-[11px] shrink-0 transition-colors cursor-pointer shadow-2xs"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Locating...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Use Precise Location</span>
                <span className="sm:hidden">GPS</span>
              </>
            )}
          </button>
        </div>

        {/* Error notice */}
        {locationError && (
          <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200 mt-1">
            {locationError}
          </p>
        )}

        {/* Real-time Google Maps Style Place Suggestions Dropdown */}
        {isOpen && (suggestions.length > 0 || query.trim().length > 1) && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto animate-in fade-in text-xs">
            
            {/* Direct Typed match */}
            {query.trim() && !suggestions.some(s => s.display_name.toLowerCase() === query.trim().toLowerCase()) && (
              <button
                type="button"
                onClick={() => handleSelect(query.trim())}
                className="w-full text-left px-3.5 py-2.5 bg-blue-50/70 hover:bg-blue-100 text-blue-950 font-bold flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Use exact text: "{query.trim()}"</span>
                </div>
                <Check className="w-3.5 h-3.5 text-blue-700" />
              </button>
            )}

            {/* Suggestions list from US place index */}
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(item.display_name)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-slate-800 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">{item.city}</span>
                    {item.state && <span className="text-slate-500 font-medium">, {item.state}</span>}
                  </div>
                </div>
                {value === item.display_name && (
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Select Popular Pills */}
      {showPills && (
        <div className="pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Quick Select Metro Hubs:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {popularCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleSelect(city)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                  (value || '').toLowerCase() === city.toLowerCase()
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
