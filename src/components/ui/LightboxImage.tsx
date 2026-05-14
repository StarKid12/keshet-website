"use client";

import { useEffect, useState } from "react";

interface LightboxImageProps {
  src: string;
  alt?: string;
  thumbClassName?: string;
}

/**
 * An image that opens to a fullscreen overlay on click. Close by clicking the
 * backdrop, the X button, or pressing ESC. Locks body scroll while open.
 */
export function LightboxImage({ src, alt = "", thumbClassName }: LightboxImageProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    // Lock body scroll while the lightbox is open so the page behind doesn't
    // move when the user clicks the backdrop on mobile.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`block group cursor-zoom-in ${thumbClassName || ""}`}
        aria-label={alt ? `הגדלת תמונה: ${alt}` : "הגדלת תמונה"}
      >
        <img src={src} alt={alt} className="block w-full h-auto" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-150 cursor-zoom-out"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="absolute top-4 end-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="סגירה"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full w-auto h-auto rounded-lg shadow-2xl cursor-default"
          />
        </div>
      )}
    </>
  );
}
