"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RAINBOW_COLORS } from "@/lib/constants";

interface Album {
  id: string;
  title: string;
  description: string | null;
  cover_photo_url: string | null;
  event_date: string | null;
  photo_count?: number;
}

export default function PhotosPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbums() {
      const supabase = createClient();
      const { data } = await supabase
        .from("photo_albums")
        .select("*")
        .order("event_date", { ascending: false });
      setAlbums(data || []);
      setLoading(false);
    }
    fetchAlbums();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">תמונות כיתה</h1>
          <p className="text-sand-500 mt-1">אלבומי תמונות מאירועים ופעילויות</p>
        </div>
      </div>

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
            <a
              key={album.id}
              href={`/photos/${album.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-200
                hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
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
          ))}
        </div>
      )}
    </div>
  );
}
