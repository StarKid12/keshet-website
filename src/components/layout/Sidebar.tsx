"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PRIVATE_NAV_ITEMS, SITE_NAME, RAINBOW_COLORS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

const icons: Record<string, React.ReactNode> = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  camera: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  mail: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  chat: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
};

const navColors = [
  RAINBOW_COLORS[0], // home - red
  RAINBOW_COLORS[1], // photos - orange
  RAINBOW_COLORS[3], // schedule - green
  RAINBOW_COLORS[4], // messages - blue
  RAINBOW_COLORS[6], // chat - violet
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useUser();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-gradient-to-b from-sand-800 to-sand-900 text-white">
      {/* Rainbow stripe at top */}
      <div className="flex h-1.5 shrink-0">
        {RAINBOW_COLORS.map((color, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>

      {/* Header */}
      <div className="p-5 pb-4">
        <Link href="/" className="flex items-center gap-3">
          <img src="/images/logo-circle.png" alt={SITE_NAME} className="h-11 rounded-lg" />
          <div>
            <div className="font-bold text-sm">קשת</div>
            <div className="text-xs text-sand-400">האזור האישי</div>
          </div>
        </Link>
        {profile && (
          <div className="mt-4 bg-white/10 rounded-xl p-3">
            <p className="text-sm font-medium truncate">
              {profile.full_name || profile.email}
            </p>
            <p className="text-xs text-sand-400 mt-0.5">
              {profile.role === "admin" ? "מנהל/ת" : profile.role === "teacher" ? "מורה" : profile.role === "student" ? "תלמיד/ה" : "הורה"}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {PRIVATE_NAV_ITEMS.map((item, index) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`/${item.href.split("/")[1]}`));
          const color = navColors[index % navColors.length];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 mx-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white/15 shadow-lg"
                  : "hover:bg-white/10"
              }`}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: isActive ? color : "rgba(255,255,255,0.1)" }}
              >
                {icons[item.icon]}
              </span>
              {item.label}
              {isActive && (
                <div
                  className="w-1.5 h-1.5 rounded-full ms-auto"
                  style={{ backgroundColor: color }}
                />
              )}
            </Link>
          );
        })}

        {/* Admin link */}
        {profile?.role === "admin" && (
          <>
            <div className="mx-5 my-3 border-t border-white/10" />
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-5 py-3 mx-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                pathname.startsWith("/admin")
                  ? "bg-white/15 shadow-lg"
                  : "hover:bg-white/10"
              }`}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: pathname.startsWith("/admin") ? RAINBOW_COLORS[5] : "rgba(255,255,255,0.1)" }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              ניהול
            </Link>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-sand-300 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          התנתקות
        </button>
      </div>
    </aside>
  );
}
