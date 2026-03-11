import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "בלוג",
  description: "חדשות, אירועים וסיפורים מבית הספר קשת.",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, published_at, cover_image_url")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

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
          {!posts || posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">✍️</div>
              <h2 className="text-xl font-bold text-sand-900 mb-2">בקרוב כאן יהיו כתבות!</h2>
              <p className="text-sand-500">אנחנו עובדים על תכנים חדשים. חזרו בקרוב.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => {
                const color = RAINBOW_COLORS[index % RAINBOW_COLORS.length];
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-200
                      hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {post.cover_image_url ? (
                      <div className="overflow-hidden">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div
                        className="h-3 w-full"
                        style={{ backgroundColor: color }}
                      />
                    )}
                    <div className="p-6">
                      {post.published_at && (
                        <time className="text-sm text-sand-500 mb-2 block">
                          {new Date(post.published_at).toLocaleDateString("he-IL", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </time>
                      )}
                      <h2 className="text-lg font-bold text-sand-900 mb-2 group-hover:text-primary-700 transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sand-600 text-sm leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
