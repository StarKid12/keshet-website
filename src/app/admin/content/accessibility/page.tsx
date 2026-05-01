"use client";

import { useEffect, useState } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Input } from "@/components/ui/Input";
import { ContentSection } from "@/components/admin/ContentSection";
import { ListEditor } from "@/components/admin/ListEditor";
import { SaveButton } from "@/components/admin/SaveButton";
import Link from "next/link";

export default function AccessibilityContentPage() {
  const { sections, loading, saving, success, saveAllSections } =
    useSiteContent("accessibility");

  const [hero, setHero] = useState({
    title: "הצהרת נגישות",
    description: "בית הספר קשת מחויב להנגשת האתר לכלל האוכלוסייה, לרבות אנשים עם מוגבלויות.",
  });

  const [general, setGeneral] = useState({
    heading: "כללי",
    body:
      "בית הספר הדמוקרטי יהודי-פלורליסטי קשת בזכרון יעקב פועל להנגשת אתר האינטרנט שלו בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע\"ג-2013, ובהתאם לתקן הישראלי ת\"י 5568 המבוסס על הנחיות WCAG 2.0 ברמת AA.",
  });

  const [actions, setActions] = useState({
    heading: "פעולות שבוצעו להנגשת האתר",
    items: [
      "התאמת האתר לשימוש בטכנולוגיות מסייעות וקוראי מסך",
      "ניווט באמצעות מקלדת בכל רחבי האתר",
      "שימוש בניגודיות צבעים מתאימה",
      "הוספת תיאורים חלופיים (alt) לתמונות",
      "מבנה כותרות היררכי ונכון",
      "טפסים מסומנים עם תוויות (labels) מתאימות",
      "תמיכה בשינוי גודל טקסט",
      "תמיכה מלאה בכיווניות RTL (ימין לשמאל)",
    ] as string[],
  });

  const [onSite, setOnSite] = useState({
    heading: "הסדרי נגישות בבית הספר",
    items: [
      "חניית נכים מסומנת בחצר בית הספר",
      "דרכי גישה נגישות לכיסאות גלגלים",
      "שירותי נגישות",
    ] as string[],
  });

  const [contact, setContact] = useState({
    heading: "יצירת קשר בנושא נגישות",
    intro: "אם נתקלתם בבעיית נגישות באתר או זקוקים לסיוע, אנא פנו אלינו:",
    coordinator: "בית הספר קשת",
    email: "info@keshet-school.co.il",
    phone: "04-XXX-XXXX",
  });

  const [updated, setUpdated] = useState({
    heading: "תאריך עדכון",
    body: "הצהרה זו עודכנה לאחרונה בתאריך מרץ 2026.",
  });

  useEffect(() => {
    if (!loading && sections) {
      if (sections.hero) setHero((prev) => ({ ...prev, ...sections.hero }));
      if (sections.general) setGeneral((prev) => ({ ...prev, ...sections.general }));
      if (sections.actions) setActions((prev) => ({ ...prev, ...sections.actions }));
      if (sections.on_site) setOnSite((prev) => ({ ...prev, ...sections.on_site }));
      if (sections.contact) setContact((prev) => ({ ...prev, ...sections.contact }));
      if (sections.updated) setUpdated((prev) => ({ ...prev, ...sections.updated }));
    }
  }, [loading, sections]);

  async function handleSave() {
    await saveAllSections({
      hero,
      general,
      actions,
      on_site: onSite,
      contact,
      updated,
    });
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
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">הצהרת נגישות</h1>
          <p className="text-sand-500 text-sm">עריכת הצהרת הנגישות של האתר</p>
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

        <ContentSection title="פסקה כללית">
          <Input
            label="כותרת"
            value={general.heading}
            onChange={(e) => setGeneral({ ...general, heading: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">תוכן</label>
            <textarea
              value={general.body}
              onChange={(e) => setGeneral({ ...general, body: e.target.value })}
              rows={5}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
            />
          </div>
        </ContentSection>

        <ContentSection title="פעולות שבוצעו להנגשת האתר">
          <Input
            label="כותרת"
            value={actions.heading}
            onChange={(e) => setActions({ ...actions, heading: e.target.value })}
          />
          <ListEditor
            items={actions.items}
            onChange={(items) => setActions({ ...actions, items })}
            createNew={() => ""}
            addLabel="פעולה חדשה"
            renderItem={(item, _, onChange) => (
              <Input
                value={item}
                onChange={(e) => onChange(e.target.value)}
                placeholder="פעולה..."
              />
            )}
          />
        </ContentSection>

        <ContentSection title="הסדרי נגישות בבית הספר">
          <Input
            label="כותרת"
            value={onSite.heading}
            onChange={(e) => setOnSite({ ...onSite, heading: e.target.value })}
          />
          <ListEditor
            items={onSite.items}
            onChange={(items) => setOnSite({ ...onSite, items })}
            createNew={() => ""}
            addLabel="הסדר חדש"
            renderItem={(item, _, onChange) => (
              <Input
                value={item}
                onChange={(e) => onChange(e.target.value)}
                placeholder="הסדר..."
              />
            )}
          />
        </ContentSection>

        <ContentSection title="יצירת קשר בנושא נגישות">
          <Input
            label="כותרת"
            value={contact.heading}
            onChange={(e) => setContact({ ...contact, heading: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">פתיח</label>
            <textarea
              value={contact.intro}
              onChange={(e) => setContact({ ...contact, intro: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
            />
          </div>
          <Input
            label="רכז/ת נגישות"
            value={contact.coordinator}
            onChange={(e) => setContact({ ...contact, coordinator: e.target.value })}
          />
          <Input
            label="אימייל"
            type="email"
            dir="ltr"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
          />
          <Input
            label="טלפון"
            dir="ltr"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          />
        </ContentSection>

        <ContentSection title="תאריך עדכון" defaultOpen={false}>
          <Input
            label="כותרת"
            value={updated.heading}
            onChange={(e) => setUpdated({ ...updated, heading: e.target.value })}
          />
          <Input
            label="תוכן"
            value={updated.body}
            onChange={(e) => setUpdated({ ...updated, body: e.target.value })}
            placeholder="הצהרה זו עודכנה לאחרונה בתאריך..."
          />
        </ContentSection>

        <SaveButton saving={saving} onClick={handleSave} successMessage={success} />
      </div>
    </div>
  );
}
