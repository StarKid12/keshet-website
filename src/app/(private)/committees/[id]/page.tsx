"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useCommitteeChat } from "@/hooks/useCommitteeChat";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { RAINBOW_COLORS } from "@/lib/constants";
import { CommitteePolls } from "@/components/committees/CommitteePolls";
import Link from "next/link";

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return RAINBOW_COLORS[Math.abs(hash) % RAINBOW_COLORS.length];
}

interface Committee {
  id: string;
  name: string;
  description: string | null;
  teacher_id: string | null;
  can_create_polls: boolean;
}

interface Member {
  id: string;
  user_id: string;
  profile: { full_name: string | null; email: string; role: string };
}

interface SearchUser {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
}

export default function CommitteeChatPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { user, profile } = useUser();
  const { messages, loading: chatLoading, sendMessage } = useCommitteeChat(id, user?.id || null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "polls">(
    searchParams.get("tab") === "polls" ? "polls" : "chat"
  );
  const highlightPollId = searchParams.get("poll");

  const [committee, setCommittee] = useState<Committee | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Settings panel state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);

  const isTeacher = committee?.teacher_id === user?.id;
  const isAdmin = profile?.role === "admin";
  const canManage = isTeacher || isAdmin;

  // Fetch committee info and membership
  useEffect(() => {
    if (!id || !user) return;

    async function fetchCommittee() {
      const supabase = createClient();

      const { data: comm } = await supabase
        .from("committees")
        .select("id, name, description, teacher_id, can_create_polls")
        .eq("id", id)
        .single();

      if (comm) {
        setCommittee(comm);

        // Check membership
        const { data: membership } = await supabase
          .from("committee_members")
          .select("id")
          .eq("committee_id", id)
          .eq("user_id", user!.id)
          .maybeSingle();

        setIsMember(!!membership || comm.teacher_id === user!.id || profile?.role === "admin");
      }
      setLoading(false);
    }

    fetchCommittee();
  }, [id, user, profile?.role]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
    inputRef.current?.focus();
  }

  async function openSettings() {
    setSettingsOpen(true);
    setMembersLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("committee_members")
      .select("id, user_id, profile:profiles!user_id(full_name, email, role)")
      .eq("committee_id", id);

    setMembers((data as unknown as Member[]) || []);
    setMembersLoading(false);
  }

  async function searchUsers() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .eq("is_approved", true)
      .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
      .limit(20);

    // Filter out existing members
    const memberIds = new Set(members.map((m) => m.user_id));
    setSearchResults((data || []).filter((u) => !memberIds.has(u.id)));
    setSearching(false);
  }

  async function addMember(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("committee_members")
      .insert({ committee_id: id, user_id: userId })
      .select("id, user_id, profile:profiles!user_id(full_name, email, role)")
      .single();

    if (!error && data) {
      setMembers((prev) => [...prev, data as unknown as Member]);
      setSearchResults((prev) => prev.filter((u) => u.id !== userId));
    }
  }

  async function removeMember(membershipId: string, userId: string) {
    if (!confirm("להסיר את החבר מהועדה?")) return;
    const supabase = createClient();
    await supabase.from("committee_members").delete().eq("id", membershipId);
    setMembers((prev) => prev.filter((m) => m.id !== membershipId));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!committee) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium text-sand-700 mb-2">ועדה לא נמצאה</h3>
          <Link href="/committees" className="text-primary-600 hover:underline text-sm">
            חזרה לרשימת הועדות
          </Link>
        </div>
      </div>
    );
  }

  if (!isMember) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="text-lg font-medium text-sand-700 mb-2">אין הרשאה</h3>
          <p className="text-sand-500 mb-4">אינך חבר/ה בועדה זו.</p>
          <Link href="/committees" className="text-primary-600 hover:underline text-sm">
            חזרה לרשימת הועדות
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/committees"
            className="w-8 h-8 rounded-lg bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
          >
            <svg className="w-4 h-4 text-sand-600 -scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-sand-900">{committee.name}</h1>
            {committee.description && (
              <p className="text-sand-500 text-sm">{committee.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex bg-sand-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "chat"
                  ? "bg-white text-sand-900 shadow-sm"
                  : "text-sand-500 hover:text-sand-700"
              }`}
            >
              צ׳אט
            </button>
            <button
              onClick={() => setActiveTab("polls")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "polls"
                  ? "bg-white text-sand-900 shadow-sm"
                  : "text-sand-500 hover:text-sand-700"
              }`}
            >
              סקרים
            </button>
          </div>

          {canManage && (
            <button
              onClick={openSettings}
              className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
              title="הגדרות ועדה"
            >
              <svg className="w-5 h-5 text-sand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Polls Tab */}
      {activeTab === "polls" && (
        <div className="flex-1 overflow-y-auto pb-4">
          <CommitteePolls
            committeeId={id}
            userId={user!.id}
            isCommitteeMember={true}
            committeeTeacherId={committee.teacher_id}
            userRole={profile?.role || ""}
            canCreatePolls={committee.can_create_polls}
            highlightPollId={highlightPollId}
          />
        </div>
      )}

      {/* Chat Messages */}
      {activeTab === "chat" && (
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sand-400">
              <p>אין הודעות עדיין. התחילו שיחה!</p>
            </div>
          ) : (
            <>
              {messages.map((message) => {
                const isOwn = message.sender_id === user?.id;
                const senderName = message.sender?.full_name || "אנונימי";
                return (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
                  >
                    {!isOwn && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: getAvatarColor(senderName) }}
                      >
                        {senderName.charAt(0)}
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        isOwn
                          ? "bg-primary-600 text-white rounded-bl-md"
                          : "bg-sand-100 text-sand-900 rounded-br-md"
                      }`}
                    >
                      {!isOwn && (
                        <p className="text-xs font-medium mb-1" style={{ color: getAvatarColor(senderName) }}>
                          {senderName}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <time className={`text-xs mt-1 block ${isOwn ? "text-white/60" : "text-sand-400"}`}>
                        {new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit" }).format(new Date(message.created_at))}
                      </time>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="border-t border-sand-200 p-3 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="כתבו הודעה..."
            className="flex-1 px-4 py-2.5 rounded-full bg-sand-50 border border-sand-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm text-sand-900 placeholder:text-sand-400"
          />
          <Button type="submit" size="sm" className="rounded-full px-4" disabled={!input.trim()}>
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </form>
      </div>
      )}

      {/* Settings Panel (Slide-over) */}
      {settingsOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSettingsOpen(false)} />
          <div className="fixed top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col" style={{ left: 0 }}>
            {/* Panel Header */}
            <div className="p-5 border-b border-sand-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-sand-900">ניהול חברי ועדה</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className="w-8 h-8 rounded-lg bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
              >
                <svg className="w-4 h-4 text-sand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Members List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-sand-700 mb-3">
                  חברי הועדה ({members.length})
                </h3>
                {membersLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-sand-100 rounded-lg h-12" />
                    ))}
                  </div>
                ) : members.length === 0 ? (
                  <p className="text-sm text-sand-400">אין חברים בועדה עדיין</p>
                ) : (
                  <div className="space-y-2">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-sand-50">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: getAvatarColor(member.profile?.full_name || member.profile?.email || "") }}
                        >
                          {(member.profile?.full_name || member.profile?.email || "?").charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-sand-900 truncate">
                            {member.profile?.full_name || member.profile?.email}
                          </p>
                          <p className="text-xs text-sand-400">
                            {member.profile?.role === "teacher" ? "מורה" : member.profile?.role === "student" ? "תלמיד/ה" : member.profile?.role === "admin" ? "מנהל/ת" : "הורה"}
                          </p>
                        </div>
                        <button
                          onClick={() => removeMember(member.id, member.user_id)}
                          className="p-1.5 rounded-lg hover:bg-rainbow-red/10 transition-colors text-sand-400 hover:text-rainbow-red"
                          title="הסרה"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Members */}
              <div className="border-t border-sand-200 pt-4">
                <h3 className="text-sm font-medium text-sand-700 mb-3">הוספת חברים</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchUsers()}
                    placeholder="חיפוש לפי שם או אימייל..."
                    className="flex-1 px-3 py-2 rounded-lg border border-sand-300 bg-white text-sm text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                  />
                  <button
                    onClick={searchUsers}
                    disabled={searching || !searchQuery.trim()}
                    className="px-3 py-2 rounded-lg bg-primary-600 text-white text-sm hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {searching ? "..." : "חפש"}
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {searchResults.map((u) => (
                      <div key={u.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-sand-200 hover:bg-sand-50">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: getAvatarColor(u.full_name || u.email) }}
                        >
                          {(u.full_name || u.email).charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-sand-900 truncate">{u.full_name || u.email}</p>
                          <p className="text-xs text-sand-400">{u.email}</p>
                        </div>
                        <button
                          onClick={() => addMember(u.id)}
                          className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-600 text-xs font-medium hover:bg-primary-100 transition-colors"
                        >
                          הוספה
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
