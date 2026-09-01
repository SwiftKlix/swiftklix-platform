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
        matchedOrg = orgs[0] || null;
        reply = "Starting a local branch on SwiftKlix is straightforward:\n\n1. Browse 'Start a Branch' or Explore to choose an organization that inspires you.\n2. Submit a brief founding application with your city or university campus.\n3. Organization directors review your application and provide official guidelines, legal status, and event toolkits.\n4. Recruit your founding committee and start hosting local community events!";
      }
      // 2. Registering an Organization
      else if (lower.includes('register') || lower.includes('add org') || lower.includes('create org') || lower.includes('my non-profit') || lower.includes('nonprofit') || lower.includes('501c3')) {
        reply = "To register your non-profit or student organization:\n\n1. Go to 'Organization Hub' in the top navigation.\n2. Click 'Register Your Organization'.\n3. Provide your mission, focus cause, headquarters, and custom applicant screening questions.\n4. Publish chapter founding campaigns and specialized volunteer roles!";
      }
      // 3. Match Quiz & Compatibility
      else if (lower.includes('quiz') || lower.includes('match') || lower.includes('score') || lower.includes('diagnostic') || lower.includes('tune')) {
        reply = "The SwiftKlix 2-Minute Match Quiz computes a real-time compatibility score (0-100%) for every organization and position based on your causes, location, and preferred leadership role.";
      }
      // 4. Dynamic Cause/Category Search
      else {
        // Search in active live organizations
        const matched = (orgs || []).find(o => 
          lower.includes((o.category || '').toLowerCase()) ||
          lower.includes((o.name || '').toLowerCase()) ||
          (o.tagline && lower.includes(o.tagline.toLowerCase())) ||
          (o.description && lower.includes(o.description.toLowerCase()))
        );

        const matchedOpportunity = (opportunities || []).find(o => 
          lower.includes((o.category || '').toLowerCase()) ||
          lower.includes((o.title || '').toLowerCase()) ||
          (o.targetLocation && lower.includes(o.targetLocation.toLowerCase()))
        );

        if (matched) {
          matchedOrg = matched;
          matchedOpp = matchedOpportunity || (opportunities || []).find(o => o.orgId === matched.id);
          reply = `${matched.name} is an active organization in ${matched.category || 'the community'}. ${matched.tagline || ''}\n\nYou can view their profile or apply to establish a local chapter.`;
        } else if (matchedOpportunity) {
          matchedOpp = matchedOpportunity;
          matchedOrg = (orgs || []).find(o => o.id === matchedOpportunity.orgId);
          reply = `We found an open opportunity: '${matchedOpportunity.title}' with ${matchedOpportunity.orgName} in ${matchedOpportunity.targetLocation}!\n\nCheck the Opportunities or Positions tab to apply.`;
        } else if (orgs.length === 0) {
          reply = "Welcome to SwiftKlix! The platform is live and ready for organizations to register. You can register your non-profit or student club via the 'Organization Hub' to post chapter campaigns and volunteer positions.";
        } else {
          matchedOrg = orgs[0];
          reply = `SwiftKlix connects student changemakers with ${orgs.length} verified organizations. Explore the directory to find causes that inspire you or start a new branch in your community!`;
        }
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
