"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { RAINBOW_COLORS } from "@/lib/constants";

const quickLinks = [
  { label: "תמונות כיתה", href: "/photos", color: RAINBOW_COLORS[0], icon: "📸" },
  { label: "מערכת שעות", href: "/schedule", color: RAINBOW_COLORS[3], icon: "📅" },
  { label: "הודעות", href: "/messages", color: RAINBOW_COLORS[4], icon: "📬" },
  { label: "צ׳אט כיתתי", href: "/chat", color: RAINBOW_COLORS[6], icon: "💬" },
];

export default function DashboardPage() {
  const { profile, loading } = useUser();

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-sand-200 rounded-lg w-64" />
        <div className="h-40 bg-sand-200 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-sand-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">
          שלום, {profile?.full_name || "אורח/ת"} 👋
        </h1>
        <p className="text-sand-500 mt-1">ברוכים הבאים לאזור האישי של קשת</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-2xl p-5 shadow-sm border border-sand-200
              hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
          >
            <span className="text-3xl mb-3 block">{link.icon}</span>
            <span className="text-sm font-medium text-sand-800">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcements */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200">
          <h2 className="text-lg font-bold text-sand-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-rainbow-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            הודעות אחרונות
          </h2>
          <div className="space-y-3">
            <div className="text-sand-500 text-sm text-center py-6">
              אין הודעות חדשות
            </div>
          </div>
          <Link
            href="/messages"
            className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-4 font-medium"
          >
            לכל ההודעות
          </Link>
        </div>

        {/* Recent Photos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200">
          <h2 className="text-lg font-bold text-sand-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-rainbow-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            תמונות אחרונות
          </h2>
          <div className="text-sand-500 text-sm text-center py-6">
            אין תמונות חדשות
          </div>
          <Link
            href="/photos"
            className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-4 font-medium"
          >
            לכל התמונות
          </Link>
        </div>
      </div>
    </div>
  );
}
