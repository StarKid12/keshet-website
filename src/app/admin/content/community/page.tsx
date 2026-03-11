"use client";

import { useEffect, useState } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Input } from "@/components/ui/Input";
import { ContentSection } from "@/components/admin/ContentSection";
import { ListEditor } from "@/components/admin/ListEditor";
import { SaveButton } from "@/components/admin/SaveButton";
import Link from "next/link";

export default function CommunityContentPage() {
  const { sections, loading, saving, success, saveAllSections } =
    useSiteContent("community");

  const [hero, setHero] = useState({
    title: "חיים בקשת",
    description: "בית הספר הוא הרבה יותר מכיתות ולימודים. זו קהילה חמה, מגוונת ופעילה שמעניקה לכל ילד תחושת שייכות.",
  });

  const [events, setEvents] = useState({
    heading: "אירועים ופעילויות",
    items: [
      { title: "כפר רימון", description: "שוק בית ספרי שנתי שבו התלמידים מנהלים דוכנים, מציגים הופעות ומכינים אוכל.", image_url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80" },
      { title: "חגים ומועדים", description: "חגיגות חגים ייחודיות שמשלבות מסורת ויצירתיות - פורים, חנוכה, פסח, שבועות ועוד.", image_url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80" },
      { title: "טיולים ומסעות", description: "טיולים שנתיים, מסע ישראלי ופעילויות בטבע.", image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80" },
      { title: "ערבי בוגרים", description: "מפגשים עם בוגרי בית הספר - לשמוע סיפורים, להתעדכן ולחגוג יחד.", image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80" },
      { title: "הופעות ויצירה", description: "הצגות, מוזיקה, אמנות ויצירה. התלמידים מביאים את הכישרון שלהם לבמה.", image_url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80" },
      { title: "כנסת קשת", description: "אסיפות הכנסת השבועיות - המקום שבו דמוקרטיה חיה.", image_url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600&q=80" },
    ],
  });

  const [testimonials, setTestimonials] = useState({
    heading: "מה התלמידים אומרים",
    items: [
      { quote: "בית ספר כיפי שבו לומדים דברים ואפשר להשפיע עליו" },
      { quote: "חופש קיים פה, ומורים שווים לתלמידים" },
      { quote: "בית שני, מקום שעזר לי לצמוח" },
      { quote: "משפחה" },
    ],
  });

  useEffect(() => {
    if (!loading && sections) {
      if (sections.hero) setHero((prev) => ({ ...prev, ...sections.hero }));
      if (sections.events) setEvents((prev) => ({ ...prev, ...sections.events }));
      if (sections.testimonials) setTestimonials((prev) => ({ ...prev, ...sections.testimonials }));
    }
  }, [loading, sections]);

  async function handleSave() {
    await saveAllSections({ hero, events, testimonials });
  }

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-sand-200 rounded-xl h-20" />)}</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/content" className="w-8 h-8 rounded-lg bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors">
          <svg className="w-4 h-4 text-sand-600 -scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">חיים בקשת</h1>
          <p className="text-sand-500 text-sm">אירועי קהילה וציטוטים של תלמידים</p>
        </div>
      </div>

      <div className="space-y-4 max-w-3xl">
        <ContentSection title="כותרת ותיאור">
          <Input label="כותרת" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
            <textarea value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y" />
          </div>
        </ContentSection>

        <ContentSection title="אירועים ופעילויות">
          <Input label="כותרת" value={events.heading} onChange={(e) => setEvents({ ...events, heading: e.target.value })} />
          <ListEditor
            items={events.items}
            onChange={(items) => setEvents({ ...events, items })}
            createNew={() => ({ title: "", description: "", image_url: "" })}
            addLabel="אירוע חדש"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <Input label="כותרת" value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} />
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
                  <textarea value={item.description} onChange={(e) => onChange({ ...item, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y" />
                </div>
                <Input label="כתובת תמונה" value={item.image_url} onChange={(e) => onChange({ ...item, image_url: e.target.value })} dir="ltr" />
              </div>
            )}
          />
        </ContentSection>

        <ContentSection title="ציטוטים של תלמידים">
          <Input label="כותרת" value={testimonials.heading} onChange={(e) => setTestimonials({ ...testimonials, heading: e.target.value })} />
          <ListEditor
            items={testimonials.items}
            onChange={(items) => setTestimonials({ ...testimonials, items })}
            createNew={() => ({ quote: "" })}
            addLabel="ציטוט חדש"
            renderItem={(item, _, onChange) => (
              <div>
                <label className="block text-sm font-medium text-sand-700 mb-1.5">ציטוט</label>
                <textarea value={item.quote} onChange={(e) => onChange({ ...item, quote: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y" />
              </div>
            )}
          />
        </ContentSection>

        <SaveButton saving={saving} onClick={handleSave} successMessage={success} />
      </div>
    </div>
  );
}
