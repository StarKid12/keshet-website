"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface ChatMessage {
  id: string;
  class_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function useChat(classId: string | null, userId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const supabaseRef = useRef(createClient());

  // Fetch initial messages
  useEffect(() => {
    if (!classId) return;

    async function fetchMessages() {
      const { data } = await supabaseRef.current
        .from("chat_messages")
        .select(`
          id, class_id, sender_id, content, created_at,
          sender:profiles!sender_id(full_name, avatar_url)
        `)
        .eq("class_id", classId)
        .order("created_at", { ascending: true })
        .limit(100);

      setMessages((data as unknown as ChatMessage[]) || []);
      setLoading(false);
    }

    fetchMessages();
  }, [classId]);

  // Subscribe to realtime
  useEffect(() => {
    if (!classId) return;

    const channel = supabaseRef.current
      .channel(`chat-${classId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `class_id=eq.${classId}`,
        },
        async (payload) => {
          // Fetch sender info for the new message
          const { data: sender } = await supabaseRef.current
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", payload.new.sender_id)
            .single();

          const newMessage: ChatMessage = {
            ...(payload.new as ChatMessage),
            sender: sender || undefined,
          };

          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabaseRef.current.removeChannel(channel);
    };
  }, [classId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!classId || !userId || !content.trim()) return;

      await supabaseRef.current.from("chat_messages").insert({
        class_id: classId,
        sender_id: userId,
        content: content.trim(),
      });
    },
    [classId, userId]
  );

  return { messages, loading, sendMessage };
}
