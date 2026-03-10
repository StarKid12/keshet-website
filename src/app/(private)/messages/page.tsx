"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { RAINBOW_COLORS } from "@/lib/constants";

interface Message {
  id: string;
  type: "announcement" | "direct";
  subject: string | null;
  body: string;
  is_pinned: boolean;
  created_at: string;
  sender: {
    full_name: string | null;
    role: string;
  } | null;
}

export default function MessagesPage() {
  const { profile } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      const supabase = createClient();

      // Fetch announcements for user's class or school-wide
      const { data } = await supabase
        .from("messages")
        .select(`
          id, type, subject, body, is_pinned, created_at,
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">הודעות</h1>
        <p className="text-sand-500 mt-1">הודעות והכרזות מבית הספר</p>
      </div>

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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
