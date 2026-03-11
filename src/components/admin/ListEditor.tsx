"use client";

import { RAINBOW_COLORS } from "@/lib/constants";

interface ListEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, onChange: (item: T) => void) => React.ReactNode;
  createNew: () => T;
  addLabel?: string;
}

export function ListEditor<T>({
  items,
  onChange,
  renderItem,
  createNew,
  addLabel = "הוספה",
}: ListEditorProps<T>) {
  function handleItemChange(index: number, updated: T) {
    const newItems = [...items];
    newItems[index] = updated;
    onChange(newItems);
  }

  function addItem() {
    onChange([...items, createNew()]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onChange(newItems);
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="relative bg-sand-50 rounded-xl p-4 border border-sand-200"
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{
                backgroundColor:
                  RAINBOW_COLORS[index % RAINBOW_COLORS.length],
              }}
            >
              {index + 1}
            </span>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => moveItem(index, "up")}
              disabled={index === 0}
              className="p-1 text-sand-400 hover:text-sand-600 disabled:opacity-30 transition-colors"
              title="הזז למעלה"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => moveItem(index, "down")}
              disabled={index === items.length - 1}
              className="p-1 text-sand-400 hover:text-sand-600 disabled:opacity-30 transition-colors"
              title="הזז למטה"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-1 text-sand-400 hover:text-rainbow-red transition-colors"
              title="מחיקה"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          {renderItem(item, index, (updated) => handleItemChange(index, updated))}
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-sand-300 rounded-xl text-sm font-medium text-sand-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
      >
        + {addLabel}
      </button>
    </div>
  );
}
