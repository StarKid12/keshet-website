"use client";

import { useEffect, useState } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Input } from "@/components/ui/Input";
import { ContentSection } from "@/components/admin/ContentSection";
import { ListEditor } from "@/components/admin/ListEditor";
import { SaveButton } from "@/components/admin/SaveButton";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useImageUpload } from "@/hooks/useImageUpload";
import Link from "next/link";

export default function AdmissionsContentPage() {
  const { sections, loading, saving, success, saveAllSections } =
    useSiteContent("admissions");
  const { uploadImage, uploading } = useImageUpload();

  const [hero, setHero] = useState({
    title: "הצטרפו לקשת",
    description: "אנחנו שמחים שאתם מתעניינים בקשת! הנה כל מה שצריך לדעת על תהליך ההרשמה.",
  });

  const [notices, setNotices] = useState<{ items: { title: string; url: string }[] }>({
    items: [],
  });

  const [steps, setSteps] = useState({
    heading: "תהליך ההרשמה",
    items: [
      { number: "01", title: "יצירת קשר ראשוני", description: "פנו אלינו בטלפון או במייל, או מלאו את טופס יצירת הקשר. נשמח לענות על כל שאלה." },
      { number: "02", title: "ביקור בבית הספר", description: "הזמנה ליום פתוח או לביקור אישי. תוכלו לראות את בית הספר בפעולה, להכיר את הצוות ולחוש את האווירה." },
      { number: "03", title: "שיחת היכרות", description: "שיחה אישית עם צוות בית הספר להכיר את הילד/ה ואת המשפחה ולוודא התאמה הדדית." },
      { number: "04", title: "יום ניסיון", description: "הילד/ה מוזמן/ת ליום ניסיון בבית הספר, להתנסות בשגרה ולהכיר את חברי הכיתה." },
      { number: "05", title: "הרשמה ומעבר", description: "לאחר הליך ההכרות, סיום תהליך ההרשמה וליווי מעבר חלק לבית הספר." },
    ],
  });

  const [openDay, setOpenDay] = useState({
    label: "יום פתוח",
    heading: "בואו להכיר אותנו מקרוב",
    description: "ימי פתוח מתקיימים לאורך השנה. צרו קשר לקביעת ביקור אישי או להתעדכן במועד יום הפתוח הקרוב.",
    image_url: "",
    cta_url: "",
    cta_label: "הרשמה ליום פתוח",
  });

  const [faq, setFaq] = useState({
    heading: "שאלות נפוצות",
    items: [
      { question: "מהו טווח הגילאים בקשת?", answer: "קשת מקבלת תלמידים מגן (גילאי 3) ועד כיתה י\"ב." },
      { question: "האם יש בגרויות?", answer: "כן, בתיכון ניתן ללמוד ולהיבחן בבחינות בגרות." },
      { question: "מהי שכר הלימוד?", answer: "שכר הלימוד משתנה בהתאם לגיל. צרו קשר לפרטים מדויקים." },
      { question: "האם יש הסעות?", answer: "כן, ישנם קווי הסעה מישובים שונים באזור. צרו קשר לפרטים." },
      { question: "מה ייחודי בחינוך הדמוקרטי?", answer: "בחינוך דמוקרטי התלמידים שותפים פעילים בקבלת החלטות על חיי בית הספר, ויש שוויון ערך בין מורים לתלמידים." },
    ],
  });

  useEffect(() => {
    if (!loading && sections) {
      if (sections.hero) setHero((prev) => ({ ...prev, ...sections.hero }));
      if (sections.notices) setNotices((prev) => ({ ...prev, ...sections.notices }));
      if (sections.steps) setSteps((prev) => ({ ...prev, ...sections.steps }));
      if (sections.open_day) setOpenDay((prev) => ({ ...prev, ...sections.open_day }));
      if (sections.faq) setFaq((prev) => ({ ...prev, ...sections.faq }));
    }
  }, [loading, sections]);

  async function handleSave() {
    await saveAllSections({ hero, notices, steps, open_day: openDay, faq });
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
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">הרשמה</h1>
          <p className="text-sand-500 text-sm">תהליך הרשמה, יום פתוח ושאלות נפוצות</p>
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

        <ContentSection title="הודעות חשובות (באנרים)">
          <p className="text-sm text-sand-500 -mt-2">
            באנרים שמופיעים בראש העמוד — לתוצאות הגרלה, מועדי הרשמה, וכו&apos;. מחקו כשלא רלוונטי.
          </p>
          <ListEditor
            items={notices.items}
            onChange={(items) => setNotices({ items })}
            createNew={() => ({ title: "", url: "" })}
            addLabel="באנר חדש"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <Input
                  label="טקסט הבאנר"
                  value={item.title}
                  onChange={(e) => onChange({ ...item, title: e.target.value })}
                  placeholder='תוצאות ההגרלה לתיכון לתשפ"ו'
                />
                <Input
                  label="קישור"
                  dir="ltr"
                  type="url"
                  value={item.url}
                  onChange={(e) => onChange({ ...item, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            )}
          />
        </ContentSection>

        <ContentSection title="שלבי הרשמה">
          <Input label="כותרת" value={steps.heading} onChange={(e) => setSteps({ ...steps, heading: e.target.value })} />
          <ListEditor
            items={steps.items}
            onChange={(items) => setSteps({ ...steps, items })}
            createNew={() => ({ number: String(steps.items.length + 1).padStart(2, "0"), title: "", description: "" })}
            addLabel="שלב חדש"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-4">
                  <Input label="מספר" value={item.number} onChange={(e) => onChange({ ...item, number: e.target.value })} dir="ltr" />
                  <div className="col-span-3">
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

        <ContentSection title="יום פתוח" defaultOpen={false}>
          <Input label="תווית" value={openDay.label} onChange={(e) => setOpenDay({ ...openDay, label: e.target.value })} />
          <Input label="כותרת" value={openDay.heading} onChange={(e) => setOpenDay({ ...openDay, heading: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
            <textarea value={openDay.description} onChange={(e) => setOpenDay({ ...openDay, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y" />
          </div>
          <ImageUploader
            currentUrl={openDay.image_url || null}
            onUpload={async (file) => {
              const url = await uploadImage(file, `admissions/open-day-${Date.now()}.${file.name.split(".").pop()}`);
              if (url) setOpenDay({ ...openDay, image_url: url });
            }}
            onUrlSet={(url) => setOpenDay({ ...openDay, image_url: url })}
            onRemove={() => setOpenDay({ ...openDay, image_url: "" })}
            uploading={uploading}
            label="תמונת ההזמנה (אופציונלי)"
          />
          <Input
            label="קישור לטופס הרשמה (Google Forms וכו')"
            dir="ltr"
            type="url"
            value={openDay.cta_url}
            onChange={(e) => setOpenDay({ ...openDay, cta_url: e.target.value })}
            placeholder="https://docs.google.com/forms/..."
          />
          <Input
            label="טקסט בכפתור ההרשמה"
            value={openDay.cta_label}
            onChange={(e) => setOpenDay({ ...openDay, cta_label: e.target.value })}
            placeholder="הרשמה ליום פתוח"
          />
        </ContentSection>

        <ContentSection title="שאלות נפוצות">
          <Input label="כותרת" value={faq.heading} onChange={(e) => setFaq({ ...faq, heading: e.target.value })} />
          <ListEditor
            items={faq.items}
            onChange={(items) => setFaq({ ...faq, items })}
            createNew={() => ({ question: "", answer: "" })}
            addLabel="שאלה חדשה"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <Input label="שאלה" value={item.question} onChange={(e) => onChange({ ...item, question: e.target.value })} />
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-1.5">תשובה</label>
                  <textarea value={item.answer} onChange={(e) => onChange({ ...item, answer: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y" />
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
