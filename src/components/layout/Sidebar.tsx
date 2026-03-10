"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PRIVATE_NAV_ITEMS, SITE_NAME } from "@/lib/constants";
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
    <aside className="w-64 bg-white border-e border-sand-200 h-screen sticky top-0 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sand-200">
        <Link href="/">
          <img src="/images/logo.png" alt={SITE_NAME} className="h-10" />
        </Link>
        {profile && (
          <p className="text-sm text-sand-500 mt-1 truncate">
            שלום, {profile.full_name || profile.email}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {PRIVATE_NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(`/${item.href.split("/")[1]}`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary-700 bg-primary-50"
                  : "text-sand-600 hover:text-sand-900 hover:bg-sand-50"
              }`}
            >
              <span className={isActive ? "text-primary-600" : "text-sand-400"}>
                {icons[item.icon]}
              </span>
              {item.label}
            </Link>
          );
        })}

        {/* Admin link */}
        {profile?.role === "admin" && (
          <>
            <div className="mx-4 my-3 border-t border-sand-200" />
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "text-primary-700 bg-primary-50"
                  : "text-sand-600 hover:text-sand-900 hover:bg-sand-50"
              }`}
            >
              <svg className="w-5 h-5 text-sand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              ניהול
            </Link>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sand-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm text-sand-600 hover:text-sand-900 hover:bg-sand-50 transition-colors"
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
