"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface CommitteeChatMessage {
  id: string;
  committee_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function useCommitteeChat(committeeId: string | null, userId: string | null) {
  const [messages, setMessages] = useState<CommitteeChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const supabaseRef = useRef(createClient());

  // Fetch initial messages
  useEffect(() => {
    if (!committeeId) return;

    async function fetchMessages() {
      const { data, error } = await supabaseRef.current
        .from("committee_messages")
        .select(`
          id, committee_id, sender_id, content, created_at,
          sender:profiles!sender_id(full_name, avatar_url)
        `)
        .eq("committee_id", committeeId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) console.error("Failed to fetch committee messages:", error);
      setMessages((data as unknown as CommitteeChatMessage[]) || []);
      setLoading(false);
    }

    fetchMessages();
  }, [committeeId]);

  // Subscribe to realtime
  useEffect(() => {
    if (!committeeId) return;

    const channel = supabaseRef.current
      .channel(`committee-${committeeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "committee_messages",
          filter: `committee_id=eq.${committeeId}`,
        },
        async (payload) => {
          const { data: sender } = await supabaseRef.current
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", payload.new.sender_id)
            .single();

          const newMessage: CommitteeChatMessage = {
            ...(payload.new as CommitteeChatMessage),
            sender: sender || undefined,
          };

          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabaseRef.current.removeChannel(channel);
    };
  }, [committeeId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!committeeId || !userId || !content.trim()) return;

      const { error } = await supabaseRef.current.from("committee_messages").insert({
        committee_id: committeeId,
        sender_id: userId,
        content: content.trim(),
      });
      if (error) console.error("Failed to send committee message:", error);
    },
    [committeeId, userId]
  );

  return { messages, loading, sendMessage };
}
