"use client";

import type { ActiveTab } from "@/types";

interface TabSwitcherProps {
  active: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}

const TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "compress",
    label: "Compress",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    ),
  },
  {
    id: "convert",
    label: "Convert",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
];

export default function TabSwitcher({ active, onChange }: TabSwitcherProps) {
  return (
    <div className="flex gap-1 rounded-xl bg-brand-light p-1" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={[
            "flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200",
            active === tab.id
              ? "bg-brand text-white shadow-sm"
              : "text-brand hover:bg-brand/10",
          ].join(" ")}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
