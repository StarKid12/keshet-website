"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { RAINBOW_COLORS } from "@/lib/constants";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_approved: boolean;
  class_id: string | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }

  async function approveUser(userId: string) {
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ is_approved: true })
      .eq("id", userId);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_approved: true } : u))
    );
  }

  async function updateRole(userId: string, role: string) {
    const supabase = createClient();
    await supabase.from("profiles").update({ role }).eq("id", userId);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
  }

  const filteredUsers = users.filter((u) => {
    if (filter === "pending") return !u.is_approved;
    if (filter === "approved") return u.is_approved;
    return true;
  });

  const pendingCount = users.filter((u) => !u.is_approved).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">ניהול משתמשים</h1>
          <p className="text-sand-500 mt-1">{users.length} משתמשים רשומים</p>
        </div>
        {pendingCount > 0 && (
          <span className="bg-rainbow-red text-white text-sm px-3 py-1 rounded-full font-medium">
            {pendingCount} ממתינים לאישור
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "all", label: "הכל" },
          { value: "pending", label: "ממתינים" },
          { value: "approved", label: "מאושרים" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-primary-600 text-white"
                : "bg-white text-sand-600 border border-sand-200 hover:bg-sand-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-sand-200 rounded-xl h-16" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-sand-50 border-b border-sand-200">
                  <th className="text-start p-4 text-sm font-medium text-sand-500">שם</th>
                  <th className="text-start p-4 text-sm font-medium text-sand-500">אימייל</th>
                  <th className="text-start p-4 text-sm font-medium text-sand-500">תפקיד</th>
                  <th className="text-start p-4 text-sm font-medium text-sand-500">סטטוס</th>
                  <th className="text-start p-4 text-sm font-medium text-sand-500">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-sand-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: RAINBOW_COLORS[index % RAINBOW_COLORS.length] }}
                        >
                          {(user.full_name || user.email).charAt(0)}
                        </div>
                        <span className="font-medium text-sand-900">
                          {user.full_name || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-sand-600" dir="ltr">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="text-sm border border-sand-200 rounded-lg px-2 py-1 bg-white"
                      >
                        <option value="parent">הורה</option>
                        <option value="student">תלמיד</option>
                        <option value="teacher">מורה</option>
                        <option value="admin">מנהל</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.is_approved
                            ? "bg-rainbow-green/10 text-rainbow-green"
                            : "bg-rainbow-orange/10 text-rainbow-orange"
                        }`}
                      >
                        {user.is_approved ? "מאושר" : "ממתין"}
                      </span>
                    </td>
                    <td className="p-4">
                      {!user.is_approved && (
                        <Button
                          size="sm"
                          onClick={() => approveUser(user.id)}
                        >
                          אישור
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
