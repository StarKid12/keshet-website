"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RAINBOW_COLORS, GRADE_LEVELS } from "@/lib/constants";

interface ClassItem {
  id: string;
  name: string;
  grade_level: number;
  academic_year: string;
  teacher_id: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_approved: boolean;
  class_id: string | null;
}

function getGradeLabel(grade: number): string {
  return GRADE_LEVELS.find((g) => g.value === grade)?.label ?? `שכבה ${grade}`;
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);

  // New class form
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState(0);
  const [newYear, setNewYear] = useState("2025-2026");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Assign user
  const [assignSearch, setAssignSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const supabase = createClient();
    const [classesRes, profilesRes] = await Promise.all([
      supabase
        .from("classes")
        .select("*")
        .order("grade_level", { ascending: true }),
      supabase
        .from("profiles")
        .select("id, email, full_name, role, is_approved, class_id")
        .order("full_name", { ascending: true }),
    ]);
    setClasses(classesRes.data || []);
    setProfiles(profilesRes.data || []);
    setLoading(false);
  }

  async function createClass() {
    if (!newName.trim()) return;
    setCreating(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("classes")
      .insert({
        name: newName.trim(),
        grade_level: newGrade,
        academic_year: newYear,
      })
      .select()
      .single();

    if (error) {
      alert("שגיאה ביצירת כיתה: " + error.message);
    } else if (data) {
      setClasses((prev) => [...prev, data].sort((a, b) => a.grade_level - b.grade_level));
      setNewName("");
      setNewGrade(0);
      setShowForm(false);
    }
    setCreating(false);
  }

  async function deleteClass(classId: string) {
    if (!confirm("למחוק את הכיתה? כל המשתמשים המשויכים יוסרו מהכיתה.")) return;
    const supabase = createClient();

    // Unassign all profiles from this class
    await supabase
      .from("profiles")
      .update({ class_id: null })
      .eq("class_id", classId);

    const { error } = await supabase.from("classes").delete().eq("id", classId);
    if (error) {
      alert("שגיאה במחיקת כיתה: " + error.message);
      return;
    }
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    setProfiles((prev) =>
      prev.map((p) => (p.class_id === classId ? { ...p, class_id: null } : p))
    );
    if (expandedClassId === classId) setExpandedClassId(null);
  }

  async function assignTeacher(classId: string, teacherId: string | null) {
    const supabase = createClient();
    await supabase
      .from("classes")
      .update({ teacher_id: teacherId || null })
      .eq("id", classId);
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId ? { ...c, teacher_id: teacherId || null } : c
      )
    );
  }

  async function assignUserToClass(userId: string, classId: string) {
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ class_id: classId })
      .eq("id", userId);
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, class_id: classId } : p))
    );
  }

  async function removeUserFromClass(userId: string) {
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ class_id: null })
      .eq("id", userId);
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, class_id: null } : p))
    );
  }

  const teachers = profiles.filter((p) => p.role === "teacher");

  function getClassMembers(classId: string) {
    return profiles.filter((p) => p.class_id === classId);
  }

  function getStudentCount(classId: string) {
    return profiles.filter(
      (p) => p.class_id === classId && (p.role === "student" || p.role === "parent")
    ).length;
  }

  function getTeacherName(teacherId: string | null) {
    if (!teacherId) return null;
    const teacher = profiles.find((p) => p.id === teacherId);
    return teacher?.full_name || teacher?.email || null;
  }

  const unassignedUsers = profiles.filter(
    (p) => !p.class_id && p.role !== "admin"
  );

  const filteredUnassigned = assignSearch
    ? unassignedUsers.filter(
        (p) =>
          (p.full_name?.includes(assignSearch) ?? false) ||
          p.email.includes(assignSearch)
      )
    : unassignedUsers;

  const roleLabels: Record<string, string> = {
    admin: "מנהל",
    teacher: "מורה",
    parent: "הורה",
    student: "תלמיד",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">
            ניהול כיתות
          </h1>
          <p className="text-sand-500 mt-1">{classes.length} כיתות פעילות</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "ביטול" : "כיתה חדשה +"}
        </Button>
      </div>

      {/* Create Class Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-sand-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-sand-900 mb-4">יצירת כיתה חדשה</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="שם הכיתה"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder='לדוג׳ "כיתה א׳ - דבורה"'
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-sand-700 mb-1.5">
                שכבה
              </label>
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors duration-200"
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="שנת לימודים"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              placeholder="2025-2026"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={createClass} disabled={creating || !newName.trim()}>
              {creating ? "יוצר..." : "צור כיתה"}
            </Button>
          </div>
        </div>
      )}

      {/* Classes List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-sand-200 rounded-xl h-20" />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-sand-200 p-12 text-center">
          <p className="text-sand-500 text-lg">אין כיתות עדיין</p>
          <p className="text-sand-400 mt-1">לחצו על &quot;כיתה חדשה&quot; כדי להתחיל</p>
        </div>
      ) : (
        <div className="space-y-4">
          {classes.map((cls, index) => {
            const isExpanded = expandedClassId === cls.id;
            const members = getClassMembers(cls.id);
            const studentCount = getStudentCount(cls.id);
            const teacherName = getTeacherName(cls.teacher_id);
            const accentColor = RAINBOW_COLORS[index % RAINBOW_COLORS.length];

            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden"
              >
                {/* Class Header */}
                <div
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-sand-50/50 transition-colors"
                  onClick={() =>
                    setExpandedClassId(isExpanded ? null : cls.id)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                      style={{ backgroundColor: accentColor }}
                    >
                      {cls.grade_level === 0
                        ? "גן"
                        : cls.grade_level}
                    </div>
                    <div>
                      <h3 className="font-bold text-sand-900 text-lg">
                        {cls.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-sm text-sand-500">
                          {getGradeLabel(cls.grade_level)}
                        </span>
                        <span className="text-sand-300">|</span>
                        <span className="text-sm text-sand-500">
                          {cls.academic_year}
                        </span>
                        {teacherName && (
                          <>
                            <span className="text-sand-300">|</span>
                            <span className="text-sm text-sand-500">
                              מורה: {teacherName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-sm px-3 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: accentColor + "15",
                        color: accentColor,
                      }}
                    >
                      {studentCount} משתתפים
                    </span>
                    <svg
                      className={`w-5 h-5 text-sand-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-sand-200">
                    {/* Teacher Assignment */}
                    <div className="p-5 bg-sand-50/50">
                      <label className="block text-sm font-medium text-sand-700 mb-2">
                        שיוך מורה לכיתה
                      </label>
                      <select
                        value={cls.teacher_id || ""}
                        onChange={(e) =>
                          assignTeacher(cls.id, e.target.value || null)
                        }
                        className="w-full sm:w-72 px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors duration-200"
                      >
                        <option value="">ללא מורה</option>
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.full_name || t.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Current Members */}
                    <div className="p-5">
                      <h4 className="font-medium text-sand-900 mb-3">
                        חברי הכיתה ({members.length})
                      </h4>
                      {members.length === 0 ? (
                        <p className="text-sm text-sand-400">
                          אין משתמשים משויכים לכיתה זו
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {members.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between bg-sand-50 rounded-lg px-4 py-2.5"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                  style={{
                                    backgroundColor: accentColor,
                                  }}
                                >
                                  {(
                                    member.full_name ||
                                    member.email
                                  ).charAt(0)}
                                </div>
                                <div>
                                  <span className="font-medium text-sand-900 text-sm">
                                    {member.full_name || member.email}
                                  </span>
                                  <span className="text-xs text-sand-400 ms-2">
                                    {roleLabels[member.role] || member.role}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeUserFromClass(member.id)}
                                className="p-1.5 rounded-lg hover:bg-rainbow-red/10 transition-colors text-sand-400 hover:text-rainbow-red"
                                title="הסרה מהכיתה"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add Users */}
                    <div className="p-5 border-t border-sand-200">
                      <h4 className="font-medium text-sand-900 mb-3">
                        הוספת משתמשים לכיתה
                      </h4>
                      <Input
                        placeholder="חיפוש לפי שם או אימייל..."
                        value={assignSearch}
                        onChange={(e) => setAssignSearch(e.target.value)}
                        className="mb-3"
                      />
                      {filteredUnassigned.length === 0 ? (
                        <p className="text-sm text-sand-400">
                          {assignSearch
                            ? "לא נמצאו משתמשים"
                            : "אין משתמשים ללא כיתה"}
                        </p>
                      ) : (
                        <div className="max-h-48 overflow-y-auto space-y-1.5 rounded-lg border border-sand-200 p-2">
                          {filteredUnassigned.slice(0, 20).map((user) => (
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
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  assignUserToClass(user.id, cls.id)
                                }
                              >
                                שייך
                              </Button>
                            </div>
                          ))}
                          {filteredUnassigned.length > 20 && (
                            <p className="text-xs text-sand-400 text-center py-1">
                              ועוד {filteredUnassigned.length - 20} משתמשים...
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Delete Class */}
                    <div className="p-5 border-t border-sand-200 flex justify-end">
                      <button
                        onClick={() => deleteClass(cls.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-rainbow-red hover:bg-rainbow-red/10 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        מחיקת כיתה
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
