"use client";

import { useEffect, useState } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Input } from "@/components/ui/Input";
import { ContentSection } from "@/components/admin/ContentSection";
import { ListEditor } from "@/components/admin/ListEditor";
import { SaveButton } from "@/components/admin/SaveButton";
import Link from "next/link";

export default function HomepageContentPage() {
  const { sections, loading, saving, success, getSection, saveAllSections } =
    useSiteContent("homepage");

  const [hero, setHero] = useState({
    title: "בית הספר הדמוקרטי יהודי-פלורליסטי",
    subtitle: "זכרון יעקב",
    tagline: "חינוך שמאמין בילד, בקהילה ובדמוקרטיה.\nמרחב צמיחה מגן ועד י\"ב",
    words: ["קהילה", "דמוקרטיה", "פלורליזם", "חופש", "שייכות", "יצירה", "צמיחה", "משפחה"],
    cta_primary: "הכירו אותנו",
    cta_secondary: "הרשמה",
  });

  const [philosophy, setPhilosophy] = useState({
    heading: "חינוך דמוקרטי יהודי-פלורליסטי",
    subheading: "שלושת העמודים שעליהם נבנה בית הספר שלנו",
    pillars: [
      { title: "דמוקרטיה", description: "בקשת, כל קול נשמע. התלמידים שותפים פעילים בעיצוב חיי בית הספר דרך כנסת קשת - מערכת הממשל הדמוקרטית שלנו." },
      { title: "פלורליזם", description: "אנחנו מאמינים במגוון. בית ספר יהודי שמכבד את כל הגוונים והזהויות, ומטפח שיח פתוח ומכבד בין עולמות שונים." },
      { title: "קהילה", description: "קשת היא יותר מבית ספר - היא משפחה. קהילה חמה ואוהבת שבה כל ילד מוכר, נראה ומלווה בדרכו הייחודית." },
    ],
  });

  const [testimonials, setTestimonials] = useState({
    heading: "מה אומרים עלינו",
    subheading: "קולות מהקהילה שלנו",
    items: [
      { quote: "בית ספר כיפי שבו לומדים דברים ואפשר להשפיע עליו", author: "תלמיד/ה", role: "תלמיד/ה בקשת" },
      { quote: "חופש קיים פה, ומורים שווים לתלמידים", author: "תלמיד/ה", role: "תלמיד/ה בקשת" },
      { quote: "בית שני, מקום שעזר לי לצמוח", author: "בוגר/ת", role: "בוגר/ת קשת" },
      { quote: "משפחה", author: "תלמיד/ה", role: "תלמיד/ה בקשת" },
      { quote: "נרניה. הצלה. המקום הכי טוב בעולם.", author: "תלמיד/ה", role: "תלמיד/ה בקשת" },
    ],
  });

  const [cta, setCta] = useState({
    heading: "רוצים לשמוע עוד?",
    description: "בואו להכיר את קשת מקרוב. אנחנו מזמינים אתכם לביקור בבית הספר ולשיחה אישית.",
    cta_primary: "לתהליך ההרשמה",
    cta_primary_href: "/admissions",
    cta_secondary: "צרו קשר",
    cta_secondary_href: "/contact",
  });

  useEffect(() => {
    if (!loading && sections) {
      if (sections.hero) setHero((prev) => ({ ...prev, ...sections.hero }));
      if (sections.philosophy) setPhilosophy((prev) => ({ ...prev, ...sections.philosophy }));
      if (sections.testimonials) setTestimonials((prev) => ({ ...prev, ...sections.testimonials }));
      if (sections.cta) setCta((prev) => ({ ...prev, ...sections.cta }));
    }
  }, [loading, sections]);

  async function handleSave() {
    await saveAllSections({
      hero,
      philosophy,
      testimonials,
      cta,
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
        <Link href="/admin/content" className="w-8 h-8 rounded-lg bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors">
          <svg className="w-4 h-4 text-sand-600 -scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">דף ראשי</h1>
          <p className="text-sand-500 text-sm">כותרות, ציטוטים, פילוסופיה ו-CTA</p>
        </div>
      </div>

      <div className="space-y-4 max-w-3xl">
        {/* Hero */}
        <ContentSection title="כותרת ראשית (Hero)">
          <Input label="כותרת" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
          <Input label="תת-כותרת (מיקום)" value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">תגית</label>
            <textarea
              value={hero.tagline}
              onChange={(e) => setHero({ ...hero, tagline: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">מילים מתחלפות (מופרדות בפסיקים)</label>
            <Input
              value={hero.words.join(", ")}
              onChange={(e) => setHero({ ...hero, words: e.target.value.split(",").map((w) => w.trim()).filter(Boolean) })}
              placeholder="קהילה, דמוקרטיה, פלורליזם..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="כפתור ראשי" value={hero.cta_primary} onChange={(e) => setHero({ ...hero, cta_primary: e.target.value })} />
            <Input label="כפתור משני" value={hero.cta_secondary} onChange={(e) => setHero({ ...hero, cta_secondary: e.target.value })} />
          </div>
        </ContentSection>

        {/* Philosophy */}
        <ContentSection title="פילוסופיה / ערכים">
          <Input label="כותרת" value={philosophy.heading} onChange={(e) => setPhilosophy({ ...philosophy, heading: e.target.value })} />
          <Input label="תת-כותרת" value={philosophy.subheading} onChange={(e) => setPhilosophy({ ...philosophy, subheading: e.target.value })} />
          <ListEditor
            items={philosophy.pillars}
            onChange={(pillars) => setPhilosophy({ ...philosophy, pillars })}
            createNew={() => ({ title: "", description: "" })}
            addLabel="עמוד חדש"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <Input label="כותרת" value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} />
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => onChange({ ...item, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
                  />
                </div>
              </div>
            )}
          />
        </ContentSection>

        {/* Testimonials */}
        <ContentSection title="ציטוטים">
          <Input label="כותרת" value={testimonials.heading} onChange={(e) => setTestimonials({ ...testimonials, heading: e.target.value })} />
          <Input label="תת-כותרת" value={testimonials.subheading} onChange={(e) => setTestimonials({ ...testimonials, subheading: e.target.value })} />
          <ListEditor
            items={testimonials.items}
            onChange={(items) => setTestimonials({ ...testimonials, items })}
            createNew={() => ({ quote: "", author: "", role: "" })}
            addLabel="ציטוט חדש"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-1.5">ציטוט</label>
                  <textarea
                    value={item.quote}
                    onChange={(e) => onChange({ ...item, quote: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="שם" value={item.author} onChange={(e) => onChange({ ...item, author: e.target.value })} placeholder="שם האומר/ת" />
                  <Input label="תפקיד" value={item.role} onChange={(e) => onChange({ ...item, role: e.target.value })} placeholder="תלמיד/ה, בוגר/ת..." />
                </div>
              </div>
            )}
          />
        </ContentSection>

        {/* CTA */}
        <ContentSection title="קריאה לפעולה (CTA)" defaultOpen={false}>
          <Input label="כותרת" value={cta.heading} onChange={(e) => setCta({ ...cta, heading: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
            <textarea
              value={cta.description}
              onChange={(e) => setCta({ ...cta, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="כפתור ראשי" value={cta.cta_primary} onChange={(e) => setCta({ ...cta, cta_primary: e.target.value })} />
            <Input label="קישור ראשי" value={cta.cta_primary_href} onChange={(e) => setCta({ ...cta, cta_primary_href: e.target.value })} dir="ltr" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="כפתור משני" value={cta.cta_secondary} onChange={(e) => setCta({ ...cta, cta_secondary: e.target.value })} />
            <Input label="קישור משני" value={cta.cta_secondary_href} onChange={(e) => setCta({ ...cta, cta_secondary_href: e.target.value })} dir="ltr" />
          </div>
        </ContentSection>

        <SaveButton saving={saving} onClick={handleSave} successMessage={success} />
      </div>
    </div>
  );
}
