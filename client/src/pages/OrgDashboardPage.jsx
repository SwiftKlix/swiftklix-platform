import React, { useState } from 'react';

import { Plus } from 'lucide-react';

import KanbanBoard from '../components/KanbanBoard';



export default function OrgDashboardPage({ 

  orgs, 

  opportunities, 

  applications, 

  chapters, 

  onUpdateStatus, 

  openCreateCampaignModal 

}) {

  const [selectedOrgId, setSelectedOrgId] = useState(orgs[0]?.id || '');
  const [activeTab, setActiveTab] = useState('kanban');

  const activeOrg = orgs.find(o => o.id === selectedOrgId) || orgs[0] || null;

  if (!activeOrg) {
    return (
      <div className="clean-card p-12 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-900">No Organizations Registered</h2>
        <p className="text-slate-500 text-xs max-w-md mx-auto">
          Register your organization in the Organization Hub to manage branches, candidate pipelines, and chapter campaigns.
        </p>
      </div>
    );
  }

  const orgOpportunities = (opportunities || []).filter(o => o.orgId === selectedOrgId);
  const orgApplications = (applications || []).filter(a => a.orgId === selectedOrgId);
  const orgChapters = (chapters || []).filter(c => c.orgId === selectedOrgId);



  return (

    <div className="space-y-6 pb-16">

      {/* Header */}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">

            Leader & Founder Dashboard

          </span>

          <h1 className="text-2xl font-bold text-slate-900 mt-1">

            {activeOrg?.name}

          </h1>

          <p className="text-xs text-slate-500 mt-0.5">

            Manage your chapter recruitment pipeline and review candidate answers.

          </p>

        </div>



        <div className="flex items-center gap-2">

          <select

            value={selectedOrgId}

            onChange={(e) => setSelectedOrgId(e.target.value)}

            className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800"

          >

            {(orgs || []).map(o => (

              <option key={o.id} value={o.id}>{o.name}</option>

            ))}

          </select>



          <button

            onClick={openCreateCampaignModal}

            className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shrink-0"

          >

            <Plus className="w-4 h-4" />

            <span>Post Opening</span>

          </button>

        </div>

      </div>



      {/* Tabs */}

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-medium">

        <button

          onClick={() => setActiveTab('kanban')}

          className={`px-3.5 py-1.5 rounded-lg transition-colors ${

            activeTab === 'kanban' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'

          }`}

        >

          Applicant Pipeline ({orgApplications.length})

        </button>



        <button

          onClick={() => setActiveTab('chapters')}

          className={`px-3.5 py-1.5 rounded-lg transition-colors ${

            activeTab === 'chapters' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'

          }`}

        >

          Active Chapters ({orgChapters.length})

        </button>



        <button

          onClick={() => setActiveTab('openings')}

          className={`px-3.5 py-1.5 rounded-lg transition-colors ${

            activeTab === 'openings' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'

          }`}

        >

          Open Positions ({orgOpportunities.length})

        </button>

      </div>



      {/* Tab Content */}

      {activeTab === 'kanban' && (

        <KanbanBoard 

          applications={orgApplications} 

          onUpdateStatus={onUpdateStatus} 

        />

      )}



      {activeTab === 'chapters' && (

        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">

          {orgChapters.length === 0 ? (

            <div className="p-8 text-center text-slate-500">No active chapters yet.</div>

          ) : (

            orgChapters.map(chap => (

              <div key={chap.id} className="p-4 flex items-center justify-between">

                <div>

                  <h4 className="font-bold text-slate-900 text-sm">{chap.name}</h4>

                  <p className="text-slate-500">Lead: {chap.leadName} ({chap.leadEmail}) - {chap.institution}</p>

                </div>

                <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 font-semibold">

                  {chap.activeMembers} Volunteers

                </span>

              </div>

            ))

          )}

        </div>

      )}



      {activeTab === 'openings' && (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {orgOpportunities.map(opp => (

            <div key={opp.id} className="bg-white rounded-xl border border-slate-200 p-4 text-xs">

              <div className="flex items-center justify-between mb-1">

                <span className="font-semibold text-blue-700">{opp.focusArea}</span>

                <span className="text-slate-500">{opp.targetLocation}</span>

              </div>

              <h3 className="font-bold text-sm text-slate-900 mb-1">{opp.title}</h3>

              <p className="text-slate-600 line-clamp-2">{opp.description}</p>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}


