"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { RAINBOW_COLORS } from "@/lib/constants";

const BG_TINTS: Record<string, string> = {
  default: "",
  "#e74c3c": "#fef2f2", // red
  "#f39c12": "#fffbeb", // orange
  "#f1c40f": "#fefce8", // yellow
  "#27ae60": "#f0fdf4", // green
  "#2980b9": "#eff6ff", // blue
  "#5b4dbd": "#f5f3ff", // indigo
  "#8e44ad": "#faf5ff", // violet
};

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bgColor, setBgColor] = useState("default");

  useEffect(() => {
    const saved = localStorage.getItem("keshet-bg-color");
    if (saved && BG_TINTS[saved]) setBgColor(saved);
  }, []);

  function handleColorChange(color: string) {
    setBgColor(color);
    localStorage.setItem("keshet-bg-color", color);
  }

  const bgStyle = bgColor !== "default" && BG_TINTS[bgColor]
    ? { backgroundColor: BG_TINTS[bgColor] }
    : undefined;

  return (
    <div className="min-h-screen bg-sand-50" style={bgStyle}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - physically on the right */}
      <div
        className="fixed top-0 bottom-0 z-50 hidden lg:block"
        style={{ right: 0 }}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          bgColor={bgColor}
          onColorChange={handleColorChange}
        />
      </div>

      {/* Mobile sidebar - slides from right */}
      <div
        className="fixed top-0 bottom-0 z-50 lg:hidden transition-all duration-300"
        style={{
          right: sidebarOpen ? 0 : "-16rem",
        }}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          bgColor={bgColor}
          onColorChange={handleColorChange}
        />
      </div>

      {/* Main content */}
      <div className="lg:pr-64">
        {/* Top bar with toggle - mobile only */}
        <div
          className="sticky top-0 z-30 backdrop-blur-sm border-b border-sand-200/50 px-4 py-3 flex items-center gap-3 lg:hidden"
          style={{ backgroundColor: BG_TINTS[bgColor] ? `${BG_TINTS[bgColor]}cc` : undefined }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl bg-white shadow-sm border border-sand-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-sand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex h-1 flex-1 rounded-full overflow-hidden">
            {RAINBOW_COLORS.map((color, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>

        <main className="p-5 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
