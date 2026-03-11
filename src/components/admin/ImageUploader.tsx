"use client";

import { useRef } from "react";

interface ImageUploaderProps {
  currentUrl?: string | null;
  onUpload: (file: File) => void;
  onRemove?: () => void;
  uploading?: boolean;
  label?: string;
}

export function ImageUploader({
  currentUrl,
  onUpload,
  onRemove,
  uploading = false,
  label = "תמונה",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-sand-700 mb-1.5">
        {label}
      </label>
      <div className="flex items-start gap-4">
        {currentUrl ? (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-sand-200 shrink-0">
            <img
              src={currentUrl}
              alt=""
              className="w-full h-full object-cover"
            />
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
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 text-sm font-medium bg-sand-100 text-sand-700 rounded-lg hover:bg-sand-200 transition-colors disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
}
