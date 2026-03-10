import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";

const values = [
  {
    title: "דמוקרטיה",
    description:
      "בקשת, כל קול נשמע. התלמידים שותפים פעילים בעיצוב חיי בית הספר דרך כנסת קשת - מערכת הממשל הדמוקרטית שלנו.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: RAINBOW_COLORS[4], // blue
  },
  {
    title: "פלורליזם",
    description:
      "אנחנו מאמינים במגוון. בית ספר יהודי שמכבד את כל הגוונים והזהויות, ומטפח שיח פתוח ומכבד בין עולמות שונים.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    color: RAINBOW_COLORS[3], // green
  },
  {
    title: "קהילה",
    description:
      "קשת היא יותר מבית ספר - היא משפחה. קהילה חמה ואוהבת שבה כל ילד מוכר, נראה ומלווה בדרכו הייחודית.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    color: RAINBOW_COLORS[0], // red
  },
];

export function PhilosophySection() {
  return (
    <section className="py-20 bg-sand-50">
      <Container>
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-900 mb-4">
            חינוך דמוקרטי יהודי-פלורליסטי
          </h2>
          <p className="text-lg text-sand-600 max-w-2xl mx-auto">
            שלושת העמודים שעליהם נבנה בית הספר שלנו
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-sand-200
                hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                style={{ backgroundColor: `${value.color}15`, color: value.color }}
              >
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-sand-900 mb-3">
                {value.title}
              </h3>
              <p className="text-sand-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
