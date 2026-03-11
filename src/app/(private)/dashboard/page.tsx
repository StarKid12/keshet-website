"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { RAINBOW_COLORS } from "@/lib/constants";

const quickLinks = [
  { label: "תמונות כיתה", href: "/photos", color: RAINBOW_COLORS[1], icon: "📸", bg: "from-orange-50 to-amber-50" },
  { label: "מערכת שעות", href: "/schedule", color: RAINBOW_COLORS[3], icon: "📅", bg: "from-green-50 to-emerald-50" },
  { label: "הודעות", href: "/messages", color: RAINBOW_COLORS[4], icon: "📬", bg: "from-blue-50 to-sky-50" },
  { label: "צ׳אט כיתתי", href: "/chat", color: RAINBOW_COLORS[6], icon: "💬", bg: "from-purple-50 to-violet-50" },
];

export default function DashboardPage() {
  const { profile, loading } = useUser();

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-sand-200 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-sand-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "בוקר טוב";
    if (hour < 17) return "צהריים טובים";
    return "ערב טוב";
  })();

  return (
    <div className="max-w-5xl">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 mb-8 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${RAINBOW_COLORS[4]}, ${RAINBOW_COLORS[5]}, ${RAINBOW_COLORS[6]})`,
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 end-0 w-40 h-40 rounded-full opacity-20"
          style={{ background: "white", transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 start-0 w-24 h-24 rounded-full opacity-10"
          style={{ background: "white", transform: "translate(-30%, 30%)" }}
        />
        <div className="relative">
          <p className="text-white/80 text-sm mb-1">{greeting}</p>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {profile?.full_name || "אורח/ת"} 👋
          </h1>
          <p className="text-white/70 mt-2 text-sm">ברוכים הבאים לאזור האישי של קשת</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`bg-gradient-to-br ${link.bg} rounded-2xl p-5
              border border-sand-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group`}
          >
            <div
              className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl
                group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: `${link.color}20` }}
            >
              {link.icon}
            </div>
            <span className="text-sm font-semibold text-sand-800">{link.label}</span>
            <div
              className="w-8 h-1 rounded-full mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: link.color }}
            />
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcements */}
        <div className="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-sand-100 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${RAINBOW_COLORS[4]}20` }}
            >
              <svg className="w-4 h-4" style={{ color: RAINBOW_COLORS[4] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
            <h2 className="font-bold text-sand-900">הודעות אחרונות</h2>
          </div>
          <div className="p-6">
            <div className="text-sand-400 text-sm text-center py-8">
              <div className="text-3xl mb-2">📭</div>
              אין הודעות חדשות
            </div>
          </div>
          <div className="px-6 py-3 bg-sand-50 border-t border-sand-100">
            <Link
              href="/messages"
              className="text-sm font-medium hover:underline flex items-center gap-1 justify-center"
              style={{ color: RAINBOW_COLORS[4] }}
            >
              לכל ההודעות
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Recent Photos */}
        <div className="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-sand-100 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${RAINBOW_COLORS[1]}20` }}
            >
              <svg className="w-4 h-4" style={{ color: RAINBOW_COLORS[1] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-bold text-sand-900">תמונות אחרונות</h2>
          </div>
          <div className="p-6">
            <div className="text-sand-400 text-sm text-center py-8">
              <div className="text-3xl mb-2">🖼️</div>
              אין תמונות חדשות
            </div>
          </div>
          <div className="px-6 py-3 bg-sand-50 border-t border-sand-100">
            <Link
              href="/photos"
              className="text-sm font-medium hover:underline flex items-center gap-1 justify-center"
              style={{ color: RAINBOW_COLORS[1] }}
            >
              לכל התמונות
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
