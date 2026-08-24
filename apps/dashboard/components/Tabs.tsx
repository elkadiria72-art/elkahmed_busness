"use client";

import { cn } from "@/lib/utils";

export type TabKey = string;

interface TabsProps {
  tabs: TabKey[];
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex overflow-x-auto border-b border-neutral-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
            active === tab
              ? "border-accent text-primary"
              : "border-transparent text-neutral-500 hover:border-neutral-200 hover:text-primary"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
