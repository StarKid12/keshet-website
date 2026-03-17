"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RAINBOW_COLORS } from "@/lib/constants";

interface Committee {
  id: string;
  name: string;
  description: string | null;
  teacher_id: string | null;
  is_active: boolean;
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_approved: boolean;
}

interface CommitteeMember {
  id: string;
  user_id: string;
  role: string;
  profile: { full_name: string | null; email: string; role: string };
}

const roleLabels: Record<string, string> = {
  admin: "מנהל",
  teacher: "מורה",
  parent: "הורה",
  student: "תלמיד",
};

export default function AdminCommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // New committee form
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTeacher, setNewTeacher] = useState("");
  const [creating, setCreating] = useState(false);

  // Members per expanded committee
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const supabase = createClient();
    const [committeesRes, profilesRes] = await Promise.all([
      supabase.from("committees").select("*").order("name"),
      supabase
        .from("profiles")
        .select("id, email, full_name, role, is_approved")
        .eq("is_approved", true)
        .order("full_name"),
    ]);
    setCommittees(committeesRes.data || []);
    setProfiles(profilesRes.data || []);
    setLoading(false);
  }

  async function createCommittee() {
    if (!newName.trim()) return;
    setCreating(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("committees")
      .insert({
        name: newName.trim(),
        description: newDesc.trim() || null,
        teacher_id: newTeacher || null,
      })
      .select()
      .single();

    if (error) {
      alert("שגיאה ביצירת ועדה: " + error.message);
    } else if (data) {
      setCommittees((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
      setNewDesc("");
      setNewTeacher("");
      setShowForm(false);
    }
    setCreating(false);
  }

  async function deleteCommittee(id: string) {
    if (!confirm("למחוק את הועדה? כל החברים וההודעות יימחקו.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("committees").delete().eq("id", id);
    if (error) {
      alert("שגיאה במחיקת ועדה: " + error.message);
      return;
    }
    setCommittees((prev) => prev.filter((c) => c.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  async function toggleActive(committee: Committee) {
    const supabase = createClient();
    const newActive = !committee.is_active;
    await supabase.from("committees").update({ is_active: newActive }).eq("id", committee.id);
    setCommittees((prev) =>
      prev.map((c) => (c.id === committee.id ? { ...c, is_active: newActive } : c))
    );
  }

  async function updateTeacher(committeeId: string, teacherId: string | null) {
    const supabase = createClient();
    await supabase.from("committees").update({ teacher_id: teacherId || null }).eq("id", committeeId);
    setCommittees((prev) =>
      prev.map((c) => (c.id === committeeId ? { ...c, teacher_id: teacherId || null } : c))
    );
  }

  async function expandCommittee(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setMembersLoading(true);
    setAddSearch("");
    setSearchResults([]);

    const supabase = createClient();
    const { data } = await supabase
      .from("committee_members")
      .select("id, user_id, role, profile:profiles!user_id(full_name, email, role)")
      .eq("committee_id", id);

    setMembers((data as unknown as CommitteeMember[]) || []);
    setMembersLoading(false);
  }

  function handleSearch(query: string) {
    setAddSearch(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const memberIds = new Set(members.map((m) => m.user_id));
    const results = profiles.filter(
      (p) =>
        !memberIds.has(p.id) &&
        ((p.full_name?.includes(query) ?? false) || p.email.includes(query))
    );
    setSearchResults(results.slice(0, 20));
  }

  async function addMember(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("committee_members")
      .insert({ committee_id: expandedId, user_id: userId })
      .select("id, user_id, role, profile:profiles!user_id(full_name, email, role)")
      .single();

    if (!error && data) {
      setMembers((prev) => [...prev, data as unknown as CommitteeMember]);
      setSearchResults((prev) => prev.filter((p) => p.id !== userId));
    }
  }

  async function removeMember(membershipId: string) {
    if (!confirm("להסיר את החבר מהועדה?")) return;
    const supabase = createClient();
    await supabase.from("committee_members").delete().eq("id", membershipId);
    setMembers((prev) => prev.filter((m) => m.id !== membershipId));
  }

  const teachers = profiles.filter((p) => p.role === "teacher" || p.role === "admin");

  function getTeacherName(teacherId: string | null) {
    if (!teacherId) return null;
    const t = profiles.find((p) => p.id === teacherId);
    return t?.full_name || t?.email || null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">ניהול ועדות</h1>
          <p className="text-sand-500 mt-1">{committees.length} ועדות</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "ביטול" : "ועדה חדשה +"}
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-sand-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-sand-900 mb-4">יצירת ועדה חדשה</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="שם הועדה"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder='לדוג׳ "ועדת כנסת"'
            />
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-1.5">מורה אחראי/ת</label>
              <select
                value={newTeacher}
                onChange={(e) => setNewTeacher(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              >
                <option value="">ללא מורה</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.full_name || t.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <Input
              label="תיאור (אופציונלי)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="תיאור קצר של הועדה..."
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={createCommittee} disabled={creating || !newName.trim()}>
              {creating ? "יוצר..." : "צור ועדה"}
            </Button>
          </div>
        </div>
      )}

      {/* Committees List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-sand-200 rounded-xl h-20" />
          ))}
        </div>
      ) : committees.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-sand-200 p-12 text-center">
          <p className="text-sand-500 text-lg">אין ועדות עדיין</p>
          <p className="text-sand-400 mt-1">לחצו על &quot;ועדה חדשה&quot; כדי להתחיל</p>
        </div>
      ) : (
        <div className="space-y-4">
          {committees.map((committee, index) => {
            const isExpanded = expandedId === committee.id;
            const accentColor = RAINBOW_COLORS[index % RAINBOW_COLORS.length];
            const teacherName = getTeacherName(committee.teacher_id);

            return (
              <div
                key={committee.id}
                className={`bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden ${
                  !committee.is_active ? "opacity-60" : ""
                }`}
              >
                {/* Header */}
                <div
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-sand-50/50 transition-colors"
                  onClick={() => expandCommittee(committee.id)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                      style={{ backgroundColor: accentColor }}
                    >
                      {committee.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sand-900 text-lg">{committee.name}</h3>
                        {!committee.is_active && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-sand-200 text-sand-500">לא פעילה</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        {committee.description && (
                          <span className="text-sm text-sand-500">{committee.description}</span>
                        )}
                        {teacherName && (
                          <>
                            {committee.description && <span className="text-sand-300">|</span>}
                            <span className="text-sm text-sand-500">מורה: {teacherName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-sand-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-sand-200">
                    {/* Teacher Assignment */}
                    <div className="p-5 bg-sand-50/50">
                      <label className="block text-sm font-medium text-sand-700 mb-2">מורה אחראי/ת</label>
                      <select
                        value={committee.teacher_id || ""}
                        onChange={(e) => updateTeacher(committee.id, e.target.value || null)}
                        className="w-full sm:w-72 px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                      >
                        <option value="">ללא מורה</option>
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.full_name || t.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Members */}
                    <div className="p-5">
                      <h4 className="font-medium text-sand-900 mb-3">חברי הועדה ({members.length})</h4>
                      {membersLoading ? (
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse bg-sand-100 rounded-lg h-12" />
                          ))}
                        </div>
                      ) : members.length === 0 ? (
                        <p className="text-sm text-sand-400">אין חברים בועדה עדיין</p>
                      ) : (
                        <div className="space-y-2">
                          {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between bg-sand-50 rounded-lg px-4 py-2.5">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                  style={{ backgroundColor: accentColor }}
                                >
                                  {(member.profile?.full_name || member.profile?.email || "?").charAt(0)}
                                </div>
                                <div>
                                  <span className="font-medium text-sand-900 text-sm">
                                    {member.profile?.full_name || member.profile?.email}
                                  </span>
                                  <span className="text-xs text-sand-400 ms-2">
                                    {roleLabels[member.profile?.role] || member.profile?.role}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeMember(member.id)}
                                className="p-1.5 rounded-lg hover:bg-rainbow-red/10 transition-colors text-sand-400 hover:text-rainbow-red"
                                title="הסרה מהועדה"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add Members */}
                    <div className="p-5 border-t border-sand-200">
                      <h4 className="font-medium text-sand-900 mb-3">הוספת חברים</h4>
                      <Input
                        placeholder="חיפוש לפי שם או אימייל..."
                        value={addSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="mb-3"
                      />
                      {searchResults.length > 0 && (
                        <div className="max-h-48 overflow-y-auto space-y-1.5 rounded-lg border border-sand-200 p-2">
                          {searchResults.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sand-50 transition-colors"
                            >
                              <div>
                                <span className="text-sm font-medium text-sand-900">
                                  {user.full_name || user.email}
                                </span>
                                <span className="text-xs text-sand-400 ms-2">
                                  {roleLabels[user.role] || user.role}
                                </span>
                              </div>
                              <Button size="sm" variant="outline" onClick={() => addMember(user.id)}>
                                הוסף
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      {addSearch.trim() && searchResults.length === 0 && (
                        <p className="text-sm text-sand-400">לא נמצאו משתמשים</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="p-5 border-t border-sand-200 flex items-center justify-between">
                      <button
                        onClick={() => toggleActive(committee)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-sand-600 hover:bg-sand-100 transition-colors"
                      >
                        {committee.is_active ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M15 12a3 3 0 01-3 3m0 0l6.121 6.121" />
                            </svg>
                            השבתה
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            הפעלה
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => deleteCommittee(committee.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-rainbow-red hover:bg-rainbow-red/10 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        מחיקת ועדה
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
