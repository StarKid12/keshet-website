"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { RAINBOW_COLORS } from "@/lib/constants";
import Link from "next/link";

interface Committee {
  id: string;
  name: string;
  description: string | null;
  teacher_id: string | null;
  is_active: boolean;
  teacher?: { full_name: string | null };
  member_count?: number;
}

export default function CommitteesPage() {
  const { user, profile } = useUser();
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchCommittees();
  }, [user]);

  async function fetchCommittees() {
    const supabase = createClient();

    if (profile?.role === "admin") {
      // Admin sees all active committees
      const { data } = await supabase
        .from("committees")
        .select("*, teacher:profiles!teacher_id(full_name)")
        .eq("is_active", true)
        .order("name");

      if (data) {
        // Get member counts
        const withCounts = await Promise.all(
          data.map(async (c) => {
            const { count } = await supabase
              .from("committee_members")
              .select("*", { count: "exact", head: true })
              .eq("committee_id", c.id);
            return { ...c, member_count: count || 0 };
          })
        );
        setCommittees(withCounts);
      }
    } else {
      // Regular users see committees they belong to OR are the teacher of
      const { data: memberships } = await supabase
        .from("committee_members")
        .select("committee_id")
        .eq("user_id", user!.id);

      const memberIds = new Set((memberships || []).map((m) => m.committee_id));

      // Also get committees where user is the teacher
      const { data: teacherOf } = await supabase
        .from("committees")
        .select("id")
        .eq("teacher_id", user!.id)
        .eq("is_active", true);

      for (const c of teacherOf || []) {
        memberIds.add(c.id);
      }

      const ids = Array.from(memberIds);
      if (ids.length > 0) {
        const { data } = await supabase
          .from("committees")
          .select("*, teacher:profiles!teacher_id(full_name)")
          .in("id", ids)
          .eq("is_active", true)
          .order("name");

        if (data) {
          const withCounts = await Promise.all(
            data.map(async (c) => {
              const { count } = await supabase
                .from("committee_members")
                .select("*", { count: "exact", head: true })
                .eq("committee_id", c.id);
              return { ...c, member_count: count || 0 };
            })
          );
          setCommittees(withCounts);
        }
      }
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-sand-900">ועדות</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-sand-200 rounded-xl h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (committees.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-sand-900 mb-6">ועדות</h1>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
            <svg className="w-16 h-16 text-sand-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <h3 className="text-lg font-medium text-sand-700 mb-2">אין ועדות</h3>
            <p className="text-sand-500">עדיין לא שויכת לועדה. פנה למנהל המערכת.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sand-900">ועדות</h1>
        <p className="text-sand-500 text-sm">{committees.length} ועדות</p>
      </div>

      <div className="space-y-3">
        {committees.map((committee, index) => (
          <Link
            key={committee.id}
            href={`/committees/${committee.id}`}
            className="block bg-white rounded-2xl p-5 shadow-sm border border-sand-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: RAINBOW_COLORS[index % RAINBOW_COLORS.length] }}
              >
                {committee.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sand-900">{committee.name}</h3>
                {committee.description && (
                  <p className="text-sm text-sand-500 truncate">{committee.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1 text-xs text-sand-400">
                  {committee.teacher?.full_name && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {committee.teacher.full_name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {committee.member_count} חברים
                  </span>
                </div>
              </div>
              <svg className="w-5 h-5 text-sand-300 -scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
