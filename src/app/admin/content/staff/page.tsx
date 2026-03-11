"use client";

import { useEffect, useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useImageUpload } from "@/hooks/useImageUpload";
import { RAINBOW_COLORS } from "@/lib/constants";
import Link from "next/link";
import type { StaffMember } from "@/lib/types/cms";

const categories = [
  { value: "management", label: "הנהלה" },
  { value: "coordinator", label: "רכז/ת שכבה" },
  { value: "teacher", label: "מורה" },
];

export default function StaffContentPage() {
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("teacher");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { uploadImage, uploading } = useImageUpload();

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const supabase = createClient();
    // Admin can see all staff (including hidden) - use RPC or service role
    // For now, fetch all and let RLS handle visibility
    const { data } = await supabase
      .from("staff_members")
      .select("*")
      .order("sort_order");
    setMembers((data as StaffMember[]) || []);
    setLoading(false);
  }

  function resetForm() {
    setName("");
    setRole("");
    setCategory("teacher");
    setBio("");
    setImageUrl(null);
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(member: StaffMember) {
    setName(member.name);
    setRole(member.role);
    setCategory(member.category);
    setBio(member.bio || "");
    setImageUrl(member.image_url);
    setEditing(member);
    setShowForm(true);
  }

  async function handleImageUpload(file: File) {
    const ext = file.name.split(".").pop();
    const path = `staff/${Date.now()}.${ext}`;
    const url = await uploadImage(file, path);
    if (url) setImageUrl(url);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    setSaving(true);
    const supabase = createClient();

    if (editing) {
      const { error } = await supabase
        .from("staff_members")
        .update({
          name,
          role,
          category,
          bio: bio || null,
          image_url: imageUrl,
        })
        .eq("id", editing.id);

      if (!error) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === editing.id
              ? { ...m, name, role, category, bio: bio || null, image_url: imageUrl }
              : m
          )
        );
        resetForm();
      }
    } else {
      const maxSort = members.length > 0
        ? Math.max(...members.map((m) => m.sort_order)) + 1
        : 0;

      const { data, error } = await supabase
        .from("staff_members")
        .insert({
          name,
          role,
          category,
          bio: bio || null,
          image_url: imageUrl,
          sort_order: maxSort,
        })
        .select()
        .single();

      if (!error && data) {
        setMembers((prev) => [...prev, data as StaffMember]);
        resetForm();
      }
    }

    await fetch("/api/revalidate", { method: "POST" });
    setSaving(false);
  }

  async function deleteMember(id: string) {
    if (!confirm("למחוק את איש הצוות?")) return;
    const supabase = createClient();
    await supabase.from("staff_members").delete().eq("id", id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    await fetch("/api/revalidate", { method: "POST" });
  }

  async function toggleVisibility(member: StaffMember) {
    const supabase = createClient();
    const newVisible = !member.is_visible;
    await supabase
      .from("staff_members")
      .update({ is_visible: newVisible })
      .eq("id", member.id);
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, is_visible: newVisible } : m))
    );
    await fetch("/api/revalidate", { method: "POST" });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/content"
            className="w-8 h-8 rounded-lg bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
          >
            <svg className="w-4 h-4 text-sand-600 -scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">צוות</h1>
            <p className="text-sand-500 text-sm">{members.length} אנשי צוות</p>
          </div>
        </div>
        {!showForm && <Button onClick={() => setShowForm(true)}>+ איש צוות חדש</Button>}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-sand-900">
              {editing ? "עריכת איש צוות" : "איש צוות חדש"}
            </h2>
            <button onClick={resetForm} className="text-sand-400 hover:text-sand-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="שם"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="שם מלא"
                required
              />
              <Input
                label="תפקיד"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="מנהל/ת, מורה, רכז/ת..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-1.5">
                קטגוריה
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900
                  focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-1.5">
                תיאור קצר
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900
                  placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                  outline-none transition-colors resize-y"
                placeholder="1-2 משפטים על איש הצוות..."
              />
            </div>
            <ImageUploader
              currentUrl={imageUrl}
              onUpload={handleImageUpload}
              onRemove={() => setImageUrl(null)}
              uploading={uploading}
              label="תמונת פרופיל"
            />
            <div className="flex gap-3">
              <Button type="submit" disabled={saving || !name.trim() || !role.trim()}>
                {saving ? "שומר..." : editing ? "שמירת שינויים" : "הוספה"}
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

      {/* Staff list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-sand-200 rounded-xl h-20" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
          <div className="text-4xl mb-3">👩‍🏫</div>
          <h3 className="font-bold text-sand-900 mb-1">אין אנשי צוות עדיין</h3>
          <p className="text-sm text-sand-500 mb-4">הוסיפו את חברי הצוות הראשונים</p>
          {!showForm && <Button onClick={() => setShowForm(true)}>+ איש צוות חדש</Button>}
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member, index) => (
            <div
              key={member.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border border-sand-200 hover:shadow-md transition-shadow ${
                !member.is_visible ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 overflow-hidden"
                  style={{
                    backgroundColor: RAINBOW_COLORS[index % RAINBOW_COLORS.length],
                  }}
                >
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sand-900">{member.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sand-100 text-sand-500">
                      {categories.find((c) => c.value === member.category)?.label || member.category}
                    </span>
                    {!member.is_visible && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sand-200 text-sand-500">
                        מוסתר
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-sand-500">{member.role}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleVisibility(member)}
                    className="p-2 rounded-lg hover:bg-sand-100 transition-colors text-sand-400 hover:text-sand-600"
                    title={member.is_visible ? "הסתרה" : "הצגה"}
                  >
                    {member.is_visible ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M15 12a3 3 0 01-3 3m0 0l6.121 6.121" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(member)}
                    className="p-2 rounded-lg hover:bg-sand-100 transition-colors text-sand-400 hover:text-sand-600"
                    title="עריכה"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteMember(member.id)}
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
