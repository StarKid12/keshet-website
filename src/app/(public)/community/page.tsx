import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "חיים בקשת",
  description: "חיי קהילה, אירועים ופעילויות בבית הספר קשת - משפחה אחת גדולה.",
};

const events = [
  {
    title: "כפר רימון",
    description: "שוק בית ספרי שנתי שבו התלמידים מנהלים דוכנים, מציגים הופעות ומכינים אוכל. אירוע קהילתי שכל המשפחה נהנית ממנו.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
    color: RAINBOW_COLORS[1],
  },
  {
    title: "חגים ומועדים",
    description: "חגיגות חגים ייחודיות שמשלבות מסורת ויצירתיות - פורים, חנוכה, פסח, שבועות ועוד. כל חג הוא חוויה בלתי נשכחת.",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80",
    color: RAINBOW_COLORS[0],
  },
  {
    title: "טיולים ומסעות",
    description: "טיולים שנתיים, מסע ישראלי ופעילויות בטבע. ההכרות עם הארץ והסביבה היא חלק מהותי מתוכנית הלימודים.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    color: RAINBOW_COLORS[3],
  },
  {
    title: "ערבי בוגרים",
    description: "מפגשים עם בוגרי בית הספר - לשמוע סיפורים, להתעדכן ולחגוג יחד את הקשר המיוחד שנוצר בקשת.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
    color: RAINBOW_COLORS[5],
  },
  {
    title: "הופעות ויצירה",
    description: "הצגות, מוזיקה, אמנות ויצירה. התלמידים מביאים את הכישרון שלהם לבמה ומפתחים ביטוי עצמי.",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80",
    color: RAINBOW_COLORS[6],
  },
  {
    title: "כנסת קשת",
    description: "אסיפות הכנסת השבועיות - המקום שבו דמוקרטיה חיה. דיונים, הצבעות וקבלת החלטות משותפות.",
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600&q=80",
    color: RAINBOW_COLORS[4],
  },
];

export default function CommunityPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-sand-50">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-900 mb-6">
              חיים ב<img src="/images/logo.png" alt="קשת" className="inline h-12 sm:h-14" />
            </h1>
            <p className="text-xl text-sand-600 leading-relaxed">
              בית הספר הוא הרבה יותר מכיתות ולימודים. זו קהילה חמה, מגוונת ופעילה
              שמעניקה לכל ילד תחושת שייכות.
            </p>
          </div>
        </Container>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-bold text-sand-900 mb-10 text-center">אירועים ופעילויות</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.title}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-200
                  hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="h-1 w-full" style={{ backgroundColor: event.color }} />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-sand-900 mb-2">{event.title}</h3>
                  <p className="text-sand-600 text-sm leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Student Voices */}
      <section className="py-16 bg-sand-50">
        <Container size="md">
          <h2 className="text-3xl font-bold text-sand-900 mb-10 text-center">
            מה התלמידים אומרים
          </h2>
          <div className="space-y-6">
            {[
              { quote: "בית ספר כיפי שבו לומדים דברים ואפשר להשפיע עליו", color: RAINBOW_COLORS[0] },
              { quote: "חופש קיים פה, ומורים שווים לתלמידים", color: RAINBOW_COLORS[3] },
              { quote: "בית שני, מקום שעזר לי לצמוח", color: RAINBOW_COLORS[4] },
              { quote: "משפחה", color: RAINBOW_COLORS[6] },
            ].map((item, index) => (
              <blockquote
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border-e-4 border-sand-200"
                style={{ borderInlineEndColor: item.color }}
              >
                <p className="text-lg text-sand-800 italic">&ldquo;{item.quote}&rdquo;</p>
              </blockquote>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
