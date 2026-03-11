"use client";

import { useEffect, useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RAINBOW_COLORS } from "@/lib/constants";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  location: string | null;
  category: string;
  created_at: string;
}

const CATEGORIES = [
  { value: "general", label: "כללי", color: RAINBOW_COLORS[4] },
  { value: "holiday", label: "חג / טקס", color: RAINBOW_COLORS[6] },
  { value: "trip", label: "טיול", color: RAINBOW_COLORS[3] },
  { value: "meeting", label: "אסיפת הורים", color: RAINBOW_COLORS[1] },
  { value: "knesset", label: "כנסת קשת", color: RAINBOW_COLORS[0] },
  { value: "performance", label: "הופעה / הצגה", color: RAINBOW_COLORS[2] },
];

function getCategoryInfo(value: string) {
  return CATEGORIES.find((c) => c.value === value) || CATEGORIES[0];
}

export default function AdminEventsPage() {
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("general");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const supabase = createClient();
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });
    setEvents(data || []);
    setLoading(false);
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setLocation("");
    setCategory("general");
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(event: Event) {
    setTitle(event.title);
    setDescription(event.description || "");
    setDate(event.date);
    setTime(event.time || "");
    setLocation(event.location || "");
    setCategory(event.category);
    setEditing(event);
    setShowForm(true);
  }

  function startNew() {
    resetForm();
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date || !user) return;

    setSaving(true);
    const supabase = createClient();

    const eventData = {
      title,
      description: description || null,
      date,
      time: time || null,
      location: location || null,
      category,
    };

    if (editing) {
      const { error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", editing.id);

      if (!error) {
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === editing.id ? { ...ev, ...eventData } : ev
          )
        );
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from("events")
        .insert(eventData)
        .select()
        .single();

      if (!error && data) {
        setEvents((prev) => [...prev, data].sort((a, b) => a.date.localeCompare(b.date)));
        resetForm();
      }
    }
    setSaving(false);
  }

  async function deleteEvent(id: string) {
    if (!confirm("למחוק את האירוע?")) return;
    const supabase = createClient();
    await supabase.from("events").delete().eq("id", id);
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  }

  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = events.filter((ev) => ev.date >= today);
  const pastEvents = events.filter((ev) => ev.date < today);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">
            ניהול אירועים
          </h1>
          <p className="text-sand-500 mt-1">
            {upcomingEvents.length} אירועים קרובים
          </p>
        </div>
        {!showForm && (
          <Button onClick={startNew}>+ אירוע חדש</Button>
        )}
      </div>

      {/* Editor form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-sand-900">
              {editing ? "עריכת אירוע" : "אירוע חדש"}
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
            <Input
              label="שם האירוע"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="למשל: יום פתוח לנרשמים חדשים"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-sand-700 mb-1.5">
                  תאריך
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900
                    focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sand-700 mb-1.5">
                  שעה
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900
                    focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sand-700 mb-1.5">
                  קטגוריה
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900
                    focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Input
              label="מיקום"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="למשל: חצר בית הספר (אופציונלי)"
            />
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-1.5">
                תיאור
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900
                  placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                  outline-none transition-colors resize-none"
                placeholder="פרטים נוספים על האירוע (אופציונלי)"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={saving || !title.trim() || !date}>
                {saving ? "שומר..." : editing ? "שמירת שינויים" : "יצירת אירוע"}
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

      {/* Events list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-sand-200 rounded-xl h-20" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="font-bold text-sand-900 mb-1">אין אירועים עדיין</h3>
          <p className="text-sm text-sand-500 mb-4">צרו את האירוע הראשון</p>
          {!showForm && <Button onClick={startNew}>+ אירוע חדש</Button>}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-sand-900 mb-4">
                אירועים קרובים ({upcomingEvents.length})
              </h2>
              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const cat = getCategoryInfo(event.category);
                  const eventDate = new Date(event.date + "T00:00:00");
                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-sand-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        {/* Date badge */}
                        <div
                          className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: cat.color }}
                        >
                          <span className="text-xl font-bold leading-none">
                            {eventDate.getDate()}
                          </span>
                          <span className="text-[10px] mt-0.5">
                            {eventDate.toLocaleDateString("he-IL", { month: "short" })}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-sand-900">{event.title}</h3>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                              style={{
                                backgroundColor: `${cat.color}15`,
                                color: cat.color,
                              }}
                            >
                              {cat.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-sand-500">
                            <span>
                              {eventDate.toLocaleDateString("he-IL", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })}
                            </span>
                            {event.time && <span>{event.time}</span>}
                            {event.location && <span>📍 {event.location}</span>}
                          </div>
                          {event.description && (
                            <p className="text-sm text-sand-500 mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => startEdit(event)}
                            className="p-2 rounded-lg hover:bg-sand-100 transition-colors text-sand-400 hover:text-sand-600"
                            title="עריכה"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="p-2 rounded-lg hover:bg-rainbow-red/10 transition-colors text-sand-400 hover:text-rainbow-red"
                            title="מחיקה"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-sand-500 mb-4">
                אירועים שעברו ({pastEvents.length})
              </h2>
              <div className="space-y-3 opacity-60">
                {pastEvents.map((event) => {
                  const cat = getCategoryInfo(event.category);
                  const eventDate = new Date(event.date + "T00:00:00");
                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-sand-200"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                          style={{ backgroundColor: cat.color }}
                        >
                          {eventDate.getDate()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sand-700 truncate">
                            {event.title}
                          </h3>
                          <p className="text-xs text-sand-400">
                            {eventDate.toLocaleDateString("he-IL")}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="p-2 rounded-lg hover:bg-rainbow-red/10 transition-colors text-sand-300 hover:text-rainbow-red"
                          title="מחיקה"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
