import { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  description: "הצהרת נגישות של בית הספר הדמוקרטי יהודי-פלורליסטי קשת בזכרון יעקב.",
};

export default function AccessibilityPage() {
  return (
    <>
      <section className="relative py-20 bg-sand-50">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-900 mb-6">
              הצהרת נגישות
            </h1>
            <p className="text-xl text-sand-600 leading-relaxed">
              בית הספר קשת מחויב להנגשת האתר לכלל האוכלוסייה, לרבות אנשים עם מוגבלויות.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container size="md">
          <div className="prose prose-sand max-w-none space-y-8 text-sand-700 leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-sand-900 mb-4">כללי</h2>
              <p>
                בית הספר הדמוקרטי יהודי-פלורליסטי קשת בזכרון יעקב פועל להנגשת אתר האינטרנט שלו
                בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע&quot;ג-2013,
                ובהתאם לתקן הישראלי ת&quot;י 5568 המבוסס על הנחיות WCAG 2.0 ברמת AA.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-sand-900 mb-4">פעולות שבוצעו להנגשת האתר</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>התאמת האתר לשימוש בטכנולוגיות מסייעות וקוראי מסך</li>
                <li>ניווט באמצעות מקלדת בכל רחבי האתר</li>
                <li>שימוש בניגודיות צבעים מתאימה</li>
                <li>הוספת תיאורים חלופיים (alt) לתמונות</li>
                <li>מבנה כותרות היררכי ונכון</li>
                <li>טפסים מסומנים עם תוויות (labels) מתאימות</li>
                <li>תמיכה בשינוי גודל טקסט</li>
                <li>תמיכה מלאה בכיווניות RTL (ימין לשמאל)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-sand-900 mb-4">הסדרי נגישות בבית הספר</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>חניית נכים מסומנת בחצר בית הספר</li>
                <li>דרכי גישה נגישות לכיסאות גלגלים</li>
                <li>שירותי נגישות</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-sand-900 mb-4">יצירת קשר בנושא נגישות</h2>
              <p>
                אם נתקלתם בבעיית נגישות באתר או זקוקים לסיוע, אנא פנו אלינו:
              </p>
              <div className="bg-sand-50 rounded-xl p-6 mt-4 border border-sand-200">
                <ul className="space-y-3 text-sand-700">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-sand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span><strong>רכז/ת נגישות:</strong> בית הספר קשת</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-sand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span><strong>אימייל:</strong> info@keshet-school.co.il</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-sand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span dir="ltr"><strong>טלפון:</strong> 04-XXX-XXXX</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-sand-900 mb-4">תאריך עדכון</h2>
              <p>הצהרה זו עודכנה לאחרונה בתאריך מרץ 2026.</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
