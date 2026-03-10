import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { RAINBOW_COLORS } from "@/lib/constants";

const placeholderPosts = [
  {
    slug: "purim-2019",
    title: "פורים מגיע לקשת!",
    excerpt: "ההכנות לחג הפורים בעיצומן. תלמידי קשת מתכוננים עם תחפושות, הצגות ופעילויות יצירתיות.",
    date: "25 בפברואר 2019",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80",
    color: RAINBOW_COLORS[0],
  },
  {
    slug: "hebrew-language-day",
    title: "יום השפה העברית",
    excerpt: "חגגנו את יום השפה העברית עם חדרי בריחה, תחנות כושר ותחרות עיצוב עוגיות.",
    date: "10 בינואר 2019",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80",
    color: RAINBOW_COLORS[3],
  },
  {
    slug: "kfar-rimon",
    title: "כפר רימון",
    excerpt: "שוק בית ספרי מרהיב עם דוכנים שנוהלו על ידי התלמידים, הופעות ואוכל.",
    date: "13 בדצמבר 2018",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
    color: RAINBOW_COLORS[5],
  },
];

export function NewsPreview() {
  return (
    <section className="py-20 bg-sand-50">
      <Container>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-900 mb-2">
              חדשות ואירועים
            </h2>
            <p className="text-lg text-sand-600">
              מה קורה בקשת
            </p>
          </div>
          <Link href="/blog">
            <Button variant="ghost" className="hidden sm:inline-flex">
              כל הכתבות
              <svg className="w-4 h-4 me-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {placeholderPosts.map((post) => (
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
              <div
                className="h-1 w-full"
                style={{ backgroundColor: post.color }}
              />
              <div className="p-6">
                <time className="text-sm text-sand-500">{post.date}</time>
                <h3 className="text-lg font-bold text-sand-900 mt-1 mb-2 group-hover:text-primary-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sand-600 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link href="/blog">
            <Button variant="outline">כל הכתבות</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
