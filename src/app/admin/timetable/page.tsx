"use client";

import { useEffect, useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DAYS_OF_WEEK_HE, TIMETABLE_SLOTS, RAINBOW_COLORS } from "@/lib/constants";

interface TimetableOption {
  id: string;
  class_id: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  subject: string;
  teacher_name: string | null;
  room: string | null;
  created_by: string | null;
  created_at: string;
}

interface ClassInfo {
  id: string;
  name: string;
  grade_level: number;
}

const lessonSlots = TIMETABLE_SLOTS.filter((s) => s.type === "lesson");

const colorBySubject: Record<string, string> = {};
let colorIndex = 0;
function getSubjectColor(subject: string): string {
  if (!colorBySubject[subject]) {
    colorBySubject[subject] = RAINBOW_COLORS[colorIndex % RAINBOW_COLORS.length];
    colorIndex++;
  }
  return colorBySubject[subject];
}

export default function AdminTimetablePage() {
  const { user } = useUser();
  const [options, setOptions] = useState<TimetableOption[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TimetableOption | null>(null);
  const [formDay, setFormDay] = useState(0);
  const [formSlotIndex, setFormSlotIndex] = useState(0);
  const [subject, setSubject] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [room, setRoom] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      const supabase = createClient();

      // Fetch classes
      const { data: classData } = await supabase
        .from("classes")
        .select("id, name, grade_level")
        .order("grade_level");
      setClasses(classData || []);

      // Auto-select first class
      if (classData && classData.length > 0) {
        setSelectedClassId(classData[0].id);
      }

      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (selectedClassId) fetchOptions();
  }, [selectedClassId]);

  async function fetchOptions() {
    const supabase = createClient();
    const { data } = await supabase
      .from("timetable_options")
      .select("*")
      .eq("class_id", selectedClassId)
      .order("day_of_week")
      .order("start_time");
    setOptions(data || []);
  }

  function resetForm() {
    setSubject("");
    setTeacherName("");
    setRoom("");
    setEditing(null);
    setShowForm(false);
  }

  function startAdd(dayIndex: number, slotIndex: number) {
    resetForm();
    setFormDay(dayIndex);
    setFormSlotIndex(slotIndex);
    setShowForm(true);
  }

  function startEdit(option: TimetableOption) {
    setSubject(option.subject);
    setTeacherName(option.teacher_name || "");
    setRoom(option.room || "");
    setFormDay(option.day_of_week);
    const idx = lessonSlots.findIndex(
      (s) => s.start === option.start_time.slice(0, 5)
    );
    setFormSlotIndex(idx >= 0 ? idx : 0);
    setEditing(option);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !user || !selectedClassId) return;

    setSaving(true);
    const supabase = createClient();
    const slot = lessonSlots[formSlotIndex];

    if (editing) {
      const { error } = await supabase
        .from("timetable_options")
        .update({
          day_of_week: formDay,
          start_time: slot.start,
          end_time: slot.end,
          subject: subject.trim(),
          teacher_name: teacherName.trim() || null,
          room: room.trim() || null,
        })
        .eq("id", editing.id);

      if (!error) {
        setOptions((prev) =>
          prev.map((o) =>
            o.id === editing.id
              ? {
                  ...o,
                  day_of_week: formDay,
                  start_time: slot.start,
                  end_time: slot.end,
                  subject: subject.trim(),
                  teacher_name: teacherName.trim() || null,
                  room: room.trim() || null,
                }
              : o
          )
        );
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from("timetable_options")
        .insert({
          class_id: selectedClassId,
          day_of_week: formDay,
          start_time: slot.start,
          end_time: slot.end,
          subject: subject.trim(),
          teacher_name: teacherName.trim() || null,
          room: room.trim() || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (!error && data) {
        setOptions((prev) => [...prev, data]);
        resetForm();
      }
    }
    setSaving(false);
  }

  async function deleteOption(id: string) {
    if (!confirm("למחוק את השיעור?")) return;
    const supabase = createClient();
    await supabase.from("timetable_options").delete().eq("id", id);
    setOptions((prev) => prev.filter((o) => o.id !== id));
  }

  function getOptionsForSlot(dayIndex: number, slot: (typeof lessonSlots)[number]) {
    return options.filter(
      (o) =>
        o.day_of_week === dayIndex &&
        o.start_time.slice(0, 5) === slot.start
    );
  }

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">
            ניהול מערכת שעות
          </h1>
          <p className="text-sand-500 mt-1">
            הוספת שיעורים לכיתות שתלמידים יוכלו לבחור מתוכם
          </p>
        </div>
      </div>

      {/* Class selector */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-sand-200 mb-6">
        <label className="block text-sm font-medium text-sand-700 mb-2">בחירת כיתה</label>
        <div className="flex flex-wrap gap-2">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedClassId === cls.id
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-sand-100 text-sand-700 hover:bg-sand-200"
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {!selectedClassId ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
          <p className="text-sand-500">בחרו כיתה כדי לנהל את מערכת השעות</p>
        </div>
      ) : (
        <>
          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-sand-900">
                  {editing ? "עריכת שיעור" : `שיעור חדש - ${selectedClass?.name}`}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-sand-400 hover:text-sand-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-1.5">יום</label>
                    <select
                      value={formDay}
                      onChange={(e) => setFormDay(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    >
                      {DAYS_OF_WEEK_HE.map((day, i) => (
                        <option key={i} value={i}>יום {day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-1.5">שעה</label>
                    <select
                      value={formSlotIndex}
                      onChange={(e) => setFormSlotIndex(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                      dir="ltr"
                    >
                      {lessonSlots.map((slot, i) => (
                        <option key={i} value={i}>
                          {slot.start} - {slot.end}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Input
                  label="שם השיעור"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="לדוגמה: מתמטיקה, אנגלית..."
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="שם המורה (אופציונלי)"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="שם המורה"
                  />
                  <Input
                    label="חדר (אופציונלי)"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="מספר חדר"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={saving || !subject.trim()}>
                    {saving ? "שומר..." : editing ? "שמירת שינויים" : "הוספת שיעור"}
                  </Button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm text-sand-600 hover:text-sand-800 transition-colors"
                  >
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="animate-pulse bg-sand-200 rounded-2xl h-96" />
          ) : (
            <>
              {/* Desktop Grid */}
              <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-sand-50">
                        <th className="p-3 text-sm font-medium text-sand-500 text-start w-24 sticky right-0 bg-sand-50 z-10">
                          יום
                        </th>
                        {lessonSlots.map((slot) => (
                          <th
                            key={slot.start}
                            className="p-2 text-xs font-medium text-sand-500 text-center min-w-[120px]"
                            dir="ltr"
                          >
                            {slot.start}-{slot.end}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS_OF_WEEK_HE.map((day, dayIndex) => (
                        <tr key={dayIndex} className="border-t border-sand-100">
                          <td className="p-3 text-sm font-medium text-sand-700 sticky right-0 bg-white z-10">
                            {day}
                          </td>
                          {lessonSlots.map((slot, slotIdx) => {
                            const slotOptions = getOptionsForSlot(dayIndex, slot);
                            return (
                              <td key={slot.start} className="p-1.5 align-top">
                                <div className="space-y-1 min-h-[60px]">
                                  {slotOptions.map((opt) => (
                                    <div
                                      key={opt.id}
                                      className="rounded-lg p-1.5 text-xs group relative cursor-pointer"
                                      style={{
                                        backgroundColor: `${getSubjectColor(opt.subject)}15`,
                                        borderRight: `3px solid ${getSubjectColor(opt.subject)}`,
                                      }}
                                      onClick={() => startEdit(opt)}
                                    >
                                      <div className="font-medium text-sand-900 truncate">
                                        {opt.subject}
                                      </div>
                                      {opt.teacher_name && (
                                        <div className="text-sand-500 truncate">{opt.teacher_name}</div>
                                      )}
                                      {opt.room && (
                                        <div className="text-sand-400 truncate">חדר {opt.room}</div>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteOption(opt.id);
                                        }}
                                        className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 w-5 h-5 rounded bg-rainbow-red/10 text-rainbow-red flex items-center justify-center transition-opacity"
                                        title="מחיקה"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => startAdd(dayIndex, slotIdx)}
                                    className="w-full rounded-lg border border-dashed border-sand-300 text-sand-400 hover:border-primary-400 hover:text-primary-500 text-xs py-1.5 transition-colors"
                                  >
                                    + הוסף
                                  </button>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile: Day by day */}
              <div className="lg:hidden space-y-4">
                {DAYS_OF_WEEK_HE.map((day, dayIndex) => (
                  <div key={dayIndex} className="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden">
                    <div className="bg-sand-50 px-4 py-3 font-bold text-sand-800 border-b border-sand-200">
                      יום {day}
                    </div>
                    <div className="divide-y divide-sand-100">
                      {lessonSlots.map((slot, slotIdx) => {
                        const slotOptions = getOptionsForSlot(dayIndex, slot);
                        return (
                          <div key={slot.start} className="px-4 py-3">
                            <div className="text-xs text-sand-400 mb-2" dir="ltr">
                              {slot.start} - {slot.end}
                            </div>
                            <div className="space-y-2">
                              {slotOptions.map((opt) => (
                                <div
                                  key={opt.id}
                                  className="flex items-center gap-3 group"
                                >
                                  <div
                                    className="w-1 h-8 rounded-full shrink-0"
                                    style={{ backgroundColor: getSubjectColor(opt.subject) }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-sand-900">{opt.subject}</div>
                                    <div className="text-xs text-sand-500">
                                      {opt.teacher_name}
                                      {opt.room && ` · חדר ${opt.room}`}
                                    </div>
                                  </div>
                                  <div className="flex gap-1 shrink-0">
                                    <button
                                      onClick={() => startEdit(opt)}
                                      className="p-1.5 rounded-lg hover:bg-sand-100 text-sand-400 hover:text-sand-600 transition-colors"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => deleteOption(opt.id)}
                                      className="p-1.5 rounded-lg hover:bg-rainbow-red/10 text-sand-400 hover:text-rainbow-red transition-colors"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={() => startAdd(dayIndex, slotIdx)}
                                className="w-full rounded-lg border border-dashed border-sand-300 text-sand-400 hover:border-primary-400 hover:text-primary-500 text-sm py-2 transition-colors"
                              >
                                + הוסף שיעור
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
