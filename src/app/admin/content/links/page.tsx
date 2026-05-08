"use client";

import { useEffect, useState } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Input } from "@/components/ui/Input";
import { ContentSection } from "@/components/admin/ContentSection";
import { ListEditor } from "@/components/admin/ListEditor";
import { SaveButton } from "@/components/admin/SaveButton";
import Link from "next/link";

interface LinkItem {
  title: string;
  url: string;
  description?: string;
  icon?: string;
}

export default function LinksContentPage() {
  const { sections, loading, saving, success, saveAllSections } =
    useSiteContent("links");

  const [hero, setHero] = useState({
    title: "קישורים שימושיים",
    description: "כל מה שצריך, במקום אחד. קישורים לסביבות למידה, פורטלים ומידע נוסף.",
  });

  const [items, setItems] = useState<{ items: LinkItem[] }>({
    items: [
      {
        title: "סביבות למידה בענן",
        url: "https://www.edu-haifa.org.il/סביבות-למידה-בענן",
        description: "פורטל סביבות הלמידה של עיריית חיפה.",
        icon: "☁️",
      },
    ],
  });

  useEffect(() => {
    if (!loading && sections) {
      if (sections.hero) setHero((prev) => ({ ...prev, ...sections.hero }));
      if (sections.items) setItems((prev) => ({ ...prev, ...sections.items }));
    }
  }, [loading, sections]);

  async function handleSave() {
    await saveAllSections({ hero, items });
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-sand-200 rounded-xl h-20" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/content"
          className="w-8 h-8 rounded-lg bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
        >
          <svg className="w-4 h-4 text-sand-600 -scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">קישורים שימושיים</h1>
          <p className="text-sand-500 text-sm">קישורים שיופיעו בעמוד &quot;קישורים&quot; באתר הציבורי</p>
        </div>
      </div>

      <div className="space-y-4 max-w-3xl">
        <ContentSection title="כותרת ותיאור">
          <Input
            label="כותרת"
            value={hero.title}
            onChange={(e) => setHero({ ...hero, title: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
            <textarea
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
            />
          </div>
        </ContentSection>

        <ContentSection title="קישורים">
          <ListEditor
            items={items.items}
            onChange={(newItems) => setItems({ items: newItems })}
            createNew={() => ({ title: "", url: "", description: "", icon: "" })}
            addLabel="קישור חדש"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <div className="grid grid-cols-[120px_1fr] gap-3">
                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-1.5">אייקון</label>
                    <div className="flex items-center gap-2">
                      <div className="w-11 h-11 rounded-lg bg-sand-50 border border-sand-200 flex items-center justify-center text-2xl shrink-0">
                        {item.icon || "🔗"}
                      </div>
                      <input
                        type="text"
                        value={item.icon || ""}
                        onChange={(e) => onChange({ ...item, icon: e.target.value })}
                        placeholder="☁️"
                        className="w-full min-w-0 px-2 py-2.5 text-center text-2xl rounded-lg border border-sand-300 bg-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  <Input
                    label="כותרת"
                    value={item.title}
                    onChange={(e) => onChange({ ...item, title: e.target.value })}
                  />
                </div>
                <Input
                  label="קישור (URL)"
                  dir="ltr"
                  type="url"
                  value={item.url}
                  onChange={(e) => onChange({ ...item, url: e.target.value })}
                  placeholder="https://..."
                />
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור (אופציונלי)</label>
                  <textarea
                    value={item.description || ""}
                    onChange={(e) => onChange({ ...item, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
                  />
                </div>
              </div>
            )}
          />
        </ContentSection>

        <SaveButton saving={saving} onClick={handleSave} successMessage={success} />
      </div>
    </div>
  );
}
