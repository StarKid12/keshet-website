"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { RAINBOW_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Album {
  id: string;
  title: string;
  description: string | null;
  cover_photo_url: string | null;
  event_date: string | null;
  photo_count?: number;
}

export default function PhotosPage() {
  const { user, profile } = useUser();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploadingAlbumId, setUploadingAlbumId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New album form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  const isTeacherOrAdmin = profile?.role === "teacher" || profile?.role === "admin";

  useEffect(() => {
    async function fetchAlbums() {
      const supabase = createClient();
      let query = supabase
        .from("photo_albums")
        .select("*")
        .order("event_date", { ascending: false });

      // Admin sees all albums, others see only their class albums
      if (profile?.role !== "admin" && profile?.class_id) {
        query = query.eq("class_id", profile.class_id);
      }

      const { data } = await query;
      setAlbums(data || []);
      setLoading(false);
    }

    if (profile) {
      fetchAlbums();
    }
  }, [profile]);

  async function handleCreateAlbum(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile || !newTitle.trim()) return;

    setCreating(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("photo_albums")
      .insert({
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        event_date: newEventDate || null,
        class_id: profile.class_id,
        created_by: user.id,
      })
      .select()
      .single();

    if (!error && data) {
      setAlbums((prev) => [data, ...prev]);
      setNewTitle("");
      setNewDescription("");
      setNewEventDate("");
      setShowForm(false);
    }

    setCreating(false);
  }

  async function handleUploadPhotos(albumId: string, files: FileList) {
    if (!user || files.length === 0) return;

    setUploadingAlbumId(albumId);
    const supabase = createClient();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = `${albumId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("class-photos")
        .upload(filePath, file);

      if (uploadError) continue;

      const { data: urlData } = supabase.storage
        .from("class-photos")
        .getPublicUrl(filePath);

      await supabase.from("class-photos").insert({
        album_id: albumId,
        storage_path: filePath,
        url: urlData.publicUrl,
        uploaded_by: user.id,
        sort_order: i,
      });

      // Set as cover photo if album has none
      const album = albums.find((a) => a.id === albumId);
      if (album && !album.cover_photo_url && i === 0) {
        await supabase
          .from("photo_albums")
          .update({ cover_photo_url: urlData.publicUrl })
          .eq("id", albumId);

        setAlbums((prev) =>
          prev.map((a) =>
            a.id === albumId ? { ...a, cover_photo_url: urlData.publicUrl } : a
          )
        );
      }
    }

    setUploadingAlbumId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">תמונות כיתה</h1>
          <p className="text-sand-500 mt-1">אלבומי תמונות מאירועים ופעילויות</p>
        </div>
        {isTeacherOrAdmin && (
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? "secondary" : "primary"}
            size="sm"
          >
            {showForm ? "ביטול" : "+ אלבום חדש"}
          </Button>
        )}
      </div>

      {/* New Album Form */}
      {showForm && isTeacherOrAdmin && (
        <form
          onSubmit={handleCreateAlbum}
          className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200 mb-8 space-y-4"
        >
          <h2 className="text-lg font-bold text-sand-900">יצירת אלבום חדש</h2>
          <Input
            label="שם האלבום"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="לדוגמה: טיול שנתי 2026"
            required
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-sand-700 mb-1.5">
              תיאור
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="תיאור קצר של האלבום..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 placeholder:text-sand-400 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors duration-200"
            />
          </div>
          <Input
            label="תאריך אירוע"
            type="date"
            value={newEventDate}
            onChange={(e) => setNewEventDate(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={creating || !newTitle.trim()}>
              {creating ? "יוצר..." : "צור אלבום"}
            </Button>
          </div>
        </form>
      )}

      {/* Hidden file input for photo uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && uploadingAlbumId) {
            handleUploadPhotos(uploadingAlbumId, e.target.files);
          }
          e.target.value = "";
        }}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-sand-200 rounded-2xl h-64" />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
          <svg className="w-16 h-16 text-sand-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-sand-700 mb-2">אין אלבומים עדיין</h3>
          <p className="text-sand-500">תמונות מאירועים ופעילויות כיתה יופיעו כאן.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album, index) => (
            <div
              key={album.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-200
                hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <a href={`/photos/${album.id}`}>
                <div className="h-48 bg-sand-100 overflow-hidden">
                  {album.cover_photo_url ? (
                    <img
                      src={album.cover_photo_url}
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-4xl"
                      style={{ backgroundColor: `${RAINBOW_COLORS[index % RAINBOW_COLORS.length]}15` }}
                    >
                      📷
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sand-900">{album.title}</h3>
                  {album.event_date && (
                    <p className="text-sm text-sand-500 mt-1">
                      {new Intl.DateTimeFormat("he-IL").format(new Date(album.event_date))}
                    </p>
                  )}
                </div>
              </a>
              {isTeacherOrAdmin && (
                <div className="px-4 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={uploadingAlbumId === album.id}
                    onClick={() => {
                      setUploadingAlbumId(album.id);
                      fileInputRef.current?.click();
                    }}
                    className="w-full"
                  >
                    {uploadingAlbumId === album.id ? "מעלה תמונות..." : "📤 העלאת תמונות"}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
