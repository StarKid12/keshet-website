import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { RAINBOW_COLORS } from "@/lib/constants";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

const getLatestPosts = unstable_cache(
  async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug, title, excerpt, published_at, cover_image_url")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) return [];
      return data || [];
    } catch {
      return [];
    }
  },
  ["latest-posts"],
  { revalidate: 300, tags: ["cms"] }
);

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function NewsPreview() {
  const posts = await getLatestPosts();

  if (posts.length === 0) return null;

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
          {posts.map((post, index) => (
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
                  className="w-full h-48"
                  style={{ backgroundColor: RAINBOW_COLORS[index % RAINBOW_COLORS.length] + "20" }}
                />
              )}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: RAINBOW_COLORS[index % RAINBOW_COLORS.length] }}
              />
              <div className="p-6">
                <time className="text-sm text-sand-500">
                  {post.published_at ? formatDate(post.published_at) : ""}
                </time>
                <h3 className="text-lg font-bold text-sand-900 mt-1 mb-2 group-hover:text-primary-700 transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sand-600 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
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
