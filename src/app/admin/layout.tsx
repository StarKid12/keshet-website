"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { RAINBOW_COLORS, SITE_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const adminNav = [
  { label: "סקירה כללית", href: "/admin", icon: "📊", color: RAINBOW_COLORS[0] },
  { label: "משתמשים", href: "/admin/users", icon: "👥", color: RAINBOW_COLORS[1] },
  { label: "מיילים מאושרים", href: "/admin/approved-emails", icon: "📧", color: RAINBOW_COLORS[2] },
  { label: "בלוג", href: "/admin/blog", icon: "✍️", color: RAINBOW_COLORS[3] },
  { label: "אירועים", href: "/admin/events", icon: "📅", color: RAINBOW_COLORS[4] },
  { label: "כיתות", href: "/admin/classes", icon: "🏫", color: RAINBOW_COLORS[5] },
  { label: "הודעות", href: "/admin/messages", icon: "📢", color: RAINBOW_COLORS[6] },
  { label: "ניהול תוכן", href: "/admin/content", icon: "📝", color: RAINBOW_COLORS[0] },
  { label: "ועדות", href: "/admin/committees", icon: "🏛️", color: RAINBOW_COLORS[1] },
  { label: "מערכת שעות", href: "/admin/timetable", icon: "🕐", color: RAINBOW_COLORS[2] },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="animate-pulse text-sand-400">טוען...</div>
      </div>
    );
  }

  if (!profile || profile.role !== "admin") {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-sand-200 p-8 text-center max-w-md">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-sand-900 mb-2">אין הרשאה</h1>
          <p className="text-sand-500 mb-6">הגישה לדף זה מוגבלת למנהלים בלבד.</p>
          <Link
            href="/dashboard"
            className="inline-block bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            חזרה ללוח הבקרה
          </Link>
        </div>
      </div>
    );
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className="fixed top-0 bottom-0 z-50 hidden lg:flex w-64 flex-col bg-gradient-to-b from-sand-900 to-black text-white"
        style={{ right: 0 }}
      >
        {/* Rainbow stripe */}
        <div className="flex h-1.5 shrink-0">
          {RAINBOW_COLORS.map((color, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>

        {/* Header */}
        <div className="p-5 pb-4">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
              ⚙️
            </div>
            <div>
              <div className="font-bold text-sm">{SITE_NAME} - ניהול</div>
              <div className="text-xs text-sand-400">לוח בקרה למנהלים</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {adminNav.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3 mx-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive ? "bg-white/15 shadow-lg" : "hover:bg-white/10"
                }`}
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                  style={{ backgroundColor: isActive ? item.color : "rgba(255,255,255,0.1)" }}
                >
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full ms-auto" style={{ backgroundColor: item.color }} />
                )}
              </Link>
            );
          })}
          <div className="mx-5 my-3 border-t border-white/10" />
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-5 py-3 mx-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-all"
          >
            <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10">
              🏠
            </span>
            חזרה לאזור האישי
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-sand-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            התנתקות
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <aside
        className="fixed top-0 bottom-0 z-50 lg:hidden w-64 flex flex-col bg-gradient-to-b from-sand-900 to-black text-white transition-all duration-300"
        style={{ right: sidebarOpen ? 0 : "-16rem" }}
      >
        <div className="flex h-1.5 shrink-0">
          {RAINBOW_COLORS.map((color, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>
        <div className="p-5 flex items-center justify-between">
          <span className="font-bold text-sm">ניהול {SITE_NAME}</span>
          <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
          {adminNav.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-5 py-3 mx-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "bg-white/15" : "hover:bg-white/10"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
          <div className="mx-5 my-3 border-t border-white/10" />
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-5 py-3 mx-3 rounded-xl text-sm hover:bg-white/10">
            <span>🏠</span> חזרה לאזור האישי
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:pr-64">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 bg-sand-50/80 backdrop-blur-sm border-b border-sand-200/50 px-4 py-3 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl bg-white shadow-sm border border-sand-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-sand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-bold text-sand-700">ניהול {SITE_NAME}</span>
        </div>

        <main className="p-5 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
