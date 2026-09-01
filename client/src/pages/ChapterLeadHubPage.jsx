import React, { useState } from 'react';

import { Layers, Users, Calendar, Download, ShieldCheck, Plus, CheckCircle2 } from 'lucide-react';



export default function ChapterLeadHubPage({ 

  chapters, 

  onLogEvent, 

  onAddMember, 

  orgs 

}) {

  const myChapter = chapters[0] || null;

  if (!myChapter) {
    return (
      <div className="clean-card p-12 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-900">No Chartered Branches Active</h2>
        <p className="text-slate-500 text-xs max-w-md mx-auto">
          When your branch application is approved by organization headquarters, your leadership hub will activate with toolkits, event logging, and roster management.
        </p>
      </div>
    );
  }



  const [eventTitle, setEventTitle] = useState('');

  const [attendeesCount, setAttendeesCount] = useState('25');

  const [newMemberName, setNewMemberName] = useState('');



  const resources = [

    { name: 'Chapter Brand Assets & Vector Logos', size: '14 MB', type: 'ZIP' },

    { name: 'Monthly Meeting Slide Decks & Playbook', size: '4.2 MB', type: 'PDF' },

    { name: 'Municipal Permit Application Templates', size: '1.8 MB', type: 'DOCX' },

    { name: 'Chapter Budget Tracker & Expense Sheet', size: '850 KB', type: 'XLSX' }

  ];



  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-soft flex items-start justify-between flex-col md:flex-row gap-6">

        <div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold mb-2">

            <ShieldCheck className="w-3.5 h-3.5" />

            <span>Chartered Chapter Lead Portal</span>

          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 tracking-tight">

            {myChapter.name}

          </h1>

          <p className="text-sm text-zinc-500 mt-1">

            Director: <strong className="text-zinc-900">{myChapter.leadName}</strong> - {myChapter.location}

          </p>

        </div>



        <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2.5 rounded-2xl border border-zinc-200">

          <div>

            <span className="text-[10px] text-zinc-500 font-semibold uppercase block">Chapter Status</span>

            <span className="text-xs font-bold text-blue-700">{myChapter.status}</span>

          </div>

        </div>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Roster Card */}

        <div className="modern-card p-6">

          <div className="flex items-center justify-between mb-2">

            <h3 className="font-bold text-base text-zinc-900">Active Roster</h3>

            <span className="badge-tag bg-blue-50 text-blue-800 border border-blue-200">

              {myChapter.activeMembers} Members

            </span>

          </div>

          <p className="text-xs text-zinc-500 mb-4">Add new students and volunteers to your regional chapter roster.</p>



          <form onSubmit={(e) => { e.preventDefault(); if (newMemberName) { onAddMember(myChapter.id, newMemberName); setNewMemberName(''); } }} className="space-y-3">

            <input

              type="text"

              required

              placeholder="Member name (e.g. Elena Rostova)"

              value={newMemberName}

              onChange={(e) => setNewMemberName(e.target.value)}

              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500 shadow-soft"

            />

            <button type="submit" className="w-full py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 shadow-soft">

              + Add Member to Roster

            </button>

          </form>

        </div>



        {/* Log Event Card */}

        <div className="modern-card p-6">

          <div className="flex items-center justify-between mb-2">

            <h3 className="font-bold text-base text-zinc-900">Log Local Event</h3>

            <span className="badge-tag bg-blue-50 text-blue-800 border border-blue-200">

              {myChapter.eventsHosted || 0} Hosted

            </span>

          </div>

          <p className="text-xs text-zinc-500 mb-4">Report workshops, planting drives, or fundraisers to HQ.</p>



          <form onSubmit={(e) => { e.preventDefault(); if (eventTitle) { onLogEvent(myChapter.id, { title: eventTitle, attendees: attendeesCount }); setEventTitle(''); } }} className="space-y-3">

            <input

              type="text"

              required

              placeholder="Event name (e.g. Campus Tree Planting)"

              value={eventTitle}

              onChange={(e) => setEventTitle(e.target.value)}

              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500 shadow-soft"

            />

            <input

              type="text"

              placeholder="Attendees (e.g. 30)"

              value={attendeesCount}

              onChange={(e) => setAttendeesCount(e.target.value)}

              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500 shadow-soft"

            />

            <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-soft">

              Log Event to HQ

            </button>

          </form>

        </div>



        {/* Resource Vault */}

        <div className="modern-card p-6">

          <h3 className="font-bold text-base text-zinc-900 mb-2">HQ Resource Vault</h3>

          <p className="text-xs text-zinc-500 mb-4">Official documents, guidelines, and slide templates.</p>



          <div className="space-y-2">

            {resources.map((res, idx) => (

              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">

                <div className="truncate mr-2">

                  <span className="text-xs font-semibold text-zinc-800 block truncate">{res.name}</span>

                  <span className="text-[10px] text-zinc-500">{res.size} - {res.type}</span>

                </div>

                <button 

                  onClick={() => alert("Downloading " + res.name)}

                  className="p-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 shrink-0"

                >

                  <Download className="w-4 h-4" />

                </button>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}


