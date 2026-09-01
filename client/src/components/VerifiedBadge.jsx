import React, { useState } from 'react';
import { ShieldCheck, Check } from 'lucide-react';

export default function VerifiedBadge({ ein = '84-1928472', showText = false, size = 'sm' }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <div 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => { e.stopPropagation(); setShowTooltip(!showTooltip); }}
        className={`inline-flex items-center gap-1 cursor-pointer select-none rounded-full font-bold transition-all ${
          showText 
            ? 'px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-300 text-[11px] shadow-2xs' 
            : 'text-blue-600 hover:text-blue-700'
        }`}
      >
        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
        </div>
        {showText && <span>Verified Official</span>}
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-slate-950 text-white rounded-xl shadow-2xl text-[11px] z-50 animate-in fade-in zoom-in-95 pointer-events-none">
          <div className="flex items-center gap-1.5 font-bold text-blue-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Official</span>
          </div>
          <p className="text-slate-300 leading-tight text-[10px]">
            Official organization credentials, identity, and standing verified by SwiftKlix.
          </p>
          <div className="w-2 h-2 bg-slate-950 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
}
