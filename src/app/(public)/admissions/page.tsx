import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { RAINBOW_COLORS } from "@/lib/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "הרשמה",
  description: "הצטרפו למשפחת קשת! מידע על תהליך ההרשמה ויום פתוח בבית הספר.",
};

const steps = [
  {
    number: "01",
    title: "יצירת קשר ראשוני",
    description: "פנו אלינו בטלפון או במייל, או מלאו את טופס יצירת הקשר. נשמח לענות על כל שאלה.",
    color: RAINBOW_COLORS[0],
  },
  {
    number: "02",
    title: "ביקור בבית הספר",
    description: "הזמנה ליום פתוח או לביקור אישי. תוכלו לראות את בית הספר בפעולה, להכיר את הצוות ולחוש את האווירה.",
    color: RAINBOW_COLORS[1],
  },
  {
    number: "03",
    title: "שיחת היכרות",
    description: "שיחה אישית עם צוות בית הספר להכיר את הילד/ה ואת המשפחה ולוודא התאמה הדדית.",
    color: RAINBOW_COLORS[3],
  },
  {
    number: "04",
    title: "יום ניסיון",
    description: "הילד/ה מוזמן/ת ליום ניסיון בבית הספר, להתנסות בשגרה ולהכיר את חברי הכיתה.",
    color: RAINBOW_COLORS[4],
  },
  {
    number: "05",
    title: "הרשמה ומעבר",
    description: "לאחר הליך ההכרות, סיום תהליך ההרשמה וליווי מעבר חלק לבית הספר.",
    color: RAINBOW_COLORS[6],
  },
];

export default function AdmissionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-sand-50">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-900 mb-6">
              הצטרפו ל<span className="rainbow-gradient bg-clip-text text-transparent">קשת</span>
            </h1>
            <p className="text-xl text-sand-600 leading-relaxed">
              אנחנו שמחים שאתם מתעניינים בקשת! הנה כל מה שצריך לדעת על תהליך ההרשמה.
            </p>
          </div>
        </Container>
      </section>

      {/* Steps */}
      <section className="py-16">
        <Container size="md">
          <h2 className="text-3xl font-bold text-sand-900 mb-10 text-center">
            תהליך ההרשמה
          </h2>
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0"
                  style={{ backgroundColor: step.color }}
                >
                  {step.number}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-bold text-sand-900 mb-2">{step.title}</h3>
                  <p className="text-sand-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Open Day Banner */}
      <section className="py-16 bg-sand-50">
        <Container size="md">
          <div className="bg-white rounded-2xl shadow-lg border border-sand-200 p-8 sm:p-12 text-center">
            <div className="rainbow-gradient bg-clip-text text-transparent text-sm font-bold mb-3 tracking-wider">
              יום פתוח
            </div>
            <h2 className="text-3xl font-bold text-sand-900 mb-4">
              בואו להכיר אותנו מקרוב
            </h2>
            <p className="text-sand-600 mb-6 max-w-lg mx-auto">
              ימי פתוח מתקיימים לאורך השנה. צרו קשר לקביעת ביקור אישי או להתעדכן במועד יום הפתוח הקרוב.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <Button size="lg">צרו קשר לקביעת ביקור</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <Container size="md">
          <h2 className="text-3xl font-bold text-sand-900 mb-10 text-center">שאלות נפוצות</h2>
          <div className="space-y-4">
            {[
              {
                q: "מהו טווח הגילאים בקשת?",
                a: "קשת מקבלת תלמידים מגן (גילאי 3) ועד כיתה י\"ב.",
              },
              {
                q: "האם יש בגרויות?",
                a: "כן, בתיכון ניתן ללמוד ולהיבחן בבחינות בגרות.",
              },
              {
                q: "מהי שכר הלימוד?",
                a: "שכר הלימוד משתנה בהתאם לגיל. צרו קשר לפרטים מדויקים.",
              },
              {
                q: "האם יש הסעות?",
                a: "כן, ישנם קווי הסעה מישובים שונים באזור. צרו קשר לפרטים.",
              },
              {
                q: "מה ייחודי בחינוך הדמוקרטי?",
                a: "בחינוך דמוקרטי התלמידים שותפים פעילים בקבלת החלטות על חיי בית הספר, ויש שוויון ערך בין מורים לתלמידים.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="bg-white rounded-xl p-6 shadow-sm border border-sand-200"
              >
                <h3 className="font-bold text-sand-900 mb-2">{faq.q}</h3>
                <p className="text-sand-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
