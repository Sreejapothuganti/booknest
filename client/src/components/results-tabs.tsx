import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResultsTabsProps {
  tabs: {
    id: string;
    label: string;
    count: number;
  }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function ResultsTabs({ tabs, activeTab, onTabChange }: ResultsTabsProps) {
  return (
    <div className="mb-6">
      <div className="border-b border-slate-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "px-4 py-2 font-medium text-sm border-b-2",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "text-slate-500 border-transparent hover:border-slate-300 hover:text-slate-700"
              )}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default ResultsTabs;
