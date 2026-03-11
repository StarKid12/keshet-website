"use client";

import { useState } from "react";

interface ContentSectionProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function ContentSection({
  title,
  description,
  defaultOpen = true,
  children,
}: ContentSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-sand-50 transition-colors"
      >
        <div className="text-start">
          <h3 className="font-bold text-sand-900">{title}</h3>
          {description && (
            <p className="text-sm text-sand-500 mt-0.5">{description}</p>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-sand-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
}
