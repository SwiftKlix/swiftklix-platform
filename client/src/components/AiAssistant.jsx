import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, ArrowRight, Bot, Building2, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';

export default function AiAssistant({ orgs = [], opportunities = [], onViewOrg, onApply }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your SwiftKlix AI Assistant. Ask me about starting a local branch in your city, finding volunteer positions, or discovering verified organizations across any cause."
    }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "How do I start a branch?",
    "Climate & tree planting",
    "Youth coding & STEM",
    "Open positions near me"
  ];

  const handleSend = (textToSend) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    setTimeout(() => {
      let reply = '';
      let matchedOrg = null;
      let matchedOpp = null;
      const lower = q.toLowerCase();

      // 1. Starting a Branch / How does chartering work?
      if (lower.includes('how to start') || lower.includes('how do i start') || lower.includes('start a branch') || lower.includes('start a chapter') || lower.includes('charter')) {
        matchedOrg = orgs[0];
        reply = "Starting a branch on SwiftKlix is simple and open to anyone anywhere:\n\n1. Go to 'Start a Branch' and choose an organization that inspires you.\n2. Submit a 2-minute branch founding application with your city or campus.\n3. Complete a brief intro call with organization leadership to receive your official guidelines & toolkit.\n4. Recruit your founding team and host your first kickoff meeting!";
      }
      // 2. Tech / Coding / STEM / Software
      else if (lower.includes('tech') || lower.includes('code') || lower.includes('coding') || lower.includes('stem') || lower.includes('software') || lower.includes('python') || lower.includes('web') || lower.includes('developer')) {
        matchedOrg = orgs.find(o => o.category?.toLowerCase().includes('tech') || o.name?.toLowerCase().includes('code')) || orgs[1];
        matchedOpp = opportunities.find(o => o.category?.toLowerCase().includes('tech') || o.orgId === matchedOrg?.id);
        reply = `${matchedOrg?.name || 'CodeNova'} is dedicated to free youth coding workshops and STEM access. You can start a local CodeNova branch in your city or apply as a Python & Web development instructor!`;
      }
      // 3. Environment / Climate / Trees / Sustainability / Green
      else if (lower.includes('environment') || lower.includes('climate') || lower.includes('tree') || lower.includes('green') || lower.includes('nature') || lower.includes('conservation') || lower.includes('planting')) {
        matchedOrg = orgs.find(o => o.category?.toLowerCase().includes('environment') || o.name?.toLowerCase().includes('roots')) || orgs[0];
        matchedOpp = opportunities.find(o => o.category?.toLowerCase().includes('environment') || o.orgId === matchedOrg?.id);
        reply = `${matchedOrg?.name || 'EcoRoots'} empowers students and community volunteers to plant urban tree canopies and restore local ecosystems. They provide full event toolkits for new branches.`;
      }
      // 4. Mental Health / Wellness / Peer Support / Counseling
      else if (lower.includes('mental') || lower.includes('health') || lower.includes('mind') || lower.includes('wellness') || lower.includes('counseling') || lower.includes('peer') || lower.includes('psych')) {
        matchedOrg = orgs.find(o => o.category?.toLowerCase().includes('mental') || o.name?.toLowerCase().includes('mind')) || orgs[2];
        matchedOpp = opportunities.find(o => o.category?.toLowerCase().includes('mental') || o.orgId === matchedOrg?.id);
        reply = `${matchedOrg?.name || 'MindBridge'} facilitates student decompression circles, peer listening lounges, and mental wellness initiatives with guidance from licensed counseling advisors.`;
      }
      // 5. Food Security / Hunger / Surplus Rescue / Meal Sharing
      else if (lower.includes('food') || lower.includes('hunger') || lower.includes('meal') || lower.includes('pantry') || lower.includes('rescue') || lower.includes('waste')) {
        matchedOrg = orgs.find(o => o.category?.toLowerCase().includes('food') || o.name?.toLowerCase().includes('harvest')) || orgs[3];
        matchedOpp = opportunities.find(o => o.category?.toLowerCase().includes('food') || o.orgId === matchedOrg?.id);
        reply = `${matchedOrg?.name || 'HarvestShare'} redirects excess campus cafeteria and local bakery meals to food pantries. You can lead a food rescue branch or volunteer for dispatch logistics.`;
      }
      // 6. Civic / Policy / Voting / Democracy / Town Halls
      else if (lower.includes('civic') || lower.includes('policy') || lower.includes('vote') || lower.includes('voting') || lower.includes('government') || lower.includes('advocacy') || lower.includes('justice')) {
        matchedOrg = orgs.find(o => o.category?.toLowerCase().includes('civic') || o.name?.toLowerCase().includes('pulse')) || orgs[4];
        matchedOpp = opportunities.find(o => o.category?.toLowerCase().includes('civic') || o.orgId === matchedOrg?.id);
        reply = `${matchedOrg?.name || 'CivicPulse'} coordinates non-partisan youth voter registration, community roundtables, and policy research briefs across high schools and universities.`;
      }
      // 7. Healthcare / Medicine / Clinic / Clinical / Pre-Med
      else if (lower.includes('medical') || lower.includes('clinic') || lower.includes('pre-med') || lower.includes('nurse') || lower.includes('doctor') || lower.includes('hygiene') || lower.includes('hospital')) {
        matchedOrg = orgs.find(o => o.category?.toLowerCase().includes('healthcare') || o.name?.toLowerCase().includes('sanctuary')) || orgs[5] || orgs[0];
        matchedOpp = opportunities.find(o => o.category?.toLowerCase().includes('healthcare') || o.orgId === matchedOrg?.id);
        reply = `${matchedOrg?.name || 'Sanctuary Health'} organizes mobile health triage clinics, blood pressure screenings, and essential hygiene supply drives for underserved neighborhoods.`;
      }
      // 8. Specific City Queries
      else if (lower.includes('austin') || lower.includes('boston') || lower.includes('seattle') || lower.includes('chicago') || lower.includes('francisco') || lower.includes('york') || lower.includes('atlanta') || lower.includes('stanford') || lower.includes('michigan') || lower.includes('denver')) {
        const foundOpp = opportunities.find(o => 
          lower.includes(o.targetLocation?.toLowerCase().split(',')[0]) || 
          lower.includes(o.targetLocation?.toLowerCase().split(' ')[0])
        );
        if (foundOpp) {
          matchedOpp = foundOpp;
          matchedOrg = orgs.find(o => o.id === foundOpp.orgId);
          reply = `We have active openings in your area for ${matchedOpp.title} with ${matchedOpp.orgName}! You can also start a local branch of any organization.`;
        } else {
          matchedOrg = orgs[0];
          reply = `You can establish a new chapter for any of our ${orgs.length} verified organizations in your city! Check out ${matchedOrg?.name} or browse the 'Start a Branch' tab.`;
        }
      }
      // 9. Match Quiz / Scores
      else if (lower.includes('quiz') || lower.includes('match') || lower.includes('score') || lower.includes('diagnostic')) {
        reply = "The 5-Step Match Quiz evaluates your cause interests, location, role preference, and time availability to calculate a 1-100% compatibility score for every organization and opportunity.";
      }
      // 10. Positions / Volunteer Roles
      else if (lower.includes('position') || lower.includes('volunteer') || lower.includes('job') || lower.includes('role') || lower.includes('opening')) {
        matchedOpp = (opportunities || []).find(o => o?.type === 'Position') || opportunities?.[0];
        matchedOrg = (orgs || []).find(o => o?.id === matchedOpp?.orgId) || orgs?.[0];
        reply = `Check out the 'Positions' tab for specialized roles like ${matchedOpp?.title || 'Instructor or Coordinator'} where you can contribute specific technical, operational, or logistics skills!`;
      }
      // 11. General / Fallback
      else {
        matchedOrg = orgs[Math.floor(Math.random() * orgs.length)] || orgs[0];
        reply = `SwiftKlix connects student changemakers with ${orgs.length} verified national organizations across climate, coding, mental health, food security, and civic policy. Would you like to start a local branch or explore open positions?`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          actionOrg: matchedOrg,
          actionOpp: matchedOpp
        }
      ]);
    }, 200);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-950 text-white font-semibold text-xs shadow-2xl hover:bg-slate-800 hover:scale-105 transition-all border border-slate-700/60"
        >
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-slate-950">
            <Sparkles className="w-3 h-3" />
          </div>
          <span>AI Assistant</span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl w-80 sm:w-96 h-[480px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs">SwiftKlix AI Assistant</h3>
                <span className="text-[10px] text-blue-400 font-medium">Smart Navigator</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {/* Interactive Action Card if Org / Opportunity Matched */}
                {m.actionOrg && (
                  <div className="mt-2 w-full max-w-[92%] p-3 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-white border border-slate-200 p-0.5 overflow-hidden flex items-center justify-center shrink-0">
                        {m.actionOrg.logo ? (
                          <img src={m.actionOrg.logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                            {(m.actionOrg?.name || "O").charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="font-bold text-slate-900 truncate text-xs">{m.actionOrg.name}</h4>
                          <VerifiedBadge showText={false} />
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{m.actionOrg.category} • {m.actionOrg.headquarters}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          if (onViewOrg) onViewOrg(m.actionOrg.id);
                          setIsOpen(false);
                        }}
                        className="flex-1 py-1.5 px-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] text-center"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={() => {
                          if (onApply) {
                            onApply({
                              id: `start-${m.actionOrg.id}`,
                              orgId: m.actionOrg.id,
                              orgName: m.actionOrg.name,
                              title: `Found a ${m.actionOrg.name} Chapter`,
                              type: 'Start a Chapter',
                              targetLocation: 'Your City / Campus',
                              commitment: '3-4 hours / week',
                              category: m.actionOrg.category,
                              prerequisites: m.actionOrg.prerequisites || '3+ hrs/wk commitment • Passion for mission'
                            });
                          }
                          setIsOpen(false);
                        }}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] text-center shadow-2xs"
                      >
                        Start a Branch
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-semibold whitespace-nowrap shrink-0 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about causes, cities, or starting a chapter..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 text-xs bg-slate-50 font-medium text-slate-900"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
