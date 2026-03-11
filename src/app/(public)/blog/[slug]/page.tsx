import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) {
    notFound();
  }

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

          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-8"
            />
          )}

          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-sand-900 mb-4">
              {post.title}
            </h1>
            {post.published_at && (
              <time className="text-sand-500">
                {new Date(post.published_at).toLocaleDateString("he-IL", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
          </header>

          <div className="rainbow-divider rounded-full mb-8" />

          <div className="prose prose-lg max-w-none text-sand-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
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
