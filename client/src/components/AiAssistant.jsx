import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Sparkles, ArrowRight, Bot, Building2, 
  MapPin, Briefcase, CheckCircle2, Compass, Users, HelpCircle, Loader2 
} from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';

export default function AiAssistant({ 
  orgs = [], 
  opportunities = [], 
  chapters = [], 
  onViewOrg, 
  onApply,
  onJoinBranch 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your SwiftKlix Copilot. I can help you discover verified non-profits, find chapter founding campaigns in your city, answer questions about volunteer roles, or guide you on registering your own organization.",
      actionOrg: null,
      actionOpp: null,
      actionBranch: null
    }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking]);

  const quickPrompts = [
    "Tell me about Crementum Teaching",
    "How do I start a branch in my city?",
    "Find teaching & education causes",
    "How does 501(c)(3) verification work?",
    "What volunteer roles are open?"
  ];

  // Intelligent Query Analyzer and Response Generator
  const generateResponse = (query) => {
    const q = query.toLowerCase().trim();

    // 1. Direct Organization Name / Specific Cause Search
    const directOrgMatch = (orgs || []).find(o => 
      q.includes((o.name || '').toLowerCase()) ||
      (o.name && (o.name.toLowerCase().split(' ').some(word => word.length > 3 && q.includes(word))))
    );

    if (directOrgMatch) {
      const orgOpps = (opportunities || []).filter(opp => opp.orgId === directOrgMatch.id);
      const orgChaps = (chapters || []).filter(c => c.orgId === directOrgMatch.id);
      
      let details = `**${directOrgMatch.name}** is a verified organization categorized under **${directOrgMatch.category || 'Community Impact'}** headquartered in **${directOrgMatch.headquarters || 'National'}**.\n\n`;
      
      if (directOrgMatch.tagline) {
        details += `*Mission:* "${directOrgMatch.tagline}"\n\n`;
      }
      if (directOrgMatch.description) {
        details += `${directOrgMatch.description}\n\n`;
      }

      if (orgChaps.length > 0) {
        details += `Currently active with **${orgChaps.length} chartered chapter(s)** (e.g. ${orgChaps[0].name}).`;
      } else {
        details += `Ready for student changemakers to launch its inaugural campus chapter.`;
      }

      return {
        text: details,
        actionOrg: directOrgMatch,
        actionOpp: orgOpps[0] || null,
        actionBranch: orgChaps[0] || null
      };
    }

    // 2. City / Campus Specific Chapter Query
    const cityMatches = (chapters || []).filter(c => 
      (c.location && q.includes(c.location.toLowerCase())) ||
      (c.institution && q.includes(c.institution.toLowerCase()))
    );

    if (cityMatches.length > 0) {
      const chap = cityMatches[0];
      const parentOrg = (orgs || []).find(o => o.id === chap.orgId);
      return {
        text: `Found an active local chapter in your area:\n\n**${chap.name}** led by **${chap.leadName}** (${chap.institution || chap.location}).\n\nThey have ${chap.activeMembers || 0} active volunteers involved. You can join their local chapter meetings or apply for specialized volunteer committees below.`,
        actionOrg: parentOrg,
        actionBranch: chap
      };
    }

    // 3. Category / Cause Domain Search
    const causeMatch = (orgs || []).find(o => 
      q.includes((o.category || '').toLowerCase()) ||
      (o.category && o.category.toLowerCase().split(/[ &]+/).some(w => w.length > 3 && q.includes(w)))
    );

    if (causeMatch) {
      const matchedOpps = (opportunities || []).filter(o => o.orgId === causeMatch.id);
      return {
        text: `In the **${causeMatch.category}** cause area, we recommend connecting with **${causeMatch.name}** (${causeMatch.headquarters || 'National'}).\n\n${causeMatch.tagline ? `"${causeMatch.tagline}"\n\n` : ''}You can explore their profile, apply to establish a chapter, or sign up as a member.`,
        actionOrg: causeMatch,
        actionOpp: matchedOpps[0] || null
      };
    }

    // 4. Starting a Branch / Chartering Guide
    if (q.includes('start a branch') || q.includes('start a chapter') || q.includes('found a chapter') || q.includes('how to start') || q.includes('charter')) {
      const recommendedOrg = (orgs || [])[0] || null;
      return {
        text: `**How to Launch a Chapter on SwiftKlix:**\n\n1. **Select an Organization:** Browse the Explore directory to find a verified non-profit aligned with your passions.\n2. **Submit Founding Application:** Propose your school, university campus, or metropolitan area.\n3. **Director Review & Chartering:** Organization leadership reviews your answers, approves your branch, and unlocks official toolkits.\n4. **Recruit Your Team:** Mobilize 5-15 founding student officers and begin hosting impactful campus events!`,
        actionOrg: recommendedOrg
      };
    }

    // 5. Registering an Organization / Non-Profit Founder Workflow
    if (q.includes('register') || q.includes('create org') || q.includes('add org') || q.includes('nonprofit') || q.includes('501(c)(3)') || q.includes('501c3')) {
      return {
        text: `**Registering Your Organization on SwiftKlix:**\n\n1. Navigate to **Organization Hub** in the top navigation bar.\n2. Click **+ Register New Organization** to provide your mission, branding, and verification credentials (EIN or official letter).\n3. Once submitted, our platform administration reviews your listing for community trust.\n4. Upon approval, customize your **Branch Founding Questions** and **Member Committee Tracks** to open public applications!`,
        actionOrg: null
      };
    }

    // 6. Matchmaking & Compatibility
    if (q.includes('match') || q.includes('score') || q.includes('percent') || q.includes('quiz') || q.includes('diagnostic')) {
      return {
        text: `**How the SwiftKlix Match Engine Works:**\n\nYour compatibility score (15% - 98%) is calculated using 4 weighted criteria:\n- **Cause & Mission Match (45%):** Alignment with your selected interest areas.\n- **Location & Chapter Proximity (35%):** Proximity to your campus or city.\n- **Role Intent (12%):** Chapter lead vs volunteer member preference.\n- **Weekly Bandwidth (8%):** Hours you have available.\n\nClick the **Goal / Match Profile** icon anytime to update your preferences!`,
        actionOrg: null
      };
    }

    // 7. General Volunteer / Member Inquiries
    if (q.includes('volunteer') || q.includes('join') || q.includes('member') || q.includes('roles') || q.includes('positions')) {
      const activeOpp = (opportunities || [])[0] || null;
      const parentOrg = activeOpp ? (orgs || []).find(o => o.id === activeOpp.orgId) : (orgs || [])[0];
      return {
        text: `You can get involved on SwiftKlix in two primary ways:\n\n1. **Chapter Member / Volunteer:** Join local committee tracks (e.g. Outreach, Event Planning, Marketing, Curriculum) with flexible 1-2 hrs/week commitments.\n2. **Chapter Director:** Lead a new branch at your campus or city.\n\nBrowse the **Positions** tab or click on any organization profile to view active openings.`,
        actionOrg: parentOrg,
        actionOpp: activeOpp
      };
    }

    // 8. General / Conversational Fallback
    const firstOrg = (orgs || [])[0] || null;
    return {
      text: `I'm here to help you navigate SwiftKlix! You can ask me to:\n\n- Look up specific organizations (e.g. *"Tell me about Crementum Teaching"*)\n- Find chapters in specific cities (e.g. *"Chapters in Redlands, CA"*)\n- Explain how to charter a branch or register an organization\n- Explain match compatibility percentages\n\nWhat would you like to explore?`,
      actionOrg: firstOrg
    };
  };

  const handleSend = (textToSend) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const res = generateResponse(q);
      setIsThinking(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: res.text,
          actionOrg: res.actionOrg,
          actionOpp: res.actionOpp,
          actionBranch: res.actionBranch
        }
      ]);
    }, 450);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-950 text-white font-semibold text-xs shadow-2xl hover:bg-slate-800 hover:scale-105 transition-all border border-slate-700/60 cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-slate-950">
            <Sparkles className="w-3 h-3" />
          </div>
          <span>AI Copilot</span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl w-80 sm:w-96 h-[520px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs">SwiftKlix AI Copilot</h3>
                <span className="text-[10px] text-blue-400 font-medium">Smart Platform Assistant</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
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
                  className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                </div>

                {/* Interactive Action Card if Org / Branch / Opportunity Matched */}
                {m.actionOrg && (
                  <div className="mt-2 w-full max-w-[94%] p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5 text-xs animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 p-0.5 overflow-hidden flex items-center justify-center shrink-0">
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
                        <p className="text-[10px] text-slate-500 truncate">{m.actionOrg.category} • {m.actionOrg.headquarters || 'National'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          if (onViewOrg) onViewOrg(m.actionOrg.id);
                          setIsOpen(false);
                        }}
                        className="py-1.5 px-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] text-center cursor-pointer"
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
                              title: `Start a ${m.actionOrg.name} Chapter`,
                              type: 'Start a Chapter',
                              targetLocation: m.actionOrg.headquarters || 'Your City',
                              commitment: '2-4 hours / week',
                              category: m.actionOrg.category
                            });
                          }
                          setIsOpen(false);
                        }}
                        className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] text-center shadow-2xs cursor-pointer"
                      >
                        Start a Chapter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs w-max animate-in fade-in">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask about organizations, chapters, or roles..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 text-xs bg-slate-50 font-medium text-slate-900"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
