import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "לוח אירועים",
  description: "אירועים, חגים ופעילויות בבית הספר הדמוקרטי יהודי-פלורליסטי קשת בזכרון יעקב.",
};

// Placeholder events - will be replaced with Supabase data
const upcomingEvents = [
  {
    title: "יום פתוח למשפחות חדשות",
    date: "2026-04-15",
    time: "10:00-12:00",
    location: "קמפוס בית הספר",
    description: "הזדמנות להכיר את קשת מקרוב - סיור בבית הספר, מפגש עם הצוות והתלמידים, ושיחה על הגישה החינוכית שלנו.",
    category: "הרשמה",
    color: RAINBOW_COLORS[0],
  },
  {
    title: "כנסת קשת - מושב מיוחד",
    date: "2026-04-20",
    time: "09:00-10:30",
    location: "אולם בית הספר",
    description: "מושב מיוחד של כנסת קשת לדיון בתוכנית הפעילויות של סוף השנה. כל התלמידים והצוות מוזמנים.",
    category: "דמוקרטיה",
    color: RAINBOW_COLORS[4],
  },
  {
    title: "טיול שנתי - בית צעירים",
    date: "2026-04-28",
    time: "08:00-14:00",
    location: "פארק הכרמל",
    description: "טיול שנתי לתלמידי בית הצעירים (גן - כיתה ב׳). יום של הליכה בטבע, משחקים ופעילויות.",
    category: "טיולים",
    color: RAINBOW_COLORS[3],
  },
  {
    title: "הצגת תיאטרון - חממה",
    date: "2026-05-05",
    time: "18:00-19:30",
    location: "אולם בית הספר",
    description: "תלמידי החממה מציגים את ההצגה שהכינו במהלך השנה. המשפחות מוזמנות!",
    category: "תרבות",
    color: RAINBOW_COLORS[6],
  },
  {
    title: "יום הפלורליזם",
    date: "2026-05-12",
    time: "09:00-13:00",
    location: "קמפוס בית הספר",
    description: "יום מיוחד שבו אנחנו חוגגים את המגוון שלנו. סדנאות, שיחות, אוכל מכל העדות ופעילויות משותפות.",
    category: "קהילה",
    color: RAINBOW_COLORS[1],
  },
  {
    title: "ערב בוגרים",
    date: "2026-05-20",
    time: "19:00-21:00",
    location: "חצר בית הספר",
    description: "מפגש שנתי עם בוגרי קשת. סיפורים, זיכרונות וחגיגה של הקשר המיוחד שנוצר כאן.",
    category: "קהילה",
    color: RAINBOW_COLORS[5],
  },
  {
    title: "שבועות - חגיגה בית ספרית",
    date: "2026-05-31",
    time: "09:00-12:00",
    location: "קמפוס בית הספר",
    description: "חגיגת שבועות עם ביכורים, הופעות, אוכל חלבי ופעילויות לכל הגילאים.",
    category: "חגים",
    color: RAINBOW_COLORS[2],
  },
  {
    title: "כפר רימון - השוק השנתי",
    date: "2026-06-10",
    time: "16:00-20:00",
    location: "קמפוס בית הספר",
    description: "האירוע הגדול של השנה! שוק בית ספרי שבו התלמידים מנהלים דוכנים, מציגים הופעות ומכינים אוכל. כל המשפחה מוזמנת.",
    category: "קהילה",
    color: RAINBOW_COLORS[0],
  },
];

const categories = [
  { label: "הכל", value: "all" },
  { label: "הרשמה", value: "הרשמה" },
  { label: "דמוקרטיה", value: "דמוקרטיה" },
  { label: "טיולים", value: "טיולים" },
  { label: "תרבות", value: "תרבות" },
  { label: "קהילה", value: "קהילה" },
  { label: "חגים", value: "חגים" },
];

function formatHebrewDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(dateStr: string): { day: string; month: string } {
  const date = new Date(dateStr);
  return {
    day: date.getDate().toString(),
    month: date.toLocaleDateString("he-IL", { month: "short" }),
  };
}

export default function EventsPage() {
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
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <span
                key={cat.value}
                className={`text-sm font-medium px-4 py-2 rounded-full cursor-pointer transition-colors ${
                  cat.value === "all"
                    ? "bg-sand-900 text-white"
                    : "bg-sand-100 text-sand-600 hover:bg-sand-200"
                }`}
              >
                {cat.label}
              </span>
            ))}
          </div>

          {/* Events */}
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => {
              const shortDate = formatShortDate(event.date);
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    {/* Date badge */}
                    <div
                      className="w-20 sm:w-24 shrink-0 flex flex-col items-center justify-center text-white py-4"
                      style={{ backgroundColor: event.color }}
                    >
                      <span className="text-2xl sm:text-3xl font-bold leading-none">
                        {shortDate.day}
                      </span>
                      <span className="text-xs sm:text-sm mt-1 opacity-90">
                        {shortDate.month}
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
                            backgroundColor: `${event.color}15`,
                            color: event.color,
                          }}
                        >
                          {event.category}
                        </span>
                      </div>
                      <p className="text-sand-600 text-sm mb-3 leading-relaxed">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-sand-500">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatHebrewDate(event.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Note */}
          <p className="text-center mt-10 text-sand-500 text-sm">
            * לוח האירועים מתעדכן באופן שוטף. עקבו אחרי ההודעות באזור האישי לעדכונים נוספים.
          </p>
        </Container>
      </section>
    </>
  );
}
