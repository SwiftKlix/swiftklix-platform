import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, CheckCircle2, XCircle, Clock, 
  ExternalLink, Mail, MapPin, Eye, Check, X, AlertCircle, FileText, Sparkles
} from 'lucide-react';

export default function AdminReviewPage({ 
  allOrgs = [], 
  onApproveOrg, 
  onRejectOrg, 
  onViewOrg 
}) {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingOrgs = (allOrgs || []).filter(o => 
    o?.approvalStatus === 'pending' || 
    (!o?.approvalStatus && o?.status === 'Pending Review') ||
    (!o?.isApproved && o?.status !== 'Rejected' && !o?.status?.includes('Verified'))
  );

  const approvedOrgs = (allOrgs || []).filter(o => 
    o?.approvalStatus === 'approved' || 
    o?.isApproved === true || 
    o?.status?.includes('Verified') || 
    o?.status === 'Approved'
  );

  const rejectedOrgs = (allOrgs || []).filter(o => 
    o?.approvalStatus === 'rejected' || o?.status === 'Rejected'
  );

  const currentList = activeTab === 'pending' ? pendingOrgs : (activeTab === 'approved' ? approvedOrgs : rejectedOrgs);

  const handleApprove = async (orgId) => {
    setIsProcessing(true);
    try {
      await onApproveOrg(orgId, actionNotes);
      setSelectedOrg(null);
      setActionNotes('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (orgId) => {
    setIsProcessing(true);
    try {
      await onRejectOrg(orgId, actionNotes || 'Does not meet current verification guidelines');
      setSelectedOrg(null);
      setActionNotes('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto">
      
      {/* Top Admin Banner */}
      <div className="clean-card p-6 border-blue-200 bg-gradient-to-r from-blue-50/60 via-white to-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider">
              SwiftKlix Platform HQ
            </span>
            <span className="text-slate-400 text-xs font-semibold">• Admin Moderation Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Organization Verification & Review
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Review incoming non-profit and student organization submissions. Approve to publish to the public Explore directory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-2xl font-black text-slate-900">{pendingOrgs.length}</span>
            <span className="block text-[11px] font-semibold text-slate-500">Pending Review</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl font-semibold text-xs max-w-md">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'pending' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Pending ({pendingOrgs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'approved' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Approved ({approvedOrgs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'rejected' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-red-500" />
          <span>Rejected ({rejectedOrgs.length})</span>
        </button>
      </div>

      {/* Submissions List */}
      {currentList.length === 0 ? (
        <div className="clean-card p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">No {activeTab} organization submissions</h3>
          <p className="text-slate-400 text-xs">
            {activeTab === 'pending' 
              ? "All organization registration requests have been reviewed." 
              : `No organizations currently marked as ${activeTab}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map((org) => (
            <div 
              key={org.id} 
              className="clean-card p-5 sm:p-6 transition-all hover:border-slate-300 space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img 
                    src={org.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80"} 
                    alt={org.name} 
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0" 
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-base text-slate-900">{org.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {org.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        org.approvalStatus === 'approved' || org.isApproved 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : (org.approvalStatus === 'rejected' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-amber-50 text-amber-800 border border-amber-200')
                      }`}>
                        {org.approvalStatus === 'approved' || org.isApproved ? 'Approved & Live' : (org.approvalStatus === 'rejected' ? 'Rejected' : 'Pending Review')}
                      </span>
                    </div>

                    <p className="text-slate-600 text-xs font-medium mt-1">{org.tagline}</p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {org.headquarters || 'National'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {org.contactEmail || org.submittedBy || 'N/A'}
                      </span>
                      {org.website && (
                        <a href={org.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-0.5 font-semibold">
                          <span>{org.website}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => setSelectedOrg(selectedOrg?.id === org.id ? null : org)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs text-slate-700 flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{selectedOrg?.id === org.id ? 'Hide Details' : 'Review Details'}</span>
                  </button>

                  {org.approvalStatus !== 'approved' && !org.isApproved && (
                    <button
                      onClick={() => handleApprove(org.id)}
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  )}

                  {org.approvalStatus !== 'rejected' && (
                    <button
                      onClick={() => handleReject(org.id)}
                      disabled={isProcessing}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Detailed Expanded Drawer */}
              {selectedOrg?.id === org.id && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 text-xs animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Mission & Full Description</span>
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {org.description || 'No detailed description provided.'}
                      </p>
                    </div>

                    <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verification & 501(c)(3) Details</span>
                      </h4>
                      <div className="text-slate-600 space-y-1 text-[11px]">
                        <p><strong>EIN / Tax ID:</strong> {org.verification?.ein || org.ein || 'Pending Submission'}</p>
                        <p><strong>Registry Status:</strong> {org.verification?.registryDoc || 'IRS 501(c)(3) Letter'}</p>
                        <p><strong>Submitted By:</strong> {org.submittedBy || org.contactEmail}</p>
                        <p><strong>Submission Date:</strong> {org.submittedAt ? new Date(org.submittedAt).toLocaleDateString() : 'Recent'}</p>
                      </div>
                    </div>
                  </div>

                  {org.customQuestions && org.customQuestions.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <h4 className="font-bold text-slate-900">Branch Lead Screening Questions ({org.customQuestions.length})</h4>
                      <ul className="list-disc pl-5 text-slate-600 space-y-1 text-[11px]">
                        {org.customQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Decision Action Bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <input
                      type="text"
                      placeholder="Optional review notes or message for the organization founder..."
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      className="flex-1 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none"
                    />
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleApprove(org.id)}
                        disabled={isProcessing}
                        className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Publish</span>
                      </button>
                      <button
                        onClick={() => handleReject(org.id)}
                        disabled={isProcessing}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
