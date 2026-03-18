"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { RAINBOW_COLORS } from "@/lib/constants";
import { PollCard, Poll } from "@/components/committees/PollCard";

const allQuickLinks = [
  { label: "תמונות כיתה", href: "/photos", color: RAINBOW_COLORS[1], icon: "📸", bg: "from-orange-50 to-amber-50", parentVisible: true },
  { label: "מערכת שעות", href: "/schedule", color: RAINBOW_COLORS[3], icon: "📅", bg: "from-green-50 to-emerald-50", parentVisible: false },
  { label: "הודעות", href: "/messages", color: RAINBOW_COLORS[4], icon: "📬", bg: "from-blue-50 to-sky-50", parentVisible: true },
  { label: "צ׳אט כיתתי", href: "/chat", color: RAINBOW_COLORS[6], icon: "💬", bg: "from-purple-50 to-violet-50", parentVisible: false },
];

interface ActivePollWithMeta {
  poll: Poll;
  committee_name: string;
  is_member: boolean;
}

interface RecentMessage {
  id: string;
  subject: string | null;
  body: string;
  type: string;
  created_at: string;
  sender_id: string | null;
}

interface RecentPhoto {
  id: string;
  url: string;
  caption: string | null;
  created_at: string;
  album_id: string;
}

export default function DashboardPage() {
  const { user, profile, loading } = useUser();
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<RecentPhoto[]>([]);
  const [activePolls, setActivePolls] = useState<ActivePollWithMeta[]>([]);
  const [className, setClassName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecent() {
      const supabase = createClient();

      const [messagesRes, photosRes, pollsRes] = await Promise.all([
        supabase
          .from("messages")
          .select("id, subject, body, type, created_at, sender_id")
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("photos")
          .select("id, url, caption, created_at, album_id")
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("committee_polls")
          .select("id, question, committee_id, creator_id, target_roles, is_open, closed_at, created_at, creator:profiles!creator_id(full_name), committees!committee_id(name)")
          .eq("is_open", true)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setRecentMessages(messagesRes.data || []);
      setRecentPhotos(photosRes.data || []);

      // Fetch class name
      const { data: profileData } = await supabase
        .from("profiles")
        .select("class_id")
        .eq("id", user!.id)
        .single();
      if (profileData?.class_id) {
        const { data: classData } = await supabase
          .from("classes")
          .select("name")
          .eq("id", profileData.class_id)
          .single();
        if (classData) setClassName(classData.name);
      }

      const rawPolls = pollsRes.data || [];
      if (rawPolls.length > 0 && user) {
        // Check which committees the user is a member of
        const committeeIds = [...new Set(rawPolls.map((p: Record<string, unknown>) => p.committee_id as string))];
        const { data: memberships } = await supabase
          .from("committee_members")
          .select("committee_id")
          .eq("user_id", user.id)
          .in("committee_id", committeeIds);
        const memberCommitteeIds = new Set((memberships || []).map((m: { committee_id: string }) => m.committee_id));

        const polls: ActivePollWithMeta[] = rawPolls.map((p: Record<string, unknown>) => ({
          poll: {
            id: p.id as string,
            committee_id: p.committee_id as string,
            creator_id: p.creator_id as string,
            question: p.question as string,
            target_roles: p.target_roles as string[],
            is_open: p.is_open as boolean,
            closed_at: p.closed_at as string | null,
            created_at: p.created_at as string,
            creator: p.creator as { full_name: string | null } | undefined,
          },
          committee_name: (p.committees as { name: string } | null)?.name || "",
          is_member: memberCommitteeIds.has(p.committee_id as string),
        }));
        setActivePolls(polls);
      } else {
        setActivePolls([]);
      }
    }

    fetchRecent();
  }, [user]);

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
    <div>
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
            {profile?.full_name || user?.user_metadata?.full_name || profile?.email?.split("@")[0] || "אורח/ת"} 👋
          </h1>
          <p className="text-white/70 mt-2 text-sm">
            ברוכים הבאים לאזור האישי של קשת
            {className && (
              <span className="inline-block bg-white/15 rounded-lg px-2.5 py-0.5 ms-2 text-white/90 font-medium">
                {className}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Admin Link */}
      {profile?.role === "admin" && (
        <Link
          href="/admin"
          className="flex items-center gap-4 bg-gradient-to-l from-sand-900 to-sand-800 rounded-2xl p-5 mb-8 text-white hover:shadow-lg transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0 group-hover:bg-white/20 transition-colors">
            ⚙️
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm">לוח ניהול</h3>
            <p className="text-xs text-sand-300">ניהול משתמשים, בלוג, אירועים והודעות</p>
          </div>
          <svg className="w-5 h-5 text-sand-400 shrink-0 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {allQuickLinks.filter((link) => profile?.role !== "parent" || link.parentVisible).map((link) => (
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

      {/* Active Polls */}
      {activePolls.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${RAINBOW_COLORS[5]}20` }}
            >
              <svg className="w-4 h-4" style={{ color: RAINBOW_COLORS[5] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="font-bold text-sand-900">סקרים פעילים</h2>
          </div>
          <div className="space-y-4">
            {activePolls.map(({ poll, committee_name, is_member }) => (
              <div key={poll.id}>
                <p className="text-xs text-sand-400 mb-1.5 px-1">{committee_name}</p>
                <PollCard
                  poll={poll}
                  userId={user!.id}
                  isCommitteeMember={is_member}
                  canClose={profile?.role === "admin" || poll.creator_id === user!.id}
                  onPollUpdated={() => setActivePolls((prev) => prev.filter((p) => p.poll.id !== poll.id))}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
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
            {recentMessages.length === 0 ? (
              <div className="text-sand-400 text-sm text-center py-8">
                <div className="text-3xl mb-2">📭</div>
                אין הודעות חדשות
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <Link
                    key={msg.id}
                    href="/messages"
                    className="block p-3 rounded-xl hover:bg-sand-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                        style={{ backgroundColor: msg.type === "announcement" ? RAINBOW_COLORS[4] : RAINBOW_COLORS[3] }}
                      >
                        {msg.type === "announcement" ? "📢" : "✉️"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-sand-900 truncate">
                          {msg.subject || "הודעה"}
                        </p>
                        <p className="text-xs text-sand-500 truncate mt-0.5">{msg.body}</p>
                        <p className="text-xs text-sand-400 mt-1">
                          {new Date(msg.created_at).toLocaleDateString("he-IL")}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
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
            {recentPhotos.length === 0 ? (
              <div className="text-sand-400 text-sm text-center py-8">
                <div className="text-3xl mb-2">🖼️</div>
                אין תמונות חדשות
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {recentPhotos.map((photo) => (
                  <Link
                    key={photo.id}
                    href="/photos"
                    className="relative aspect-square rounded-xl overflow-hidden group"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || "תמונה"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {photo.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs text-white truncate">{photo.caption}</p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
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
