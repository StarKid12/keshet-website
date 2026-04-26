import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MediaEmbed } from "@/components/ui/MediaEmbed";
import { RAINBOW_COLORS } from "@/lib/constants";

const highlights = [
  {
    title: "בית צעירים",
    description: "סביבה מטפחת ומעשירה לגילאי הגן, עם דגש על למידה דרך משחק וחוויה.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&q=80",
    href: "/academics",
    color: RAINBOW_COLORS[0],
  },
  {
    title: "חממה",
    description: "חינוך יסודי שמשלב לימודים אקדמיים עם ערכים דמוקרטיים ויהודיים-פלורליסטיים.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80",
    href: "/academics",
    color: RAINBOW_COLORS[1],
  },
  {
    title: 'שכב"ג',
    description: "שנות המעבר - ליווי אישי, העצמה ופיתוח חשיבה עצמאית ואחראית.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
    href: "/academics",
    color: RAINBOW_COLORS[3],
  },
  {
    title: "תיכון",
    description: "הכנה לבגרות ולחיים. העמקה אקדמית, מנהיגות ומעורבות קהילתית.",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80",
    href: "/academics",
    color: RAINBOW_COLORS[4],
  },
  {
    title: "חיי קהילה",
    description: "אירועים, חגים, טיולים ופעילויות שמחזקות את הקשר בין תלמידים, מורים ומשפחות.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    href: "/community",
    color: RAINBOW_COLORS[5],
  },
  {
    title: "כנסת קשת",
    description: "מערכת הממשל הדמוקרטית של בית הספר. כאן התלמידים מחליטים, מציעים ומשפיעים.",
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600&q=80",
    href: "/about",
    color: RAINBOW_COLORS[6],
  },
];

interface HighlightsGridProps {
  content?: {
    heading?: string;
    subheading?: string;
    items?: Array<{ title: string; description: string; image_url: string; href: string }>;
  };
}

export function HighlightsGrid({ content }: HighlightsGridProps = {}) {
  const heading = content?.heading ?? "מה מחכה לכם בקשת";
  const subheading = content?.subheading ?? "מסלולי לימוד מגוונים וחיי קהילה עשירים מגן ועד י\"ב";
  const displayHighlights = content?.items
    ? content.items.map((item, i) => ({
        title: item.title,
        description: item.description,
        image: item.image_url,
        href: item.href,
        color: RAINBOW_COLORS[i % RAINBOW_COLORS.length],
      }))
    : highlights;
  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-900 mb-4">
            {heading}
          </h2>
          <p className="text-lg text-sand-600 max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayHighlights.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-200
                hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="overflow-hidden h-48">
                <MediaEmbed
                  url={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 border-0"
                />
              </div>
              {/* Color accent bar */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="p-6">
                <h3 className="text-lg font-bold text-sand-900 mb-2 group-hover:text-primary-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sand-600 text-sm leading-relaxed">
                  {item.description}
                </p>
                <span
                  className="inline-flex items-center mt-4 text-sm font-medium transition-colors"
                  style={{ color: item.color }}
                >
                  למידע נוסף
                  <svg className="w-4 h-4 me-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
