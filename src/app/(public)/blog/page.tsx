import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "בלוג",
  description: "חדשות, אירועים וסיפורים מבית הספר קשת.",
};

const blogPosts = [
  {
    slug: "purim-2019",
    title: "פורים מגיע לקשת!",
    excerpt: "ההכנות לחג הפורים בעיצומן. תלמידי קשת מתכוננים עם תחפושות, הצגות ופעילויות יצירתיות שמביאות את רוח החג לבית הספר.",
    date: "25 בפברואר 2019",
    author: "צוות קשת",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80",
    color: RAINBOW_COLORS[0],
  },
  {
    slug: "hebrew-language-day",
    title: "יום השפה העברית",
    excerpt: "חגגנו את יום השפה העברית עם חדרי בריחה, תחנות כושר, תחרות עיצוב עוגיות ועוד פעילויות מהנות שחיברו בין שפה לכיף.",
    date: "10 בינואר 2019",
    author: "עיטם און",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80",
    color: RAINBOW_COLORS[1],
  },
  {
    slug: "kfar-rimon",
    title: "כפר רימון",
    excerpt: "שוק בית ספרי מרהיב עם דוכנים שנוהלו על ידי התלמידים, הופעות ואוכל טעים. אירוע שכל הקהילה נהנתה ממנו.",
    date: "13 בדצמבר 2018",
    author: "ענבל דוד",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
    color: RAINBOW_COLORS[3],
  },
  {
    slug: "alumni-evening",
    title: "ערב בוגרים - תשע\"ז",
    excerpt: "ערב מרגש עם בוגרי בית הספר. סיפורים, זכרונות ורגעים מיוחדים עם האנשים שגדלו בקשת.",
    date: "14 במאי 2017",
    author: "דבורה ביבליוביץ",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
    color: RAINBOW_COLORS[4],
  },
  {
    slug: "what-is-democracy",
    title: "סקר רחוב - מהי דמוקרטיה?",
    excerpt: "תלמידי קשת יצאו לרחובות זכרון יעקב לשאול אנשים מהי דמוקרטיה בעיניהם. התשובות היו מפתיעות!",
    date: "19 במרץ 2017",
    author: "יהונתן גולדין",
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600&q=80",
    color: RAINBOW_COLORS[5],
  },
  {
    slug: "keshet-revolution",
    title: "קשת-המהפך",
    excerpt: "סדרת הדרמה של תלמידי קשת חוזרת! פרק חדש בסיפור המרתק שכתבו ובימו התלמידים בעצמם.",
    date: "29 בינואר 2017",
    author: "אלעד קמינסקי",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80",
    color: RAINBOW_COLORS[6],
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-sand-50">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-900 mb-6">בלוג קשת</h1>
            <p className="text-xl text-sand-600 leading-relaxed">
              חדשות, סיפורים ואירועים מחיי בית הספר - נכתב בידי תלמידים וצוות.
            </p>
          </div>
        </Container>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-200
                  hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="h-1 w-full" style={{ backgroundColor: post.color }} />
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-sand-500 mb-2">
                    <time>{post.date}</time>
                    <span>·</span>
                    <span>{post.author}</span>
                  </div>
                  <h2 className="text-lg font-bold text-sand-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sand-600 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
