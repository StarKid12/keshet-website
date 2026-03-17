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
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "teacher" | "parent" | "student">("all");

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

  async function deleteUser(userId: string) {
    if (!confirm("למחוק את המשתמש לצמיתות? פעולה זו לא ניתנת לביטול.")) return;
    const res = await fetch("/api/admin/delete-user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } else {
      const data = await res.json();
      alert(data.error || "שגיאה במחיקת המשתמש");
    }
  }

  const filteredUsers = users.filter((u) => {
    if (filter === "pending" && u.is_approved) return false;
    if (filter === "approved" && !u.is_approved) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
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
      <div className="flex flex-wrap gap-2 mb-4">
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

      {/* Role filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: "all", label: "כל התפקידים" },
          { value: "admin", label: "מנהלים" },
          { value: "teacher", label: "מורים" },
          { value: "parent", label: "הורים" },
          { value: "student", label: "תלמידים" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setRoleFilter(f.value as typeof roleFilter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              roleFilter === f.value
                ? "bg-sand-800 text-white"
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
                      <div className="flex items-center gap-2">
                        {!user.is_approved && (
                          <Button
                            size="sm"
                            onClick={() => approveUser(user.id)}
                          >
                            אישור
                          </Button>
                        )}
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 rounded-lg hover:bg-rainbow-red/10 transition-colors text-sand-400 hover:text-rainbow-red"
                          title="מחיקת משתמש"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
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
