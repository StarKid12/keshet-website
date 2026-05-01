import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getPageContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  description: "הצהרת נגישות של בית הספר הדמוקרטי יהודי-פלורליסטי קשת בזכרון יעקב.",
};

const defaults = {
  hero: {
    title: "הצהרת נגישות",
    description: "בית הספר קשת מחויב להנגשת האתר לכלל האוכלוסייה, לרבות אנשים עם מוגבלויות.",
  },
  general: {
    heading: "כללי",
    body:
      "בית הספר הדמוקרטי יהודי-פלורליסטי קשת בזכרון יעקב פועל להנגשת אתר האינטרנט שלו בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע\"ג-2013, ובהתאם לתקן הישראלי ת\"י 5568 המבוסס על הנחיות WCAG 2.0 ברמת AA.",
  },
  actions: {
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
    ],
  },
  on_site: {
    heading: "הסדרי נגישות בבית הספר",
    items: [
      "חניית נכים מסומנת בחצר בית הספר",
      "דרכי גישה נגישות לכיסאות גלגלים",
      "שירותי נגישות",
    ],
  },
  contact: {
    heading: "יצירת קשר בנושא נגישות",
    intro: "אם נתקלתם בבעיית נגישות באתר או זקוקים לסיוע, אנא פנו אלינו:",
    coordinator: "בית הספר קשת",
    email: "info@keshet-school.co.il",
    phone: "04-XXX-XXXX",
  },
  updated: {
    heading: "תאריך עדכון",
    body: "הצהרה זו עודכנה לאחרונה בתאריך מרץ 2026.",
  },
};

export default async function AccessibilityPage() {
  const content = await getPageContent("accessibility");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (key: keyof typeof defaults) => ({ ...defaults[key], ...(content[key] as any) });

  const hero = c("hero");
  const general = c("general");
  const actions = c("actions");
  const onSite = c("on_site");
  const contact = c("contact");
  const updated = c("updated");

  return (
    <>
      <section className="relative py-20 bg-sand-50">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-900 mb-6">
              {hero.title}
            </h1>
            <p className="text-xl text-sand-600 leading-relaxed">
              {hero.description}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container size="md">
          <div className="prose prose-sand max-w-none space-y-8 text-sand-700 leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-sand-900 mb-4">{general.heading}</h2>
              <p>{general.body}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-sand-900 mb-4">{actions.heading}</h2>
              <ul className="list-disc list-inside space-y-2">
                {actions.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-sand-900 mb-4">{onSite.heading}</h2>
              <ul className="list-disc list-inside space-y-2">
                {onSite.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-sand-900 mb-4">{contact.heading}</h2>
              <p>{contact.intro}</p>
              <div className="bg-sand-50 rounded-xl p-6 mt-4 border border-sand-200">
                <ul className="space-y-3 text-sand-700">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-sand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span><strong>רכז/ת נגישות:</strong> {contact.coordinator}</span>
                  </li>
                  {contact.email && (
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-sand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span><strong>אימייל:</strong> {contact.email}</span>
                    </li>
                  )}
                  {contact.phone && (
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-sand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span dir="ltr"><strong>טלפון:</strong> {contact.phone}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-sand-900 mb-4">{updated.heading}</h2>
              <p>{updated.body}</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
