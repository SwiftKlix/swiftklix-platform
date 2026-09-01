import React, { useState, useEffect } from 'react';

export default function LiveActivityTicker() {
  const activities = [
    { text: "Marcus chartered EcoRoots Seattle Chapter with 25 founding members", time: "12m ago" },
    { text: "CodeNova awarded new weekend youth coding workshops in Boston", time: "34m ago" },
    { text: "Samira submitted a proposal to start a tree planting club at UT Austin", time: "1h ago" },
    { text: "HarvestShare volunteers rescued 120 dining hall meals in Chicago", time: "2h ago" },
    { text: "MindBridge trained 18 student peer facilitators at Michigan", time: "3h ago" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activities.length]);

  const current = activities[currentIndex];

  return (
    <div className="bg-blue-900 text-blue-100 px-4 py-2 text-xs font-medium border-b border-blue-950 flex items-center justify-center">
      <div className="flex items-center gap-2 max-w-4xl truncate">
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 shrink-0">Live Network:</span>
        <span className="truncate text-white font-medium">{current.text}</span>
        <span className="text-blue-400 text-[11px] shrink-0 font-mono">({current.time})</span>
      </div>
    </div>
  );
}

