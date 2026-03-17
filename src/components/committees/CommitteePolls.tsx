"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PollCard, Poll } from "./PollCard";
import { CreatePollModal } from "./CreatePollModal";

interface CommitteePollsProps {
  committeeId: string;
  userId: string;
  isCommitteeMember: boolean;
  committeeTeacherId: string | null;
  userRole: string;
  canCreatePolls: boolean;
  highlightPollId?: string | null;
}

export function CommitteePolls({
  committeeId,
  userId,
  isCommitteeMember,
  committeeTeacherId,
  userRole,
  canCreatePolls,
  highlightPollId,
}: CommitteePollsProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isTeacher = committeeTeacherId === userId;
  const isAdmin = userRole === "admin";

  useEffect(() => {
    fetchPolls();
  }, [committeeId]);

  // Scroll to highlighted poll
  useEffect(() => {
    if (highlightPollId && !loading) {
      const el = document.getElementById(`poll-${highlightPollId}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightPollId, loading]);

  async function fetchPolls() {
    const supabase = createClient();
    const { data } = await supabase
      .from("committee_polls")
      .select("*, creator:profiles!creator_id(full_name)")
      .eq("committee_id", committeeId)
      .order("is_open", { ascending: false })
      .order("created_at", { ascending: false });

    setPolls((data as unknown as Poll[]) || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse bg-sand-100 rounded-2xl h-40" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create poll button - only for committee members with polls privilege */}
      {isCommitteeMember && canCreatePolls && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-sand-300 text-sand-500 hover:border-primary-400 hover:text-primary-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          יצירת סקר חדש
        </button>
      )}

      {polls.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-sand-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium text-sand-700 mb-1">אין סקרים עדיין</h3>
          <p className="text-sand-500 text-sm">צרו סקר חדש כדי להתחיל</p>
        </div>
      ) : (
        polls.map((poll) => (
          <div key={poll.id} id={`poll-${poll.id}`}>
            <PollCard
              poll={poll}
              userId={userId}
              isCommitteeMember={isCommitteeMember}
              canClose={poll.creator_id === userId || isTeacher || isAdmin}
              onPollUpdated={fetchPolls}
            />
          </div>
        ))
      )}

      {showCreateModal && (
        <CreatePollModal
          committeeId={committeeId}
          creatorId={userId}
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchPolls}
        />
      )}
    </div>
  );
}
