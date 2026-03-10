"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
}

interface Album {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
}

export default function AlbumDetailPage() {
  const params = useParams();
  const albumId = params.albumId as string;
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    async function fetchAlbum() {
      const supabase = createClient();
      const [albumRes, photosRes] = await Promise.all([
        supabase.from("photo_albums").select("*").eq("id", albumId).single(),
        supabase.from("photos").select("*").eq("album_id", albumId).order("sort_order"),
      ]);
      setAlbum(albumRes.data);
      setPhotos(photosRes.data || []);
      setLoading(false);
    }
    fetchAlbum();
  }, [albumId]);

  return (
    <div>
      <Link
        href="/photos"
        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 mb-6"
      >
        <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        חזרה לאלבומים
      </Link>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-sand-200 rounded-lg w-48" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-sand-200 rounded-xl" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-sand-900 mb-2">{album?.title}</h1>
          {album?.description && (
            <p className="text-sand-600 mb-6">{album.description}</p>
          )}

          {photos.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-200 text-center">
              <p className="text-sand-500">אין תמונות באלבום זה עדיין.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || ""}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm">{photo.caption}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 end-4 text-white/80 hover:text-white p-2"
            onClick={() => setSelectedPhoto(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedPhoto.url}
            alt={selectedPhoto.caption || ""}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {selectedPhoto.caption && (
            <p className="absolute bottom-6 text-white text-center bg-black/50 px-4 py-2 rounded-lg">
              {selectedPhoto.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
