"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { RAINBOW_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Message {
  id: string;
  type: "announcement" | "direct";
  subject: string | null;
  body: string;
  is_pinned: boolean;
  created_at: string;
  sender_id: string;
  sender: {
    full_name: string | null;
    role: string;
  } | null;
}

export default function MessagesPage() {
  const { user, profile } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New message form state
  const [newSubject, setNewSubject] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newIsPinned, setNewIsPinned] = useState(false);

  const isTeacherOrAdmin = profile?.role === "teacher" || profile?.role === "admin";

  useEffect(() => {
    async function fetchMessages() {
      const supabase = createClient();

      // Fetch announcements for user's class or school-wide
      const { data } = await supabase
        .from("messages")
        .select(`
          id, type, subject, body, is_pinned, created_at, sender_id,
          sender:profiles!sender_id(full_name, role)
        `)
        .eq("type", "announcement")
        .or(`class_id.is.null,class_id.eq.${profile?.class_id}`)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      setMessages((data as unknown as Message[]) || []);
      setLoading(false);
    }

    if (profile) {
      fetchMessages();
    }
  }, [profile]);

  async function handleCreateMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile || !newBody.trim()) return;

    setCreating(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("messages")
      .insert({
        type: "announcement" as const,
        subject: newSubject.trim() || null,
        body: newBody.trim(),
        is_pinned: newIsPinned,
        sender_id: user.id,
        class_id: profile.role === "admin" ? null : profile.class_id,
      })
      .select(`
        id, type, subject, body, is_pinned, created_at, sender_id,
        sender:profiles!sender_id(full_name, role)
      `)
      .single();

    if (!error && data) {
      setMessages((prev) => [data as unknown as Message, ...prev]);
      setNewSubject("");
      setNewBody("");
      setNewIsPinned(false);
      setShowForm(false);
    }

    setCreating(false);
  }

  async function handleDeleteMessage(messageId: string) {
    if (!confirm("האם למחוק את ההודעה?")) return;

    setDeletingId(messageId);
    const supabase = createClient();

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    }

    setDeletingId(null);
  }

  function canDelete(message: Message): boolean {
    if (!user || !profile) return false;
    if (profile.role === "admin") return true;
    if (profile.role === "teacher" && message.sender_id === user.id) return true;
    return false;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">הודעות</h1>
          <p className="text-sand-500 mt-1">הודעות והכרזות מבית הספר</p>
        </div>
        {isTeacherOrAdmin && (
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? "secondary" : "primary"}
            size="sm"
          >
            {showForm ? "ביטול" : "+ הודעה חדשה"}
          </Button>
        )}
      </div>

      {/* New Message Form */}
      {showForm && isTeacherOrAdmin && (
        <form
          onSubmit={handleCreateMessage}
          className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200 mb-8 space-y-4"
        >
          <h2 className="text-lg font-bold text-sand-900">הודעה חדשה</h2>
          {profile?.role === "admin" && (
            <p className="text-sm text-sand-500">
              ההודעה תישלח לכל בית הספר (כמנהל/ת)
            </p>
          )}
          <Input
            label="נושא"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="נושא ההודעה"
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-sand-700 mb-1.5">
              תוכן ההודעה
            </label>
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="כתוב/י את ההודעה כאן..."
              rows={4}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 placeholder:text-sand-400 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors duration-200"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newIsPinned}
              onChange={(e) => setNewIsPinned(e.target.checked)}
              className="w-4 h-4 rounded border-sand-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-sand-700">📌 נעוץ הודעה בראש הרשימה</span>
          </label>
          <div className="flex justify-end">
            <Button type="submit" disabled={creating || !newBody.trim()}>
              {creating ? "שולח..." : "שלח הודעה"}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-sand-200 rounded-2xl h-28" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
          <svg className="w-16 h-16 text-sand-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-sand-700 mb-2">אין הודעות</h3>
          <p className="text-sand-500">הודעות חדשות מבית הספר יופיעו כאן.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md ${
                message.is_pinned ? "border-primary-300 bg-primary-50/30" : "border-sand-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: RAINBOW_COLORS[index % RAINBOW_COLORS.length] }}
                >
                  {message.sender?.full_name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {message.is_pinned && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                        📌 נעוץ
                      </span>
                    )}
                    {message.subject && (
                      <h3 className="font-bold text-sand-900">{message.subject}</h3>
                    )}
                  </div>
                  <p className="text-sand-700 leading-relaxed">{message.body}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-sand-500">
                    <span>{message.sender?.full_name || "צוות"}</span>
                    <span>·</span>
                    <time>
                      {new Intl.DateTimeFormat("he-IL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(message.created_at))}
                    </time>
                  </div>
                </div>
                {canDelete(message) && (
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    disabled={deletingId === message.id}
                    className="shrink-0 p-2 text-sand-400 hover:text-rainbow-red hover:bg-rainbow-red/10 rounded-lg transition-colors disabled:opacity-50"
                    title="מחק הודעה"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
