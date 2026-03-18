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

async function fetchSenderInfo(supabase: ReturnType<typeof createClient>, senderId: string) {
  const { data } = await supabase.rpc("get_profile_display", { user_id: senderId });
  if (data && data.length > 0) {
    return { full_name: data[0].full_name, avatar_url: data[0].avatar_url };
  }
  return undefined;
}

export function useChat(classId: string | null, userId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const supabaseRef = useRef(createClient());

  // Fetch initial messages
  useEffect(() => {
    if (!classId) return;

    async function fetchMessages() {
      // Fetch messages without joining profiles (to avoid RLS issues)
      const { data } = await supabaseRef.current
        .from("chat_messages")
        .select("id, class_id, sender_id, content, created_at")
        .eq("class_id", classId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (!data || data.length === 0) {
        setMessages([]);
        setLoading(false);
        return;
      }

      // Fetch sender info for all unique senders via RPC
      const uniqueSenderIds = [...new Set(data.map((m) => m.sender_id))];
      const senderMap = new Map<string, { full_name: string | null; avatar_url: string | null }>();

      await Promise.all(
        uniqueSenderIds.map(async (senderId) => {
          const info = await fetchSenderInfo(supabaseRef.current, senderId);
          if (info) senderMap.set(senderId, info);
        })
      );

      const messagesWithSenders: ChatMessage[] = data.map((m) => ({
        ...m,
        sender: senderMap.get(m.sender_id),
      }));

      setMessages(messagesWithSenders);
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
          const sender = await fetchSenderInfo(supabaseRef.current, payload.new.sender_id);

          const newMessage: ChatMessage = {
            ...(payload.new as ChatMessage),
            sender,
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
