"use client";

import { useEffect, useRef } from "react";

interface BoldableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

/**
 * A contenteditable replacement for <textarea> that supports a single
 * formatting action — bold — via a toolbar button. The selected text gets
 * wrapped in <strong>...</strong>. The value is kept as an HTML string so it
 * round-trips with the dangerouslySetInnerHTML renderer on the public page.
 *
 * Why contenteditable and not a textarea + button that injects tags: the user
 * shouldn't see raw <strong> markup. Here they see bold styling directly.
 */
export function BoldableTextarea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: BoldableTextareaProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Sync the external value into the DOM only when it has actually changed —
  // otherwise the caret jumps on every keystroke as React re-renders.
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  function applyBold(e: React.MouseEvent) {
    // mousedown rather than click — preserves the selection in the editor
    e.preventDefault();
    if (!ref.current) return;
    ref.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      // No selection — bail; the secretaries asked for "tap a button to bold
      // selected text", not "insert empty bold marker."
      return;
    }
    // Use execCommand for toggle behaviour (bold ↔ unbold) — deprecated but
    // works in every browser we care about and is the simplest path.
    // styleWithCSS=false makes the browser emit <b>, then we normalise to
    // <strong> after the fact so the saved HTML stays consistent.
    document.execCommand("styleWithCSS", false, "false");
    document.execCommand("bold", false);

    // Normalise <b> to <strong> for consistency with how the page was
    // previously authored by hand.
    const normalised = ref.current.innerHTML
      .replace(/<b>/gi, "<strong>")
      .replace(/<\/b>/gi, "</strong>");
    if (normalised !== ref.current.innerHTML) {
      ref.current.innerHTML = normalised;
    }
    onChange(ref.current.innerHTML);
  }

  function handleInput(e: React.FormEvent<HTMLDivElement>) {
    onChange((e.target as HTMLDivElement).innerHTML);
  }

  // Approximate textarea height so layout matches the rest of the admin
  // form. lh of 1.625 (Tailwind's leading-relaxed) × rows × base 16px.
  const minHeight = `${Math.round(rows * 1.625 * 16)}px`;

  return (
    <div>
      <div className="flex gap-1 mb-1.5">
        <button
          type="button"
          onMouseDown={applyBold}
          className="px-3 py-1 text-sm font-bold border border-sand-300 rounded hover:bg-sand-100 transition-colors"
          title="הדגשה — סמנו טקסט ולחצו"
          aria-label="הדגשת טקסט נבחר"
        >
          B
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dir="auto"
        data-placeholder={placeholder}
        className="boldable w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors leading-relaxed [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-sand-400 [&:empty:before]:pointer-events-none"
        style={{ minHeight }}
      />
    </div>
  );
}
