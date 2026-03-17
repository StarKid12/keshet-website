"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { RAINBOW_COLORS } from "@/lib/constants";
import { CreatePollModal } from "./CreatePollModal";

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return RAINBOW_COLORS[Math.abs(hash) % RAINBOW_COLORS.length];
}

interface PollOption {
  id: string;
  label: string;
  display_order: number;
}

interface PollVote {
  id: string;
  option_id: string;
  voter_id: string;
}

interface PollComment {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: { full_name: string | null; email: string };
}

export interface Poll {
  id: string;
  committee_id: string;
  creator_id: string;
  question: string;
  target_roles: string[];
  is_open: boolean;
  closed_at: string | null;
  created_at: string;
  creator?: { full_name: string | null };
}

interface PollCardProps {
  poll: Poll;
  userId: string;
  isCommitteeMember: boolean;
  canClose: boolean; // creator, teacher, or admin
  onPollUpdated: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  student: "תלמידים",
  teacher: "מורים",
  parent: "הורים",
};

export function PollCard({ poll, userId, isCommitteeMember, canClose, onPollUpdated }: PollCardProps) {
  const [options, setOptions] = useState<PollOption[]>([]);
  const [votes, setVotes] = useState<PollVote[]>([]);
  const [comments, setComments] = useState<PollComment[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const myVote = votes.find((v) => v.voter_id === userId);
  const totalVotes = votes.length;
  const canSeeResults = isCommitteeMember || !poll.is_open;

  useEffect(() => {
    fetchPollData();
  }, [poll.id]);

  // Realtime comments
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`poll-comments-${poll.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "committee_poll_comments",
          filter: `poll_id=eq.${poll.id}`,
        },
        async (payload) => {
          const newComment = payload.new as PollComment;
          // Fetch author profile
          const { data: author } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", newComment.author_id)
            .single();
          setComments((prev) => {
            if (prev.some((c) => c.id === newComment.id)) return prev;
            return [...prev, { ...newComment, author: author || undefined }];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [poll.id]);

  async function fetchPollData() {
    const supabase = createClient();

    const [optionsRes, votesRes, commentsRes] = await Promise.all([
      supabase
        .from("committee_poll_options")
        .select("*")
        .eq("poll_id", poll.id)
        .order("display_order"),
      supabase
        .from("committee_poll_votes")
        .select("id, option_id, voter_id")
        .eq("poll_id", poll.id),
      supabase
        .from("committee_poll_comments")
        .select("id, author_id, content, created_at, author:profiles!author_id(full_name, email)")
        .eq("poll_id", poll.id)
        .order("created_at"),
    ]);

    setOptions(optionsRes.data || []);
    setVotes(votesRes.data || []);
    setComments((commentsRes.data as unknown as PollComment[]) || []);
    setLoading(false);
  }

  async function handleVote() {
    if (!selectedOption || myVote) return;
    setVoting(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("committee_poll_votes")
      .insert({ poll_id: poll.id, option_id: selectedOption, voter_id: userId })
      .select("id, option_id, voter_id")
      .single();

    if (!error && data) {
      setVotes((prev) => [...prev, data]);
    }
    setVoting(false);
  }

  async function handleClosePoll() {
    if (!confirm("לסגור את הסקר? לאחר הסגירה לא ניתן יהיה להצביע.")) return;
    const supabase = createClient();
    await supabase
      .from("committee_polls")
      .update({ is_open: false, closed_at: new Date().toISOString(), closed_by: userId })
      .eq("id", poll.id);
    onPollUpdated();
  }

  async function handleDeletePoll() {
    if (!confirm("למחוק את הסקר? פעולה זו לא ניתנת לביטול.")) return;
    const supabase = createClient();
    await supabase.from("committee_poll_comments").delete().eq("poll_id", poll.id);
    await supabase.from("committee_poll_votes").delete().eq("poll_id", poll.id);
    await supabase.from("committee_poll_options").delete().eq("poll_id", poll.id);
    await supabase.from("committee_polls").delete().eq("id", poll.id);
    onPollUpdated();
  }

  async function handleAddComment() {
    if (!commentInput.trim()) return;
    setSendingComment(true);
    const supabase = createClient();
    await supabase
      .from("committee_poll_comments")
      .insert({ poll_id: poll.id, author_id: userId, content: commentInput.trim() });
    setCommentInput("");
    setSendingComment(false);
  }

  function getVoteCount(optionId: string) {
    return votes.filter((v) => v.option_id === optionId).length;
  }

  function getVotePercent(optionId: string) {
    if (totalVotes === 0) return 0;
    return Math.round((getVoteCount(optionId) / totalVotes) * 100);
  }

  if (loading) {
    return <div className="animate-pulse bg-sand-100 rounded-2xl h-40" />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-sand-900 text-lg">{poll.question}</h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-sand-400">
              <span>{poll.creator?.full_name || "חבר ועדה"}</span>
              <span>{new Date(poll.created_at).toLocaleDateString("he-IL")}</span>
              <div className="flex gap-1">
                {poll.target_roles.map((role) => (
                  <span key={role} className="px-1.5 py-0.5 rounded bg-sand-100 text-sand-500">
                    {ROLE_LABELS[role] || role}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                poll.is_open
                  ? "bg-rainbow-green/10 text-rainbow-green"
                  : "bg-sand-200 text-sand-500"
              }`}
            >
              {poll.is_open ? "פתוח" : "סגור"}
            </span>
            {canClose && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-sand-100 transition-colors text-sand-400"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-sand-200 py-1 z-20 min-w-[140px]">
                      <button
                        onClick={() => { setShowMenu(false); setShowEditModal(true); }}
                        className="w-full px-4 py-2.5 text-start text-sm text-sand-700 hover:bg-sand-50 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        עריכה
                      </button>
                      {poll.is_open && (
                        <button
                          onClick={() => { setShowMenu(false); handleClosePoll(); }}
                          className="w-full px-4 py-2.5 text-start text-sm text-sand-700 hover:bg-sand-50 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          סגירת סקר
                        </button>
                      )}
                      <button
                        onClick={() => { setShowMenu(false); handleDeletePoll(); }}
                        className="w-full px-4 py-2.5 text-start text-sm text-rainbow-red hover:bg-rainbow-red/5 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        מחיקה
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Options / Voting / Results */}
      <div className="px-5 pb-4 space-y-2">
        {options.map((option, index) => {
          const isMyVote = myVote?.option_id === option.id;
          const count = getVoteCount(option.id);
          const percent = getVotePercent(option.id);
          const barColor = RAINBOW_COLORS[index % RAINBOW_COLORS.length];

          return (
            <div key={option.id}>
              {/* Votable state: poll is open, user hasn't voted */}
              {poll.is_open && !myVote ? (
                <button
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full text-start p-3 rounded-xl border-2 transition-colors ${
                    selectedOption === option.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-sand-200 hover:border-sand-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedOption === option.id
                          ? "border-primary-500"
                          : "border-sand-300"
                      }`}
                    >
                      {selectedOption === option.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-sand-800">{option.label}</span>
                  </div>
                </button>
              ) : (
                /* Results state */
                <div className="p-3 rounded-xl bg-sand-50">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-sand-800">{option.label}</span>
                      {isMyVote && (
                        <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    {canSeeResults && (
                      <span className="text-xs text-sand-500">
                        {count} ({percent}%)
                      </span>
                    )}
                  </div>
                  {canSeeResults ? (
                    <div className="w-full h-2 bg-sand-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: barColor }}
                      />
                    </div>
                  ) : (
                    myVote && isMyVote && (
                      <p className="text-xs text-sand-400">הצבעתך נקלטה</p>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Vote button */}
        {poll.is_open && !myVote && (
          <button
            onClick={handleVote}
            disabled={!selectedOption || voting}
            className="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {voting ? "שולח..." : "הצבעה"}
          </button>
        )}

        {/* Results hidden message for non-members on open polls */}
        {!canSeeResults && poll.is_open && myVote && (
          <p className="text-xs text-sand-400 text-center py-2">
            התוצאות יוצגו לאחר סגירת הסקר
          </p>
        )}

        {/* Total votes count */}
        {canSeeResults && totalVotes > 0 && (
          <p className="text-xs text-sand-400 text-center pt-1">
            סה״כ {totalVotes} הצבעות
          </p>
        )}
      </div>

      {/* Actions bar */}
      <div className="px-5 pb-4 flex items-center justify-between">
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-sm text-sand-500 hover:text-sand-700 font-medium flex items-center gap-1.5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          תגובות ({comments.length})
        </button>

      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-sand-200 px-5 py-4 space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-sand-400 text-center py-2">אין תגובות עדיין</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.map((comment) => {
                const authorName = comment.author?.full_name || comment.author?.email || "אנונימי";
                return (
                  <div key={comment.id} className="flex gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: getAvatarColor(authorName) }}
                    >
                      {authorName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-sand-700">{authorName}</span>
                        <span className="text-xs text-sand-400">
                          {new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit" }).format(new Date(comment.created_at))}
                        </span>
                      </div>
                      <p className="text-sm text-sand-800 mt-0.5">{comment.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add comment */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="הוסיפו תגובה..."
              className="flex-1 px-3 py-2 rounded-xl border border-sand-200 bg-sand-50 text-sm text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            />
            <button
              onClick={handleAddComment}
              disabled={!commentInput.trim() || sendingComment}
              className="px-3 py-2 rounded-xl bg-primary-600 text-white text-sm hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {showEditModal && (
        <CreatePollModal
          committeeId={poll.committee_id}
          creatorId={poll.creator_id}
          onClose={() => setShowEditModal(false)}
          onCreated={() => { fetchPollData(); onPollUpdated(); }}
          editPollId={poll.id}
          initialQuestion={poll.question}
          initialOptions={options.map((o) => o.label)}
          initialTargetRoles={poll.target_roles}
        />
      )}
    </div>
  );
}
