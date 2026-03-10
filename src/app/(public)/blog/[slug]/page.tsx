import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

// Placeholder blog post detail page
// In production, this would fetch from Supabase
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <article className="py-16">
        <Container size="md">
          <Link href="/blog" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 mb-8">
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            חזרה לבלוג
          </Link>

          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-sand-900 mb-4">
              {slug.replace(/-/g, " ")}
            </h1>
            <div className="flex items-center gap-3 text-sand-500">
              <time>תאריך פרסום</time>
              <span>·</span>
              <span>צוות קשת</span>
            </div>
          </header>

          <div className="rainbow-divider rounded-full mb-8" />

          <div className="prose prose-lg max-w-none text-sand-700 leading-relaxed">
            <p>
              תוכן הכתבה יוצג כאן. בשלב זה, עמוד הבלוג מציג תוכן לדוגמה.
              בגרסה הסופית, התוכן ייטען מבסיס הנתונים (Supabase).
            </p>
            <p>
              הכתבות נכתבות על ידי תלמידים וצוות בית הספר קשת, ומספרות על
              אירועים, פעילויות ורגעים מיוחדים בחיי בית הספר.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-sand-200">
            <Link href="/blog">
              <Button variant="outline">חזרה לכל הכתבות</Button>
            </Link>
          </div>
        </Container>
      </article>
    </>
  );
}
