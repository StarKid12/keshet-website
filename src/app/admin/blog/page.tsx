"use client";

import { useEffect, useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RAINBOW_COLORS } from "@/lib/constants";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export default function AdminBlogPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const supabase = createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }

  function generateSlug(text: string) {
    return text
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\u0590-\u05FFa-zA-Z0-9-]/g, "")
      .toLowerCase();
  }

  function resetForm() {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setPublished(false);
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(post: BlogPost) {
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setContent(post.content);
    setPublished(post.is_published);
    setEditing(post);
    setShowForm(true);
  }

  function startNew() {
    resetForm();
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !user) return;

    setSaving(true);
    const supabase = createClient();
    const postSlug = slug || generateSlug(title);

    if (editing) {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title,
          slug: postSlug,
          excerpt: excerpt || null,
          content,
          is_published: published,
          published_at: published ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editing.id);

      if (!error) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === editing.id
              ? { ...p, title, slug: postSlug, excerpt: excerpt || null, content, is_published: published, published_at: published ? new Date().toISOString() : null, updated_at: new Date().toISOString() }
              : p
          )
        );
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title,
          slug: postSlug,
          excerpt: excerpt || null,
          content,
          is_published: published,
          published_at: published ? new Date().toISOString() : null,
          author_id: user.id,
        })
        .select()
        .single();

      if (!error && data) {
        setPosts((prev) => [data, ...prev]);
        resetForm();
      }
    }
    setSaving(false);
  }

  async function deletePost(id: string) {
    if (!confirm("למחוק את הפוסט?")) return;
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  async function togglePublished(post: BlogPost) {
    const supabase = createClient();
    const newPublished = !post.is_published;
    await supabase
      .from("blog_posts")
      .update({ is_published: newPublished, published_at: newPublished ? new Date().toISOString() : null })
      .eq("id", post.id);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, is_published: newPublished } : p
      )
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">
            ניהול בלוג
          </h1>
          <p className="text-sand-500 mt-1">{posts.length} פוסטים</p>
        </div>
        {!showForm && (
          <Button onClick={startNew}>+ פוסט חדש</Button>
        )}
      </div>

      {/* Editor form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-sand-900">
              {editing ? "עריכת פוסט" : "פוסט חדש"}
            </h2>
            <button
              onClick={resetForm}
              className="text-sand-400 hover:text-sand-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="כותרת"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!editing) setSlug(generateSlug(e.target.value));
              }}
              placeholder="כותרת הפוסט"
              required
            />
            <Input
              label="Slug (כתובת URL)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="slug-של-הפוסט"
              dir="ltr"
            />
            <Input
              label="תקציר"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="תקציר קצר (אופציונלי)"
            />
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-1.5">
                תוכן
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900
                  placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                  outline-none transition-colors resize-y font-mono text-sm"
                placeholder="תוכן הפוסט..."
                required
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded border-sand-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-sand-700">פרסם מיד</span>
            </label>
            <div className="flex gap-3">
              <Button type="submit" disabled={saving || !title.trim() || !content.trim()}>
                {saving ? "שומר..." : editing ? "שמירת שינויים" : "יצירת פוסט"}
              </Button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm text-sand-600 hover:text-sand-800 transition-colors"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-sand-200 rounded-xl h-20" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
          <div className="text-4xl mb-3">✍️</div>
          <h3 className="font-bold text-sand-900 mb-1">אין פוסטים עדיין</h3>
          <p className="text-sm text-sand-500 mb-4">צרו את הפוסט הראשון בבלוג</p>
          {!showForm && <Button onClick={startNew}>+ פוסט חדש</Button>}
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-sand-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-sand-900 truncate">
                      {post.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        post.is_published
                          ? "bg-rainbow-green/10 text-rainbow-green"
                          : "bg-sand-200 text-sand-500"
                      }`}
                    >
                      {post.is_published ? "מפורסם" : "טיוטה"}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="text-sm text-sand-500 truncate">{post.excerpt}</p>
                  )}
                  <p className="text-xs text-sand-400 mt-1">
                    {new Date(post.created_at).toLocaleDateString("he-IL")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePublished(post)}
                    className="p-2 rounded-lg hover:bg-sand-100 transition-colors text-sand-400 hover:text-sand-600"
                    title={post.is_published ? "העברה לטיוטה" : "פרסום"}
                  >
                    {post.is_published ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M15 12a3 3 0 01-3 3m0 0l6.121 6.121" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(post)}
                    className="p-2 rounded-lg hover:bg-sand-100 transition-colors text-sand-400 hover:text-sand-600"
                    title="עריכה"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 rounded-lg hover:bg-rainbow-red/10 transition-colors text-sand-400 hover:text-rainbow-red"
                    title="מחיקה"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
