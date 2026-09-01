import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short max-w-sm w-full">
      <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-modal flex items-start gap-3">
        {icons[toast?.type] || icons.info}
        <div className="flex-1 text-xs">
          <p className="font-bold text-sm text-zinc-900 leading-tight">{toast.title}</p>
          {toast.message && <p className="mt-1 text-zinc-600 leading-relaxed">{toast.message}</p>}
        </div>
        <button 
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-700 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

