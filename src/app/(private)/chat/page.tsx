"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useUser } from "@/hooks/useUser";
import { useChat } from "@/hooks/useChat";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { RAINBOW_COLORS } from "@/lib/constants";

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return RAINBOW_COLORS[Math.abs(hash) % RAINBOW_COLORS.length];
}

interface ClassInfo {
  id: string;
  name: string;
}

export default function ChatPage() {
  const { user, profile } = useUser();
  const [myClasses, setMyClasses] = useState<ClassInfo[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classesLoading, setClassesLoading] = useState(true);

  const { messages, loading, sendMessage } = useChat(
    selectedClassId,
    user?.id || null
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Resolve classes for the user
  useEffect(() => {
    if (!user || !profile) return;

    async function fetchClasses() {
      const supabase = createClient();
      const classes: ClassInfo[] = [];

      // Get classes from junction table (students/parents with multi-class)
      const { data: scData } = await supabase
        .from("student_classes")
        .select("class_id")
        .eq("student_id", user!.id);
      if (scData && scData.length > 0) {
        const classIds = scData.map((sc) => sc.class_id);
        const { data } = await supabase
          .from("classes")
          .select("id, name")
          .in("id", classIds);
        if (data) classes.push(...data);
      }

      // Fallback: get class from profile.class_id if not already found
      if (profile!.class_id && !classes.find((c) => c.id === profile!.class_id)) {
        const { data } = await supabase
          .from("classes")
          .select("id, name")
          .eq("id", profile!.class_id)
          .single();
        if (data) classes.push(data);
      }

      // For teachers/admins, also get classes they teach
      if (profile!.role === "teacher" || profile!.role === "admin") {
        const { data } = await supabase
          .from("classes")
          .select("id, name")
          .eq("teacher_id", user!.id);
        if (data) {
          for (const c of data) {
            if (!classes.find((existing) => existing.id === c.id)) {
              classes.push(c);
            }
          }
        }
      }

      setMyClasses(classes);
      if (classes.length > 0) {
        setSelectedClassId(classes[0].id);
      }
      setClassesLoading(false);
    }

    fetchClasses();
  }, [user, profile]);

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

  if (profile?.role === "parent") {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
          <svg className="w-16 h-16 text-sand-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-lg font-medium text-sand-700 mb-2">צ׳אט כיתתי</h3>
          <p className="text-sand-500">הצ׳אט הכיתתי זמין לתלמידים וצוות בלבד.</p>
        </div>
      </div>
    );
  }

  if (!classesLoading && myClasses.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
          <svg className="w-16 h-16 text-sand-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-lg font-medium text-sand-700 mb-2">צ׳אט כיתתי</h3>
          <p className="text-sand-500">עדיין לא שויכת לכיתה. פנה למנהל המערכת.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-sand-900">צ׳אט כיתתי</h1>
        {myClasses.length > 1 ? (
          <div className="flex gap-2 mt-2 flex-wrap">
            {myClasses.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedClassId === cls.id
                    ? "bg-primary-600 text-white"
                    : "bg-sand-100 text-sand-600 hover:bg-sand-200"
                }`}
              >
                {cls.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sand-500 text-sm">שיחה עם חברי הכיתה</p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading || classesLoading ? (
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
                    {/* Avatar */}
                    {!isOwn && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: getAvatarColor(senderName) }}
                      >
                        {senderName.charAt(0)}
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        isOwn
                          ? "bg-primary-600 text-white rounded-bl-md"
                          : "bg-sand-100 text-sand-900 rounded-br-md"
                      }`}
                    >
                      {!isOwn && (
                        <p
                          className="text-xs font-medium mb-1"
                          style={{ color: getAvatarColor(senderName) }}
                        >
                          {senderName}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <time
                        className={`text-xs mt-1 block ${
                          isOwn ? "text-white/60" : "text-sand-400"
                        }`}
                      >
                        {new Intl.DateTimeFormat("he-IL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(message.created_at))}
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
        <form
          onSubmit={handleSend}
          className="border-t border-sand-200 p-3 flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="כתבו הודעה..."
            className="flex-1 px-4 py-2.5 rounded-full bg-sand-50 border border-sand-200
              focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none
              text-sm text-sand-900 placeholder:text-sand-400"
          />
          <Button type="submit" size="sm" className="rounded-full px-4" disabled={!input.trim()}>
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );
}
