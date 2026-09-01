import React from 'react';

export default function Logo({ size = 'md', showText = true, className = '' }) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const markSize = isSm ? 'w-8 h-8' : isLg ? 'w-12 h-12' : 'w-9 h-9';
  const textSize = isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 select-none cursor-pointer group ${className}`}>
      {/* Swiftklix Metallic Icon Mark */}
      <div className={`relative ${markSize} rounded-full p-0.5 shadow-md flex items-center justify-center group-hover:scale-105 transition-all overflow-hidden shrink-0 border border-blue-500/40 bg-slate-950`}>
        <img 
          src="/swiftklix-logo.png" 
          alt="SwiftKlix" 
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className={`font-display font-extrabold ${textSize} tracking-tight text-slate-900 leading-none`}>
              SwiftKlix
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-xs"></span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
            Chapter Network
          </span>
        </div>
      )}
    </div>
  );
}
