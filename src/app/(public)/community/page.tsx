import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";
import { getPageContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "חיים בקשת",
  description: "חיי קהילה, אירועים ופעילויות בבית הספר קשת - משפחה אחת גדולה.",
};

const defaults = {
  hero: {
    title: "חיים בקשת",
    description: "בית הספר הוא הרבה יותר מכיתות ולימודים. זו קהילה חמה, מגוונת ופעילה שמעניקה לכל ילד תחושת שייכות.",
  },
  events: {
    heading: "אירועים ופעילויות",
    items: [
      { title: "כפר רימון", description: "שוק בית ספרי שנתי שבו התלמידים מנהלים דוכנים, מציגים הופעות ומכינים אוכל. אירוע קהילתי שכל המשפחה נהנית ממנו.", image_url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80" },
      { title: "חגים ומועדים", description: "חגיגות חגים ייחודיות שמשלבות מסורת ויצירתיות - פורים, חנוכה, פסח, שבועות ועוד. כל חג הוא חוויה בלתי נשכחת.", image_url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80" },
      { title: "טיולים ומסעות", description: "טיולים שנתיים, מסע ישראלי ופעילויות בטבע. ההכרות עם הארץ והסביבה היא חלק מהותי מתוכנית הלימודים.", image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80" },
      { title: "ערבי בוגרים", description: "מפגשים עם בוגרי בית הספר - לשמוע סיפורים, להתעדכן ולחגוג יחד את הקשר המיוחד שנוצר בקשת.", image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80" },
      { title: "הופעות ויצירה", description: "הצגות, מוזיקה, אמנות ויצירה. התלמידים מביאים את הכישרון שלהם לבמה ומפתחים ביטוי עצמי.", image_url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80" },
      { title: "כנסת קשת", description: "אסיפות הכנסת השבועיות - המקום שבו דמוקרטיה חיה. דיונים, הצבעות וקבלת החלטות משותפות.", image_url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600&q=80" },
    ],
  },
  testimonials: {
    heading: "מה התלמידים אומרים",
    items: [
      { quote: "בית ספר כיפי שבו לומדים דברים ואפשר להשפיע עליו" },
      { quote: "חופש קיים פה, ומורים שווים לתלמידים" },
      { quote: "בית שני, מקום שעזר לי לצמוח" },
      { quote: "משפחה" },
    ],
  },
};

const eventColors = [RAINBOW_COLORS[1], RAINBOW_COLORS[0], RAINBOW_COLORS[3], RAINBOW_COLORS[5], RAINBOW_COLORS[6], RAINBOW_COLORS[4]];
const quoteColors = [RAINBOW_COLORS[0], RAINBOW_COLORS[3], RAINBOW_COLORS[4], RAINBOW_COLORS[6]];

export default async function CommunityPage() {
  const content = await getPageContent("community");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (key: string) => ({ ...defaults[key as keyof typeof defaults], ...(content[key] as any) });
  const hero = c("hero");
  const events = c("events");
  const testimonials = c("testimonials");

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-sand-50">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-900 mb-6">
              {hero.title.includes("קשת") ? (
                <>
                  חיים ב<img src="/images/logo.png" alt="קשת" className="inline h-16 sm:h-20" style={{ verticalAlign: "middle", marginTop: "-0.15em" }} />
                </>
              ) : hero.title}
            </h1>
            <p className="text-xl text-sand-600 leading-relaxed">{hero.description}</p>
          </div>
        </Container>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-bold text-sand-900 mb-10 text-center">{events.heading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.items.map((event: { title: string; description: string; image_url: string }, index: number) => (
              <div
                key={event.title}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-200
                  hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="overflow-hidden">
                  <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="h-1 w-full" style={{ backgroundColor: eventColors[index % eventColors.length] }} />
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
          <h2 className="text-3xl font-bold text-sand-900 mb-10 text-center">{testimonials.heading}</h2>
          <div className="space-y-6">
            {testimonials.items.map((item: { quote: string }, index: number) => (
              <blockquote
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border-e-4 border-sand-200"
                style={{ borderInlineEndColor: quoteColors[index % quoteColors.length] }}
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
