"use client";

import { useEffect, useState } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Input } from "@/components/ui/Input";
import { ContentSection } from "@/components/admin/ContentSection";
import { ListEditor } from "@/components/admin/ListEditor";
import { SaveButton } from "@/components/admin/SaveButton";
import Link from "next/link";

export default function DemocracyContentPage() {
  const { sections, loading, saving, success, saveAllSections } =
    useSiteContent("democracy");

  const [hero, setHero] = useState({
    title_prefix: "הדמוקרטיה ב",
    description:
      "בקשת, דמוקרטיה היא לא רק ערך - היא דרך חיים. התלמידים לא רק לומדים על דמוקרטיה, הם חיים אותה כל יום. מכיתה א׳ ועד י״ב, כל קול נשמע וכל אדם שווה.",
  });

  const [pillars, setPillars] = useState({
    heading: "ארבעת עמודי התווך",
    subheading: "הכלים הדמוקרטיים שמנהלים את החיים המשותפים בקשת",
    items: [
      {
        title: "כנסת קשת",
        icon: "🏛️",
        description:
          "הפרלמנט של בית הספר. כנסת קשת היא המוסד הדמוקרטי המרכזי - אסיפה שבועית שבה כל חברי הקהילה (תלמידים, מורים וצוות) מצביעים על החלטות הנוגעות לחיי בית הספר. לכל אחד קול שווה, מכיתה א׳ ועד י״ב.",
        examples: ["קביעת כללי התנהגות", "אישור פעילויות בית ספריות", "הקצאת תקציבים", "בחירת נציגים לוועדות"],
      },
      {
        title: "ועדות",
        icon: "👥",
        description:
          "ועדות הן הזרוע הביצועית של הדמוקרטיה. תלמידים ומורים עובדים יחד בוועדות מתמחות שמנהלות תחומים שונים בחיי בית הספר. חברות בוועדה היא וולונטרית ופתוחה לכולם.",
        examples: ["ועדת תרבות ואירועים", "ועדת סביבה וניקיון", "ועדת חברה וקהילה", "ועדת תקשורת"],
      },
      {
        title: "מעגל",
        icon: "⭕",
        description:
          "המעגל הוא כלי מרכזי ליישוב סכסוכים ולשיח פתוח. כשיש קונפליקט, בעיה, או נושא שדורש דיון - מתכנסים למעגל. כולם יושבים בשוויון, כולם מדברים, כולם מקשיבים. אין היררכיה - יש הקשבה.",
        examples: ["יישוב סכסוכים בין תלמידים", "דיון בנושאים רגשיים", "חגיגות וטקסים", "שיתוף חוויות אישיות"],
      },
      {
        title: "בחירה אישית",
        icon: "🎯",
        description:
          "בקשת, התלמידים שותפים פעילים בעיצוב מסלול הלמידה שלהם. החל מגיל צעיר, הם לומדים לבחור, לקחת אחריות ולהתמודד עם תוצאות הבחירות שלהם. הבחירה היא לא רק זכות - היא כלי חינוכי.",
        examples: ["בחירת קורסי העשרה", "הצעת נושאים ללמידה", "ניהול זמן עצמאי", "פרויקטים אישיים"],
      },
    ],
  });

  const [dayInLife, setDayInLife] = useState({
    heading: "יום בחיי תלמיד/ה בקשת",
    subheading: "כך נראית הדמוקרטיה בפועל, בכל שכבת גיל",
    items: [
      {
        division: "בית צעירים",
        grades: "גן - כיתה ב׳",
        emoji: "🌱",
        description:
          "הילדים מתחילים את היום במעגל בוקר - שיתוף, שירה ותכנון היום. הלמידה משלבת משחק חופשי, סדנאות יצירה, פעילות בטבע ולמידה בקבוצות קטנות. ההחלטות נעשות יחד: מה נבשל? לאן נטייל? איך נפתור את הבעיה?",
      },
      {
        division: "חממה",
        grades: "כיתות ג׳-ה׳",
        emoji: "🪴",
        description:
          "היום מתחיל בכנסת החממה - דיון בנושאים שעלו, הצעות חדשות והצבעות. לימודי הליבה משולבים עם פרויקטים בין-תחומיים שהתלמידים בוחרים. יש שעות קבועות ושעות בחירה, ותלמידים לומדים לנהל את הזמן שלהם.",
      },
      {
        division: 'שכב"ג',
        grades: "כיתות ו׳-ח׳",
        emoji: "🌿",
        description:
          "התלמידים מנהלים חלק משמעותי מחיי בית הספר דרך הוועדות. הם מובילים פרויקטים, מארגנים אירועים ומשתתפים בכנסת קשת הגדולה. הלמידה מעמיקה יותר, עם דגש על חשיבה ביקורתית, ויכוח ומחקר עצמאי.",
      },
      {
        division: "תיכון",
        grades: "כיתות ט׳-י״ב",
        emoji: "🌳",
        description:
          "תלמידי התיכון הם שותפים מלאים בניהול בית הספר. הם מובילים ועדות, מייעצים לצוות ומשמשים מנטורים לצעירים. לצד ההכנה לבגרויות, יש פרויקט גמר אישי, שירות קהילתי ותוכנית מנהיגות.",
      },
    ],
  });

  const [quote, setQuote] = useState({
    text:
      "דמוקרטיה בחינוך אינה מתירנות. היא הדרך הכי רצינית ללמד ילדים לקחת אחריות על עצמם ועל הקהילה שלהם.",
    attribution: "— מתוך החזון החינוכי של קשת",
  });

  const [faq, setFaq] = useState({
    heading: "שאלות נפוצות",
    items: [
      {
        q: "מה עם הבגרויות?",
        a:
          "תלמידי קשת ניגשים לבגרויות ומצליחים בהן. אנחנו מאמינים שאפשר להכין לבגרויות ברמה גבוהה מבלי לוותר על ערכי הדמוקרטיה. ההכנה מתחילה בחטיבת הביניים ומתעצמת בתיכון, עם ליווי אישי צמוד.",
      },
      {
        q: "אם הילדים מחליטים - מי שומר על הסדר?",
        a:
          "דמוקרטיה אינה אנרכיה. בקשת יש כללים ברורים שנקבעו על ידי הקהילה כולה. מי שמפר אותם עובר תהליך של מעגל ושיחה. הכלים הדמוקרטיים (כנסת, ועדות, מעגל) הם שמנהלים את החיים המשותפים.",
      },
      {
        q: "האם ילדים צעירים באמת יכולים לקבל החלטות?",
        a:
          "בהחלט. ההחלטות מותאמות לגיל - ילד בגן מחליט על פעילויות יומיות, ילד בכיתה ו׳ מנהל ועדה, ותלמיד בתיכון משפיע על מדיניות בית ספרית. זו למידה הדרגתית של אחריות ומנהיגות.",
      },
      {
        q: "מה המשמעות של 'פלורליסטי'?",
        a:
          "קשת הוקם על ידי משפחות חילוניות ודתיות יחד. אנחנו חוגגים את המגוון - יהודי, חילוני, מסורתי ודתי. התלמידים לומדים לכבד שונות, להכיר מסורות שונות ולבנות זהות אישית מתוך בחירה.",
      },
    ],
  });

  useEffect(() => {
    if (!loading && sections) {
      if (sections.hero) setHero((prev) => ({ ...prev, ...sections.hero }));
      if (sections.pillars) setPillars((prev) => ({ ...prev, ...sections.pillars }));
      if (sections.day_in_life) setDayInLife((prev) => ({ ...prev, ...sections.day_in_life }));
      if (sections.quote) setQuote((prev) => ({ ...prev, ...sections.quote }));
      if (sections.faq) setFaq((prev) => ({ ...prev, ...sections.faq }));
    }
  }, [loading, sections]);

  async function handleSave() {
    await saveAllSections({
      hero,
      pillars,
      day_in_life: dayInLife,
      quote,
      faq,
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
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">הדמוקרטיה בקשת</h1>
          <p className="text-sand-500 text-sm">עמודי התווך, יום בחיי תלמיד, ציטוט ושאלות נפוצות</p>
        </div>
      </div>

      <div className="space-y-4 max-w-3xl">
        <ContentSection title="כותרת ותיאור">
          <Input
            label="טקסט לפני הלוגו"
            value={hero.title_prefix}
            onChange={(e) => setHero({ ...hero, title_prefix: e.target.value })}
            placeholder="הדמוקרטיה ב"
          />
          <p className="text-xs text-sand-500 -mt-2">לוגו קשת מופיע אוטומטית אחרי הטקסט.</p>
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
            <textarea
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
            />
          </div>
        </ContentSection>

        <ContentSection title="עמודי התווך">
          <Input
            label="כותרת"
            value={pillars.heading}
            onChange={(e) => setPillars({ ...pillars, heading: e.target.value })}
          />
          <Input
            label="תת-כותרת"
            value={pillars.subheading}
            onChange={(e) => setPillars({ ...pillars, subheading: e.target.value })}
          />
          <ListEditor
            items={pillars.items}
            onChange={(items) => setPillars({ ...pillars, items })}
            createNew={() => ({ title: "", icon: "", description: "", examples: [] })}
            addLabel="עמוד תווך חדש"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <div className="grid grid-cols-[80px_1fr] gap-3">
                  <Input
                    label="אייקון"
                    value={item.icon}
                    onChange={(e) => onChange({ ...item, icon: e.target.value })}
                    placeholder="🏛️"
                  />
                  <Input
                    label="כותרת"
                    value={item.title}
                    onChange={(e) => onChange({ ...item, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => onChange({ ...item, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
                  />
                </div>
                <ListEditor
                  items={item.examples}
                  onChange={(examples) => onChange({ ...item, examples })}
                  createNew={() => ""}
                  addLabel="דוגמה חדשה"
                  renderItem={(ex, _, exChange) => (
                    <Input
                      value={ex}
                      onChange={(e) => exChange(e.target.value)}
                      placeholder="דוגמה..."
                    />
                  )}
                />
              </div>
            )}
          />
        </ContentSection>

        <ContentSection title="יום בחיי תלמיד/ה" defaultOpen={false}>
          <Input
            label="כותרת"
            value={dayInLife.heading}
            onChange={(e) => setDayInLife({ ...dayInLife, heading: e.target.value })}
          />
          <Input
            label="תת-כותרת"
            value={dayInLife.subheading}
            onChange={(e) => setDayInLife({ ...dayInLife, subheading: e.target.value })}
          />
          <ListEditor
            items={dayInLife.items}
            onChange={(items) => setDayInLife({ ...dayInLife, items })}
            createNew={() => ({ division: "", grades: "", emoji: "", description: "" })}
            addLabel="שכבה חדשה"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <div className="grid grid-cols-[80px_1fr_1fr] gap-3">
                  <Input
                    label="אימוג'י"
                    value={item.emoji}
                    onChange={(e) => onChange({ ...item, emoji: e.target.value })}
                    placeholder="🌱"
                  />
                  <Input
                    label="שכבה"
                    value={item.division}
                    onChange={(e) => onChange({ ...item, division: e.target.value })}
                  />
                  <Input
                    label="כיתות"
                    value={item.grades}
                    onChange={(e) => onChange({ ...item, grades: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-1.5">תיאור</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => onChange({ ...item, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
                  />
                </div>
              </div>
            )}
          />
        </ContentSection>

        <ContentSection title="ציטוט" defaultOpen={false}>
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">טקסט הציטוט</label>
            <textarea
              value={quote.text}
              onChange={(e) => setQuote({ ...quote, text: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
            />
          </div>
          <Input
            label="ייחוס"
            value={quote.attribution}
            onChange={(e) => setQuote({ ...quote, attribution: e.target.value })}
          />
        </ContentSection>

        <ContentSection title="שאלות נפוצות" defaultOpen={false}>
          <Input
            label="כותרת"
            value={faq.heading}
            onChange={(e) => setFaq({ ...faq, heading: e.target.value })}
          />
          <ListEditor
            items={faq.items}
            onChange={(items) => setFaq({ ...faq, items })}
            createNew={() => ({ q: "", a: "" })}
            addLabel="שאלה חדשה"
            renderItem={(item, _, onChange) => (
              <div className="space-y-3">
                <Input
                  label="שאלה"
                  value={item.q}
                  onChange={(e) => onChange({ ...item, q: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-1.5">תשובה</label>
                  <textarea
                    value={item.a}
                    onChange={(e) => onChange({ ...item, a: e.target.value })}
                    rows={3}
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
