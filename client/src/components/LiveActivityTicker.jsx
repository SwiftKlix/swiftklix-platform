import React, { useState, useEffect } from 'react';

export default function LiveActivityTicker({ chapters = [], orgs = [], applications = [] }) {
  const dynamicActivities = [];

  (chapters || []).forEach((c) => {
    if (c.leadName && c.orgName) {
      dynamicActivities.push({
        text: `${c.leadName} chartered ${c.orgName} (${c.targetLocation || 'Local Chapter'}) with ${c.activeMembers || 1} active members`,
        time: "Active"
      });
    }
  });

  (orgs || []).forEach((o) => {
    if (o.name) {
      dynamicActivities.push({
        text: `${o.name} is verified on SwiftKlix • ${o.category || 'Non-Profit'}`,
        time: "Verified"
      });
    }
  });

  const baseActivities = [
    { text: "SwiftKlix Network: Scale your non-profit or student club with local university & city branches", time: "Live" },
    { text: "Verified 501(c)(3) legal toolkits, meeting guidelines, and candidate screening pipelines", time: "Live" },
    { text: "Connect with passionate changemakers to launch chapters in your community", time: "Live" }
  ];

  const activities = dynamicActivities.length > 0 ? [...dynamicActivities, ...baseActivities] : baseActivities;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activities.length]);

  const current = activities[currentIndex] || activities[0];

  return (
    <div className="bg-blue-900 text-blue-100 px-4 py-2 text-xs font-medium border-b border-blue-950 flex items-center justify-center">
      <div className="flex items-center gap-2 max-w-4xl truncate">
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 shrink-0">Live Network:</span>
        <span className="truncate text-white font-medium">{current?.text}</span>
        <span className="text-blue-400 text-[11px] shrink-0 font-mono">({current?.time})</span>
      </div>
    </div>
  );
}

