import React, { useState, useEffect } from 'react';
import { ChevronRight, MapPin, MoveRight, CheckCircle2 } from 'lucide-react';
import ApplicantProfileModal from './ApplicantProfileModal';

export default function KanbanBoard({ applications = [], onUpdateStatus, customColumns }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [draggedAppId, setDraggedAppId] = useState(null);
  const [dragOverColId, setDragOverColId] = useState(null);
  const [localApps, setLocalApps] = useState(applications);

  useEffect(() => {
    setLocalApps(applications);
  }, [applications]);

  const defaultColumns = [
    { id: 'submitted', title: 'New Submissions', countColor: 'bg-blue-100 text-blue-800' },
    { id: 'screening', title: 'Intro / Screening', countColor: 'bg-amber-100 text-amber-800' },
    { id: 'interview', title: 'Review / Interview', countColor: 'bg-purple-100 text-purple-800' },
    { id: 'approved', title: 'Approved / Active', countColor: 'bg-blue-100 text-blue-800' }
  ];

  const columns = customColumns || defaultColumns;

  const getNextStatus = (current) => {
    const s = (current || 'submitted').toLowerCase();
    if (s === 'submitted') return 'screening';
    if (s === 'screening') return 'interview';
    if (s === 'interview') return 'approved';
    return null;
  };

  const handleStatusChange = (app, newStatus, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (app && app.id) {
      setLocalApps(prev => prev.map(a => String(a.id) === String(app.id) ? { ...a, status: newStatus } : a));
      if (onUpdateStatus) {
        onUpdateStatus(app.id, newStatus, app.notes);
      }
    }
  };

  const handleAdvance = (app, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const next = getNextStatus(app?.status);
    if (next && app?.id) {
      setLocalApps(prev => prev.map(a => String(a.id) === String(app.id) ? { ...a, status: next } : a));
      if (onUpdateStatus) {
        onUpdateStatus(app.id, next, app.notes);
      }
    }
  };

  const handleDragStart = (e, app) => {
    setDraggedAppId(app.id);
    e.dataTransfer.setData('text/plain', String(app.id));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColId(null);
  };

  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    setDragOverColId(null);
    const appId = e.dataTransfer.getData('text/plain') || draggedAppId;
    if (appId) {
      const app = (localApps || []).find(a => String(a.id) === String(appId));
      setLocalApps(prev => prev.map(a => String(a.id) === String(appId) ? { ...a, status: targetColId } : a));
      if (onUpdateStatus) {
        onUpdateStatus(appId, targetColId, app?.notes);
      }
    }
    setDraggedAppId(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colApps = (localApps || []).filter((a) => {
            const s = (a?.status || 'submitted').toLowerCase();
            return s === col.id.toLowerCase();
          });
          const isOver = dragOverColId === col.id;

          return (
            <div 
              key={col.id} 
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl p-3.5 border transition-all flex flex-col min-h-[400px] ${
                isOver 
                  ? 'bg-blue-50/80 border-2 border-blue-500 shadow-md' 
                  : 'bg-slate-100/70 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                <h3 className="font-bold text-xs text-slate-800">{col.title}</h3>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${col.countColor}`}>
                  {colApps.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, app)}
                    onClick={() => setSelectedApp(app)}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs cursor-grab active:cursor-grabbing text-xs space-y-2 group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={app.applicantAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                        alt={app.applicantName} 
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-slate-900 truncate leading-snug group-hover:text-blue-700 transition-colors">
                            {app.applicantName}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent'}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-blue-800 truncate">{app.role || app.title}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{app.proposedLocation || 'Location Pending'}</span>
                    </p>

                    {app.notes && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 italic line-clamp-2">
                        "{app.notes}"
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                      <select
                        value={(app.status || col.id).toLowerCase()}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(app, e.target.value, e)}
                        className="text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-400 focus:outline-none cursor-pointer"
                      >
                        {columns.map(c => (
                          <option key={c.id} value={c.id.toLowerCase()}>{c.title}</option>
                        ))}
                      </select>

                      {col.id !== 'approved' && (
                        <button
                          type="button"
                          onClick={(e) => handleAdvance(app, e)}
                          className="text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg flex items-center gap-0.5 transition-colors cursor-pointer shrink-0 border border-blue-200"
                        >
                          <span>Advance</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colApps.length === 0 && (
                  <div className={`flex items-center justify-center h-28 border border-dashed rounded-xl text-slate-400 text-xs transition-colors ${
                    isOver ? 'border-blue-400 bg-blue-50/50 text-blue-600 font-bold' : 'border-slate-300'
                  }`}>
                    {isOver ? 'Drop candidate here' : 'No applicants in stage'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Member Applicant Profile Modal */}
      <ApplicantProfileModal
        application={selectedApp}
        isOpen={Boolean(selectedApp)}
        onClose={() => setSelectedApp(null)}
        onUpdateStatus={(appId, newStatus, notes) => {
          setLocalApps(prev => prev.map(a => String(a.id) === String(appId) ? { ...a, status: newStatus, notes: notes || a.notes } : a));
          if (onUpdateStatus) onUpdateStatus(appId, newStatus, notes);
        }}
      />
    </div>
  );
}
