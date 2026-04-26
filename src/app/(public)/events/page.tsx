import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "לוח אירועים",
  description: "אירועים, חגים ופעילויות בבית הספר הדמוקרטי יהודי-פלורליסטי קשת בזכרון יעקב.",
};

const CATEGORY_COLORS: Record<string, string> = {
  general: RAINBOW_COLORS[4],
  holiday: RAINBOW_COLORS[6],
  trip: RAINBOW_COLORS[3],
  meeting: RAINBOW_COLORS[1],
  knesset: RAINBOW_COLORS[0],
  performance: RAINBOW_COLORS[2],
};

const CATEGORY_LABELS: Record<string, string> = {
  general: "כללי",
  holiday: "חג / טקס",
  trip: "טיול",
  meeting: "אסיפת הורים",
  knesset: "כנסת קשת",
  performance: "הופעה / הצגה",
};

export default async function EventsPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true });

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-sand-50">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-900 mb-6">
              לוח אירועים
            </h1>
            <p className="text-xl text-sand-600 leading-relaxed">
              כל האירועים, החגים והפעילויות של קשת במקום אחד.
              בית הספר תוסס כל השנה!
            </p>
          </div>
        </Container>
      </section>

      {/* Events List */}
      <section className="py-16">
        <Container>
          {!events || events.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📅</div>
              <h2 className="text-xl font-bold text-sand-900 mb-2">אין אירועים קרובים</h2>
              <p className="text-sand-500">בקרוב יתפרסמו אירועים חדשים.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const color = CATEGORY_COLORS[event.category] || RAINBOW_COLORS[4];
                const categoryLabel = CATEGORY_LABELS[event.category] || "כללי";
                const eventDate = new Date(event.date + "T00:00:00");

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex">
                      {/* Date badge */}
                      <div
                        className="w-20 sm:w-24 shrink-0 flex flex-col items-center justify-center text-white py-4"
                        style={{ backgroundColor: color }}
                      >
                        <span className="text-2xl sm:text-3xl font-bold leading-none">
                          {eventDate.getDate()}
                        </span>
                        <span className="text-xs sm:text-sm mt-1 opacity-90">
                          {eventDate.toLocaleDateString("he-IL", { month: "short" })}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 sm:p-5">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-sand-900">
                            {event.title}
                          </h3>
                          <span
                            className="text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: `${color}15`,
                              color: color,
                            }}
                          >
                            {categoryLabel}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sand-600 text-sm mb-3 leading-relaxed">
                            {event.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-sand-500">
                          {event.time && (
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {event.time}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {event.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {eventDate.toLocaleDateString("he-IL", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-center mt-10 text-sand-500 text-sm">
            * לוח האירועים מתעדכן באופן שוטף.
          </p>
        </Container>
      </section>
    </>
  );
}
