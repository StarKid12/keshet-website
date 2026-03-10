"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { DAYS_OF_WEEK_HE, RAINBOW_COLORS } from "@/lib/constants";

interface ScheduleEntry {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  subject: string;
  teacher_name: string | null;
  room: string | null;
}

const colorBySubject: Record<string, string> = {};
let colorIndex = 0;

function getSubjectColor(subject: string): string {
  if (!colorBySubject[subject]) {
    colorBySubject[subject] = RAINBOW_COLORS[colorIndex % RAINBOW_COLORS.length];
    colorIndex++;
  }
  return colorBySubject[subject];
}

export default function SchedulePage() {
  const { profile } = useUser();
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchedule() {
      if (!profile?.class_id) {
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase
        .from("schedules")
        .select("*")
        .eq("class_id", profile.class_id)
        .order("start_time");
      setSchedule(data || []);
      setLoading(false);
    }
    fetchSchedule();
  }, [profile?.class_id]);

  // Group by time slots
  const timeSlots = [...new Set(schedule.map((s) => `${s.start_time}-${s.end_time}`))].sort();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">מערכת שעות</h1>
        <p className="text-sand-500 mt-1">מערכת השעות השבועית שלך</p>
      </div>

      {loading ? (
        <div className="animate-pulse bg-sand-200 rounded-2xl h-96" />
      ) : schedule.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
          <svg className="w-16 h-16 text-sand-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-sand-700 mb-2">אין מערכת שעות</h3>
          <p className="text-sand-500">מערכת השעות טרם הוגדרה עבור הכיתה שלך.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-sand-50">
                  <th className="p-3 text-sm font-medium text-sand-500 text-start w-28">שעה</th>
                  {DAYS_OF_WEEK_HE.map((day) => (
                    <th key={day} className="p-3 text-sm font-medium text-sand-700 text-center">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => {
                  const [start, end] = slot.split("-");
                  return (
                    <tr key={slot} className="border-t border-sand-100">
                      <td className="p-3 text-sm text-sand-500" dir="ltr">
                        {start.slice(0, 5)}-{end.slice(0, 5)}
                      </td>
                      {DAYS_OF_WEEK_HE.map((_, dayIndex) => {
                        const entry = schedule.find(
                          (s) => s.day_of_week === dayIndex && `${s.start_time}-${s.end_time}` === slot
                        );
                        return (
                          <td key={dayIndex} className="p-2 text-center">
                            {entry ? (
                              <div
                                className="rounded-lg p-2 text-sm"
                                style={{
                                  backgroundColor: `${getSubjectColor(entry.subject)}15`,
                                  borderRight: `3px solid ${getSubjectColor(entry.subject)}`,
                                }}
                              >
                                <div className="font-medium text-sand-900">{entry.subject}</div>
                                {entry.teacher_name && (
                                  <div className="text-xs text-sand-500">{entry.teacher_name}</div>
                                )}
                                {entry.room && (
                                  <div className="text-xs text-sand-400">חדר {entry.room}</div>
                                )}
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile: Day by day */}
          <div className="md:hidden space-y-4">
            {DAYS_OF_WEEK_HE.map((day, dayIndex) => {
              const dayEntries = schedule
                .filter((s) => s.day_of_week === dayIndex)
                .sort((a, b) => a.start_time.localeCompare(b.start_time));

              if (dayEntries.length === 0) return null;

              return (
                <div key={day} className="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden">
                  <div className="bg-sand-50 px-4 py-3 font-bold text-sand-800 border-b border-sand-200">
                    יום {day}
                  </div>
                  <div className="divide-y divide-sand-100">
                    {dayEntries.map((entry) => (
                      <div key={entry.id} className="px-4 py-3 flex items-center gap-3">
                        <div
                          className="w-1 h-10 rounded-full shrink-0"
                          style={{ backgroundColor: getSubjectColor(entry.subject) }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sand-900">{entry.subject}</div>
                          <div className="text-sm text-sand-500">
                            {entry.teacher_name}
                            {entry.room && ` · חדר ${entry.room}`}
                          </div>
                        </div>
                        <div className="text-sm text-sand-400" dir="ltr">
                          {entry.start_time.slice(0, 5)}-{entry.end_time.slice(0, 5)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
