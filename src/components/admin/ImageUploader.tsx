"use client";

import { useRef, useState } from "react";
import { MediaEmbed, isVideoUrl } from "@/components/ui/MediaEmbed";

interface ImageUploaderProps {
  currentUrl?: string | null;
  onUpload: (file: File) => void;
  onUrlSet?: (url: string) => void;
  onRemove?: () => void;
  uploading?: boolean;
  label?: string;
}

export function ImageUploader({
  currentUrl,
  onUpload,
  onUrlSet,
  onRemove,
  uploading = false,
  label = "תמונה",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  }

  function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (trimmed && onUrlSet) {
      onUrlSet(trimmed);
      setUrlInput("");
    }
  }

  const isVideo = isVideoUrl(currentUrl);

  return (
    <div>
      <label className="block text-sm font-medium text-sand-700 mb-1.5">
        {label}
      </label>
      <div className="flex items-start gap-4">
        {currentUrl ? (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-sand-200 shrink-0 bg-sand-100">
            <MediaEmbed
              url={currentUrl}
              alt=""
              className="w-full h-full object-cover border-0"
            />
            {isVideo && (
              <div className="absolute bottom-1 start-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium pointer-events-none">
                וידאו
              </div>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="absolute top-1 end-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="w-32 h-32 rounded-xl border-2 border-dashed border-sand-300 flex items-center justify-center text-sand-400 shrink-0">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="flex flex-col gap-2 flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 text-sm font-medium bg-sand-100 text-sand-700 rounded-lg hover:bg-sand-200 transition-colors disabled:opacity-50 self-start"
          >
            {uploading ? "מעלה..." : currentUrl ? "החלפת תמונה" : "העלאת תמונה"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            className="hidden"
          />
          <p className="text-xs text-sand-400">JPG, PNG או WebP. עד 5MB.</p>

          {onUrlSet && (
            <form onSubmit={handleUrlSubmit} className="flex gap-2 mt-1">
              <input
                type="url"
                dir="ltr"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="או הדבקת קישור YouTube / Vimeo"
                className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-lg border border-sand-300 bg-white text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
              />
              <button
                type="submit"
                disabled={!urlInput.trim()}
                className="px-3 py-1.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                החלה
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
