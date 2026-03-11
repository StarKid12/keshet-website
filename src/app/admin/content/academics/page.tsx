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

export default function AcademicsContentPage() {
  const { sections, loading, saving, success, saveAllSections } =
    useSiteContent("academics");
  const { uploadImage, uploading } = useImageUpload();

  const [hero, setHero] = useState({
    title: "לימודים בקשת",
    description: "תוכנית חינוכית מקיפה מגן ועד י\"ב, שמשלבת מצוינות אקדמית עם ערכים דמוקרטיים וזהות יהודית-פלורליסטית.",
  });

  const [programs, setPrograms] = useState({
    items: [
      { title: "בית צעירים", ages: "גן - כיתה ב׳", description: "סביבה חמה ומטפחת שבה ילדים לומדים דרך משחק, יצירה וחקירה. דגש על התפתחות רגשית-חברתית ופיתוח סקרנות טבעית.", highlights: ["למידה דרך משחק", "פעילויות בטבע", "יצירה ואמנות", "מעגלי שיחה"], image_url: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=800&q=80" },
      { title: "חממה", ages: "כיתות ג׳-ה׳", description: "תוכנית לימודים מקיפה שמשלבת בין לימודי ליבה לבין פיתוח אישי, ערכי דמוקרטיה וזהות יהודית-פלורליסטית.", highlights: ["לימודי ליבה", "פרויקטים בין-תחומיים", "כנסת תלמידים", "טיולים ומסעות"], image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80" },
      { title: "שכב\"ג", ages: "כיתות ו׳-ח׳", description: "שנות המעבר החשובות. ליווי אישי, העמקה אקדמית ופיתוח חשיבה ביקורתית ועצמאית בסביבה תומכת.", highlights: ["התמחויות בחירה", "פרויקטים אישיים", "מנהיגות ומעורבות", "הכנה לתיכון"], image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80" },
      { title: "תיכון", ages: "כיתות ט׳-י״ב", description: "הכנה לבגרויות ולחיים. מגוון מקצועות בחירה, העמקה אקדמית, מנהיגות קהילתית ופיתוח זהות אישית.", highlights: ["מגמות בגרות", "שירות קהילתי", "הכנה לצבא/שירות", "פרויקט גמר אישי"], image_url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80" },
    ],
  });

  const [approaches, setApproaches] = useState({
    heading: "הגישה החינוכית",
    description: "כך אנחנו מלמדים בקשת - גישה שמכבדת את הילד ומאמינה ביכולת שלו",
    items: [
      { title: "למידה פרויקטלית", description: "תלמידים לומדים דרך פרויקטים מעשיים שמחברים בין תחומי דעת שונים ומפתחים חשיבה יצירתית." },
      { title: "למידה מותאמת אישית", description: "כל תלמיד מקבל תשומת לב אישית, בהתאם לקצב, לסגנון הלמידה ולתחומי העניין שלו." },
      { title: "למידה חברתית-רגשית", description: "פיתוח מיומנויות חברתיות, ניהול רגשות ותקשורת בין-אישית כחלק בלתי נפרד מתוכנית הלימודים." },
      { title: "חינוך יהודי-פלורליסטי", description: "הכרות עם מסורת ותרבות יהודית מגוונת, חגים, טקסטים ודיונים - מתוך כבוד ופתיחות." },
    ],
  });

  const [schedule, setSchedule] = useState({
    heading: "יום טיפוסי בקשת",
    slots: [
      { time: "07:45-08:15", activity: "התכנסות ומעגל בוקר" },
      { time: "08:15-10:00", activity: "לימודי בוקר - מקצועות ליבה" },
      { time: "10:00-10:30", activity: "הפסקה ואוכל" },
      { time: "10:30-12:00", activity: "למידה פרויקטלית / בחירה" },
      { time: "12:00-12:30", activity: "הפסקת צהריים" },
      { time: "12:30-14:00", activity: "פעילויות העשרה / ועדות / חוגים" },
      { time: "14:00", activity: "סיום יום" },
    ],
  });

  useEffect(() => {
    if (!loading && sections) {
      if (sections.hero) setHero((prev) => ({ ...prev, ...sections.hero }));
      if (sections.programs) setPrograms((prev) => ({ ...prev, ...sections.programs }));
      if (sections.approaches) setApproaches((prev) => ({ ...prev, ...sections.approaches }));
      if (sections.schedule) setSchedule((prev) => ({ ...prev, ...sections.schedule }));
    }
  }, [loading, sections]);

  async function handleSave() {
    await saveAllSections({ hero, programs, approaches, schedule });
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
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">לימודים</h1>
          <p className="text-sand-500 text-sm">תכניות לימוד, גישות חינוכיות ומערכת שעות</p>
        </div>
      </div>

      <div className="space-y-4 max-w-3xl">
        <ContentSection title="כותרת ותיאור">
          <Input label="כותרת" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
            <textarea value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y" />
          </div>
        </ContentSection>

        <ContentSection title="תכניות לימוד">
          <ListEditor
            items={programs.items}
            onChange={(items) => setPrograms({ ...programs, items })}
            createNew={() => ({ title: "", ages: "", description: "", highlights: [], image_url: "" })}
            addLabel="תכנית חדשה"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="שם" value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} />
                  <Input label="גילאים" value={item.ages} onChange={(e) => onChange({ ...item, ages: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
                  <textarea value={item.description} onChange={(e) => onChange({ ...item, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y" />
                </div>
                <Input label="דגשים (מופרדים בפסיקים)" value={item.highlights.join(", ")} onChange={(e) => onChange({ ...item, highlights: e.target.value.split(",").map((h) => h.trim()).filter(Boolean) })} />
                <ImageUploader
                  currentUrl={item.image_url || null}
                  onUpload={async (file) => {
                    const url = await uploadImage(file, `academics/${item.title || "program"}-${Date.now()}.${file.name.split(".").pop()}`);
                    if (url) onChange({ ...item, image_url: url });
                  }}
                  onRemove={() => onChange({ ...item, image_url: "" })}
                  uploading={uploading}
                  label="תמונה"
                />
              </div>
            )}
          />
        </ContentSection>

        <ContentSection title="גישות חינוכיות" defaultOpen={false}>
          <Input label="כותרת" value={approaches.heading} onChange={(e) => setApproaches({ ...approaches, heading: e.target.value })} />
          <Input label="תיאור" value={approaches.description} onChange={(e) => setApproaches({ ...approaches, description: e.target.value })} />
          <ListEditor
            items={approaches.items}
            onChange={(items) => setApproaches({ ...approaches, items })}
            createNew={() => ({ title: "", description: "" })}
            addLabel="גישה חדשה"
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

        <ContentSection title="מערכת שעות" defaultOpen={false}>
          <Input label="כותרת" value={schedule.heading} onChange={(e) => setSchedule({ ...schedule, heading: e.target.value })} />
          <ListEditor
            items={schedule.slots}
            onChange={(slots) => setSchedule({ ...schedule, slots })}
            createNew={() => ({ time: "", activity: "" })}
            addLabel="שעה חדשה"
            renderItem={(item, _, onChange) => (
              <div className="grid grid-cols-3 gap-4">
                <Input label="שעה" value={item.time} onChange={(e) => onChange({ ...item, time: e.target.value })} dir="ltr" />
                <div className="col-span-2">
                  <Input label="פעילות" value={item.activity} onChange={(e) => onChange({ ...item, activity: e.target.value })} />
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
