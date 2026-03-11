"use client";

import { useEffect, useState } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Input } from "@/components/ui/Input";
import { ContentSection } from "@/components/admin/ContentSection";
import { ListEditor } from "@/components/admin/ListEditor";
import { SaveButton } from "@/components/admin/SaveButton";
import Link from "next/link";

export default function AboutContentPage() {
  const { sections, loading, saving, success, saveAllSections } =
    useSiteContent("about");

  const [hero, setHero] = useState({
    title: "אודות",
    description: "בית הספר הדמוקרטי יהודי-פלורליסטי קשת בזכרון יעקב הוא מוסד חינוכי ייחודי, שנוסד בשנת 2001 על ידי קבוצת משפחות חילוניות ודתיות שחיפשו חלופה חינוכית לילדיהם - מגיל הגן ועד התיכון.",
  });

  const [vision, setVision] = useState({
    heading: "החזון שלנו",
    paragraphs: [
      "גיוון ושוני מעשירים אותנו, וחברה ראויה מדגישה את הייחודיות של כל אדם ואינה מחפשת אחידות. זהו הבסיס החינוכי של בית הספר, המוכר על ידי משרד החינוך.",
      "קשת יצרה מודל של שפה, תרבות וסביבה יהודית שמדברת אל חילונים ודתיים כאחד. סוגיות כמו פלורליזם דתי וסובלנות מטופלות באמצעות דיונים דמוקרטיים וכבוד הדדי, ויוצרות חיי קהילה משותפים בין זרמים שונים של החברה הישראלית.",
      "בוגרי בית הספר הם שגרירים של ערכי קשת. מטרתנו שיהפכו למנהיגים פעילים ואחראיים, שיסייעו לגשר על פערים בחברה הישראלית ויתמכו בדו-קיום של השקפות, דעות ואמונות שונות.",
    ],
    image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
  });

  const [values, setValues] = useState({
    heading: "הערכים שלנו",
    items: [
      { title: "חופש בחירה", description: "חופש ללמוד, לחקור ולבחור - תוך אחריות ומודעות. כל תלמיד שותף בתהליך." },
      { title: "שוויון", description: "מורים ותלמידים שווים. כל אחד, ללא קשר לגיל, בעל קול שווה בהכרעות." },
      { title: "פלורליזם", description: "חילונים ודתיים לומדים יחד, מכבדים את השונות ומתעשרים ממנה." },
      { title: "קהילתיות", description: "משפחה רחבה של הורים, מורים ותלמידים שבונים יחד חברה טובה יותר." },
    ],
  });

  const [democracy, setDemocracy] = useState({
    heading: "הגישה הדמוקרטית",
    paragraphs: [
      "בית הספר מתנהל כמדינה דמוקרטית. כנסת קשת היא הפרלמנט של בית הספר - היא מחוקקת חוקים שלפיהם מתנהל בית הספר, וכל אחד, ללא קשר לגיל, בעל זכות הצבעה שווה.",
      "פעילות בית הספר מנוהלת על ידי ועדות המורכבות מתלמידים, מורים והורים. הוועדות מתכננות ומבצעות טיולים, אירועים ופעילויות ספורט. קונפליקטים נפתרים באמצעות דיאלוג, גישור או הליך דמוקרטי דרך ועדת המעגל.",
    ],
    bullets: [
      "כנסת בית ספר - פרלמנט עם הצבעה שוויונית",
      "ועדות תלמידים-מורים-הורים פעילות",
      "ועדת המעגל - גישור ופתרון קונפליקטים",
      "שוויון מלא בין מורים לתלמידים בהצבעות",
    ],
    image_url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&q=80",
  });

  const [pluralism, setPluralism] = useState({
    heading: "מסע הפלורליזם",
    description: "תוכנית \"מסע פלורליזם ישראלי\" מטרתה להכיר לתלמידים דרכי חיים מגוונות בישראל - דעות פוליטיות ודתיות, תרבויות וקבוצות אתניות, וצורות מגורים חלופיות.",
    items: [
      { title: "למידה בשטח", description: "טיולים ברחבי הארץ לפגישה עם קהילות מגוונות וחשיפה לאורחות חיים שונות." },
      { title: "דיאלוג ומפגש", description: "פעילויות בבית הספר הכוללות דיונים, סדנאות ומפגשים עם אנשים מרקעים שונים." },
      { title: "מנהיגות אחראית", description: "הכשרת הדור הבא של אזרחי ישראל - מנהיגים שמבינים ומכבדים את הפסיפס הישראלי." },
    ],
  });

  const [timeline, setTimeline] = useState({
    heading: "ציר הזמן שלנו",
    events: [
      { year: "2001", title: "הקמת עמותת קשת", description: "קבוצה קטנה של משפחות חילוניות ודתיות בזכרון יעקב הקימה את עמותת קשת." },
      { year: "2002", title: "פתיחת בית הספר", description: "קשת פתחה את שעריה כבית ספר דמוקרטי יהודי-פלורליסטי." },
      { year: "2010", title: "הרחבה והתפתחות", description: "פתיחת חטיבת הביניים והמשך צמיחה." },
      { year: "2015", title: "השלמת המסלול החינוכי", description: "השלמת המסלול מגן ועד י\"ב עם פתיחת כיתות התיכון." },
    ],
  });

  const [structure, setStructure] = useState({
    heading: "מבנה בית הספר",
    levels: [
      { name: "בית צעירים", grades: "גן - כיתה ב׳", emoji: "🌱" },
      { name: "חממה", grades: "כיתות ג׳-ה׳", emoji: "🪴" },
      { name: "שכב\"ג", grades: "כיתות ו׳-ח׳", emoji: "🌿" },
      { name: "תיכון", grades: "כיתות ט׳-י״ב", emoji: "🌳" },
    ],
  });

  useEffect(() => {
    if (!loading && sections) {
      if (sections.hero) setHero((prev) => ({ ...prev, ...sections.hero }));
      if (sections.vision) setVision((prev) => ({ ...prev, ...sections.vision }));
      if (sections.values) setValues((prev) => ({ ...prev, ...sections.values }));
      if (sections.democracy) setDemocracy((prev) => ({ ...prev, ...sections.democracy }));
      if (sections.pluralism) setPluralism((prev) => ({ ...prev, ...sections.pluralism }));
      if (sections.timeline) setTimeline((prev) => ({ ...prev, ...sections.timeline }));
      if (sections.structure) setStructure((prev) => ({ ...prev, ...sections.structure }));
    }
  }, [loading, sections]);

  async function handleSave() {
    await saveAllSections({ hero, vision, values, democracy, pluralism, timeline, structure });
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
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">אודות</h1>
          <p className="text-sand-500 text-sm">חזון, ערכים, ציר זמנים ומבנה בית הספר</p>
        </div>
      </div>

      <div className="space-y-4 max-w-3xl">
        <ContentSection title="כותרת ותיאור">
          <Input label="כותרת" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
            <textarea value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y" />
          </div>
        </ContentSection>

        <ContentSection title="החזון">
          <Input label="כותרת" value={vision.heading} onChange={(e) => setVision({ ...vision, heading: e.target.value })} />
          <Input label="כתובת תמונה" value={vision.image_url || ""} onChange={(e) => setVision({ ...vision, image_url: e.target.value })} dir="ltr" placeholder="URL של תמונה" />
          {vision.paragraphs.map((p, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-sand-700 mb-1.5">פסקה {i + 1}</label>
              <textarea
                value={p}
                onChange={(e) => {
                  const newParagraphs = [...vision.paragraphs];
                  newParagraphs[i] = e.target.value;
                  setVision({ ...vision, paragraphs: newParagraphs });
                }}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
              />
            </div>
          ))}
        </ContentSection>

        <ContentSection title="ערכים">
          <Input label="כותרת" value={values.heading} onChange={(e) => setValues({ ...values, heading: e.target.value })} />
          <ListEditor
            items={values.items}
            onChange={(items) => setValues({ ...values, items })}
            createNew={() => ({ title: "", description: "" })}
            addLabel="ערך חדש"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <Input label="כותרת" value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} />
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
                  <textarea value={item.description} onChange={(e) => onChange({ ...item, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y" />
                </div>
              </div>
            )}
          />
        </ContentSection>

        <ContentSection title="הגישה הדמוקרטית" defaultOpen={false}>
          <Input label="כותרת" value={democracy.heading} onChange={(e) => setDemocracy({ ...democracy, heading: e.target.value })} />
          <Input label="כתובת תמונה" value={democracy.image_url || ""} onChange={(e) => setDemocracy({ ...democracy, image_url: e.target.value })} dir="ltr" />
          {democracy.paragraphs.map((p, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-sand-700 mb-1.5">פסקה {i + 1}</label>
              <textarea value={p} onChange={(e) => { const n = [...democracy.paragraphs]; n[i] = e.target.value; setDemocracy({ ...democracy, paragraphs: n }); }} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y" />
            </div>
          ))}
          <ListEditor
            items={democracy.bullets}
            onChange={(bullets) => setDemocracy({ ...democracy, bullets })}
            createNew={() => ""}
            addLabel="נקודה חדשה"
            renderItem={(item, _, onChange) => (
              <Input value={item} onChange={(e) => onChange(e.target.value)} placeholder="נקודה..." />
            )}
          />
        </ContentSection>

        <ContentSection title="מסע הפלורליזם" defaultOpen={false}>
          <Input label="כותרת" value={pluralism.heading} onChange={(e) => setPluralism({ ...pluralism, heading: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
            <textarea value={pluralism.description} onChange={(e) => setPluralism({ ...pluralism, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y" />
          </div>
          <ListEditor
            items={pluralism.items}
            onChange={(items) => setPluralism({ ...pluralism, items })}
            createNew={() => ({ title: "", description: "" })}
            addLabel="פריט חדש"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <Input label="כותרת" value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} />
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
                  <textarea value={item.description} onChange={(e) => onChange({ ...item, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y" />
                </div>
              </div>
            )}
          />
        </ContentSection>

        <ContentSection title="ציר הזמן" defaultOpen={false}>
          <Input label="כותרת" value={timeline.heading} onChange={(e) => setTimeline({ ...timeline, heading: e.target.value })} />
          <ListEditor
            items={timeline.events}
            onChange={(events) => setTimeline({ ...timeline, events })}
            createNew={() => ({ year: "", title: "", description: "" })}
            addLabel="אירוע חדש"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <Input label="שנה" value={item.year} onChange={(e) => onChange({ ...item, year: e.target.value })} dir="ltr" />
                  <div className="col-span-2">
                    <Input label="כותרת" value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
                  <textarea value={item.description} onChange={(e) => onChange({ ...item, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y" />
                </div>
              </div>
            )}
          />
        </ContentSection>

        <ContentSection title="מבנה בית הספר" defaultOpen={false}>
          <Input label="כותרת" value={structure.heading} onChange={(e) => setStructure({ ...structure, heading: e.target.value })} />
          <ListEditor
            items={structure.levels}
            onChange={(levels) => setStructure({ ...structure, levels })}
            createNew={() => ({ name: "", grades: "", emoji: "" })}
            addLabel="שכבה חדשה"
            renderItem={(item, _, onChange) => (
              <div className="grid grid-cols-3 gap-4">
                <Input label="שם" value={item.name} onChange={(e) => onChange({ ...item, name: e.target.value })} />
                <Input label="כיתות" value={item.grades} onChange={(e) => onChange({ ...item, grades: e.target.value })} />
                <Input label="אמוג׳י" value={item.emoji} onChange={(e) => onChange({ ...item, emoji: e.target.value })} />
              </div>
            )}
          />
        </ContentSection>

        <SaveButton saving={saving} onClick={handleSave} successMessage={success} />
      </div>
    </div>
  );
}
