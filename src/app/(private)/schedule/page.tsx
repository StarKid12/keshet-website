"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { DAYS_OF_WEEK_HE, TIMETABLE_SLOTS, RAINBOW_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface TimetableOption {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  subject: string;
  teacher_name: string | null;
  room: string | null;
}

interface StudentEntry {
  id: string;
  student_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  option_id: string | null;
  subject: string;
  teacher_name: string | null;
  room: string | null;
  is_custom: boolean;
}

type PickerTarget = {
  dayIndex: number;
  slot: (typeof TIMETABLE_SLOTS)[number];
};

const lessonSlots = TIMETABLE_SLOTS.filter((s) => s.type === "lesson");

const colorBySubject: Record<string, string> = {};
let colorIdx = 0;
function getSubjectColor(subject: string): string {
  if (!colorBySubject[subject]) {
    colorBySubject[subject] = RAINBOW_COLORS[colorIdx % RAINBOW_COLORS.length];
    colorIdx++;
  }
  return colorBySubject[subject];
}

export default function SchedulePage() {
  const { profile, user } = useUser();
  const [options, setOptions] = useState<TimetableOption[]>([]);
  const [entries, setEntries] = useState<StudentEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Picker modal state
  const [picker, setPicker] = useState<PickerTarget | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customSubject, setCustomSubject] = useState("");
  const [customTeacher, setCustomTeacher] = useState("");
  const [customRoom, setCustomRoom] = useState("");
  const [saving, setSaving] = useState(false);

  const isStudent = profile?.role === "student";

  const fetchData = useCallback(async () => {
    const supabase = createClient();

    // Always fetch options (available to all approved users)
    const { data: optData } = await supabase
      .from("timetable_options")
      .select("*")
      .order("day_of_week")
      .order("start_time");
    setOptions(optData || []);

    // Fetch student's own timetable entries (only works for students due to RLS)
    if (isStudent && user) {
      const { data: entryData } = await supabase
        .from("student_timetable")
        .select("*")
        .eq("student_id", user.id);
      setEntries(entryData || []);
    }

    setLoading(false);
  }, [isStudent, user]);

  useEffect(() => {
    if (profile) fetchData();
  }, [profile, fetchData]);

  function getEntry(dayIndex: number, startTime: string): StudentEntry | undefined {
    return entries.find(
      (e) => e.day_of_week === dayIndex && e.start_time.slice(0, 5) === startTime
    );
  }

  function getOptionsForSlot(dayIndex: number, startTime: string): TimetableOption[] {
    return options.filter(
      (o) => o.day_of_week === dayIndex && o.start_time.slice(0, 5) === startTime
    );
  }

  function openPicker(dayIndex: number, slot: (typeof TIMETABLE_SLOTS)[number]) {
    if (!isStudent) return;
    setPicker({ dayIndex, slot });
    setShowCustom(false);
    setCustomSubject("");
    setCustomTeacher("");
    setCustomRoom("");
  }

  function closePicker() {
    setPicker(null);
    setShowCustom(false);
  }

  async function selectOption(option: TimetableOption) {
    if (!user || !picker) return;
    setSaving(true);
    const supabase = createClient();

    const existing = getEntry(picker.dayIndex, picker.slot.start);

    if (existing) {
      const { error } = await supabase
        .from("student_timetable")
        .update({
          option_id: option.id,
          subject: option.subject,
          teacher_name: option.teacher_name,
          room: option.room,
          is_custom: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (!error) {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === existing.id
              ? {
                  ...e,
                  option_id: option.id,
                  subject: option.subject,
                  teacher_name: option.teacher_name,
                  room: option.room,
                  is_custom: false,
                }
              : e
          )
        );
      }
    } else {
      const { data, error } = await supabase
        .from("student_timetable")
        .insert({
          student_id: user.id,
          day_of_week: picker.dayIndex,
          start_time: picker.slot.start,
          end_time: picker.slot.end,
          option_id: option.id,
          subject: option.subject,
          teacher_name: option.teacher_name,
          room: option.room,
          is_custom: false,
        })
        .select()
        .single();

      if (!error && data) {
        setEntries((prev) => [...prev, data]);
      }
    }

    setSaving(false);
    closePicker();
  }

  async function saveCustom() {
    if (!user || !picker || !customSubject.trim()) return;
    setSaving(true);
    const supabase = createClient();

    const existing = getEntry(picker.dayIndex, picker.slot.start);

    if (existing) {
      const { error } = await supabase
        .from("student_timetable")
        .update({
          option_id: null,
          subject: customSubject.trim(),
          teacher_name: customTeacher.trim() || null,
          room: customRoom.trim() || null,
          is_custom: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (!error) {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === existing.id
              ? {
                  ...e,
                  option_id: null,
                  subject: customSubject.trim(),
                  teacher_name: customTeacher.trim() || null,
                  room: customRoom.trim() || null,
                  is_custom: true,
                }
              : e
          )
        );
      }
    } else {
      const { data, error } = await supabase
        .from("student_timetable")
        .insert({
          student_id: user.id,
          day_of_week: picker.dayIndex,
          start_time: picker.slot.start,
          end_time: picker.slot.end,
          option_id: null,
          subject: customSubject.trim(),
          teacher_name: customTeacher.trim() || null,
          room: customRoom.trim() || null,
          is_custom: true,
        })
        .select()
        .single();

      if (!error && data) {
        setEntries((prev) => [...prev, data]);
      }
    }

    setSaving(false);
    closePicker();
  }

  async function clearEntry(entryId: string) {
    const supabase = createClient();
    await supabase.from("student_timetable").delete().eq("id", entryId);
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
    closePicker();
  }

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">מערכת שעות</h1>
          <p className="text-sand-500 mt-1">מערכת השעות השבועית שלך</p>
        </div>
        <div className="animate-pulse bg-sand-200 rounded-2xl h-96" />
      </div>
    );
  }

  // Non-student view: show message that this is for students only
  if (!isStudent) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">מערכת שעות</h1>
          <p className="text-sand-500 mt-1">בניית מערכת שעות אישית</p>
        </div>
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
          <svg className="w-16 h-16 text-sand-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-sand-700 mb-2">מערכת השעות מיועדת לתלמידים</h3>
          <p className="text-sand-500">תלמידים יכולים לבנות את מערכת השעות האישית שלהם כאן.</p>
          {(profile?.role === "admin" || profile?.role === "teacher") && (
            <p className="text-sm text-sand-400 mt-4">
              לניהול שיעורים זמינים, עברו ל
              <a href="/admin/timetable" className="text-primary-600 hover:text-primary-700 font-medium me-1">
                ניהול מערכת שעות
              </a>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">מערכת שעות</h1>
        <p className="text-sand-500 mt-1">לחצו על תא כדי לבחור שיעור</p>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sand-50">
                <th className="p-3 text-sm font-medium text-sand-500 text-start w-20 sticky right-0 bg-sand-50 z-10">
                  יום
                </th>
                {TIMETABLE_SLOTS.map((slot) => (
                  <th
                    key={slot.start}
                    className={`p-2 text-xs font-medium text-center min-w-[100px] ${
                      slot.type === "break" ? "text-sand-400 bg-sand-100/50" : "text-sand-500"
                    }`}
                    dir="ltr"
                  >
                    {slot.start}-{slot.end}
                    {slot.type === "break" && (
                      <div className="text-[10px] text-sand-400">הפסקה</div>
                    )}
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
                  {TIMETABLE_SLOTS.map((slot) => {
                    if (slot.type === "break") {
                      return (
                        <td key={slot.start} className="p-1.5 bg-sand-50/70">
                          <div className="h-[60px] rounded-lg bg-sand-100/50 flex items-center justify-center">
                            <span className="text-xs text-sand-300">☕</span>
                          </div>
                        </td>
                      );
                    }

                    const entry = getEntry(dayIndex, slot.start);

                    return (
                      <td key={slot.start} className="p-1.5">
                        {entry ? (
                          <div
                            className="rounded-lg p-2 text-xs cursor-pointer hover:shadow-md transition-shadow h-[60px] flex flex-col justify-center"
                            style={{
                              backgroundColor: `${getSubjectColor(entry.subject)}15`,
                              borderRight: `3px solid ${getSubjectColor(entry.subject)}`,
                            }}
                            onClick={() => openPicker(dayIndex, slot)}
                          >
                            <div className="font-medium text-sand-900 truncate">
                              {entry.subject}
                            </div>
                            {entry.teacher_name && (
                              <div className="text-sand-500 truncate">{entry.teacher_name}</div>
                            )}
                            {entry.room && (
                              <div className="text-sand-400 truncate">חדר {entry.room}</div>
                            )}
                            {entry.is_custom && (
                              <div className="text-[10px] text-primary-500">מותאם</div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => openPicker(dayIndex, slot)}
                            className="w-full h-[60px] rounded-lg border border-dashed border-sand-200 text-sand-300 hover:border-primary-400 hover:text-primary-500 hover:bg-primary-50/30 text-xs transition-colors flex items-center justify-center"
                          >
                            + בחר שיעור
                          </button>
                        )}
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
              {TIMETABLE_SLOTS.map((slot) => {
                if (slot.type === "break") {
                  return (
                    <div key={slot.start} className="px-4 py-2 bg-sand-50/50 flex items-center gap-3">
                      <span className="text-sand-300">☕</span>
                      <span className="text-xs text-sand-400">הפסקה</span>
                      <span className="text-xs text-sand-300 ms-auto" dir="ltr">
                        {slot.start}-{slot.end}
                      </span>
                    </div>
                  );
                }

                const entry = getEntry(dayIndex, slot.start);

                return (
                  <div
                    key={slot.start}
                    className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-sand-50/50 transition-colors"
                    onClick={() => openPicker(dayIndex, slot)}
                  >
                    {entry ? (
                      <>
                        <div
                          className="w-1 h-10 rounded-full shrink-0"
                          style={{ backgroundColor: getSubjectColor(entry.subject) }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sand-900">{entry.subject}</div>
                          <div className="text-sm text-sand-500">
                            {entry.teacher_name}
                            {entry.room && ` · חדר ${entry.room}`}
                            {entry.is_custom && (
                              <span className="text-primary-500 ms-2">מותאם</span>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-1 h-10 rounded-full shrink-0 bg-sand-200" />
                        <div className="flex-1 text-sm text-sand-400">+ בחר שיעור</div>
                      </>
                    )}
                    <div className="text-xs text-sand-300 shrink-0" dir="ltr">
                      {slot.start}-{slot.end}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Picker Modal */}
      {picker && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={closePicker} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-sand-200 overflow-hidden max-h-[80vh] flex flex-col">
            <div className="p-5 border-b border-sand-200 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-sand-900">בחירת שיעור</h3>
                <p className="text-sm text-sand-500">
                  יום {DAYS_OF_WEEK_HE[picker.dayIndex]} · {picker.slot.start}-{picker.slot.end}
                </p>
              </div>
              <button
                onClick={closePicker}
                className="w-8 h-8 rounded-lg bg-sand-100 flex items-center justify-center text-sand-500 hover:bg-sand-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              {/* Available options */}
              {(() => {
                const slotOptions = getOptionsForSlot(picker.dayIndex, picker.slot.start);
                const existingEntry = getEntry(picker.dayIndex, picker.slot.start);

                return (
                  <>
                    {slotOptions.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        {slotOptions.map((opt) => {
                          const isSelected = existingEntry?.option_id === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => selectOption(opt)}
                              disabled={saving}
                              className={`w-full text-start rounded-xl p-3 border transition-all ${
                                isSelected
                                  ? "border-primary-500 bg-primary-50 shadow-sm"
                                  : "border-sand-200 hover:border-primary-300 hover:bg-sand-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-1 h-10 rounded-full shrink-0"
                                  style={{ backgroundColor: getSubjectColor(opt.subject) }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sand-900">{opt.subject}</div>
                                  <div className="text-sm text-sand-500">
                                    {opt.teacher_name}
                                    {opt.room && ` · חדר ${opt.room}`}
                                  </div>
                                </div>
                                {isSelected && (
                                  <span className="text-primary-600 text-sm font-medium shrink-0">✓ נבחר</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-sand-400 mb-4 text-center py-2">
                        אין שיעורים זמינים לתא הזה. ניתן להוסיף שיעור מותאם אישית.
                      </p>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 border-t border-sand-200" />
                      <span className="text-xs text-sand-400">או</span>
                      <div className="flex-1 border-t border-sand-200" />
                    </div>

                    {/* Custom entry toggle */}
                    {!showCustom ? (
                      <button
                        onClick={() => setShowCustom(true)}
                        className="w-full rounded-xl border border-dashed border-sand-300 text-sand-500 hover:border-primary-400 hover:text-primary-500 py-3 text-sm transition-colors"
                      >
                        + הוספה מותאמת אישית
                      </button>
                    ) : (
                      <div className="space-y-3 bg-sand-50 rounded-xl p-4">
                        <Input
                          label="שם השיעור"
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          placeholder="לדוגמה: פסנתר, ציור..."
                          required
                        />
                        <Input
                          label="שם המורה (אופציונלי)"
                          value={customTeacher}
                          onChange={(e) => setCustomTeacher(e.target.value)}
                          placeholder="שם המורה"
                        />
                        <Input
                          label="חדר (אופציונלי)"
                          value={customRoom}
                          onChange={(e) => setCustomRoom(e.target.value)}
                          placeholder="מספר חדר"
                        />
                        <Button
                          onClick={saveCustom}
                          disabled={saving || !customSubject.trim()}
                          size="sm"
                          className="w-full"
                        >
                          {saving ? "שומר..." : "שמירה"}
                        </Button>
                      </div>
                    )}

                    {/* Clear button if there's an existing entry */}
                    {existingEntry && (
                      <button
                        onClick={() => clearEntry(existingEntry.id)}
                        className="w-full mt-4 text-sm text-rainbow-red hover:text-rainbow-red/80 py-2 transition-colors"
                      >
                        🗑️ הסרת השיעור מהתא
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
