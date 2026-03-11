import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { RAINBOW_COLORS } from "@/lib/constants";
import { getPageContent } from "@/lib/cms";
import Link from "next/link";

export const metadata: Metadata = {
  title: "הרשמה",
  description: "הצטרפו למשפחת קשת! מידע על תהליך ההרשמה ויום פתוח בבית הספר.",
};

const defaults = {
  hero: {
    title: "הצטרפו לקשת",
    description: "אנחנו שמחים שאתם מתעניינים בקשת! הנה כל מה שצריך לדעת על תהליך ההרשמה.",
  },
  steps: {
    heading: "תהליך ההרשמה",
    items: [
      { number: "01", title: "יצירת קשר ראשוני", description: "פנו אלינו בטלפון או במייל, או מלאו את טופס יצירת הקשר. נשמח לענות על כל שאלה." },
      { number: "02", title: "ביקור בבית הספר", description: "הזמנה ליום פתוח או לביקור אישי. תוכלו לראות את בית הספר בפעולה, להכיר את הצוות ולחוש את האווירה." },
      { number: "03", title: "שיחת היכרות", description: "שיחה אישית עם צוות בית הספר להכיר את הילד/ה ואת המשפחה ולוודא התאמה הדדית." },
      { number: "04", title: "יום ניסיון", description: "הילד/ה מוזמן/ת ליום ניסיון בבית הספר, להתנסות בשגרה ולהכיר את חברי הכיתה." },
      { number: "05", title: "הרשמה ומעבר", description: "לאחר הליך ההכרות, סיום תהליך ההרשמה וליווי מעבר חלק לבית הספר." },
    ],
  },
  open_day: {
    label: "יום פתוח",
    heading: "בואו להכיר אותנו מקרוב",
    description: "ימי פתוח מתקיימים לאורך השנה. צרו קשר לקביעת ביקור אישי או להתעדכן במועד יום הפתוח הקרוב.",
  },
  faq: {
    heading: "שאלות נפוצות",
    items: [
      { question: "מהו טווח הגילאים בקשת?", answer: "קשת מקבלת תלמידים מגן (גילאי 3) ועד כיתה י\"ב." },
      { question: "האם יש בגרויות?", answer: "כן, בתיכון ניתן ללמוד ולהיבחן בבחינות בגרות." },
      { question: "מהי שכר הלימוד?", answer: "שכר הלימוד משתנה בהתאם לגיל. צרו קשר לפרטים מדויקים." },
      { question: "האם יש הסעות?", answer: "כן, ישנם קווי הסעה מישובים שונים באזור. צרו קשר לפרטים." },
      { question: "מה ייחודי בחינוך הדמוקרטי?", answer: "בחינוך דמוקרטי התלמידים שותפים פעילים בקבלת החלטות על חיי בית הספר, ויש שוויון ערך בין מורים לתלמידים." },
    ],
  },
};

const stepColors = [RAINBOW_COLORS[0], RAINBOW_COLORS[1], RAINBOW_COLORS[3], RAINBOW_COLORS[4], RAINBOW_COLORS[6]];

export default async function AdmissionsPage() {
  const content = await getPageContent("admissions");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (key: string) => ({ ...defaults[key as keyof typeof defaults], ...(content[key] as any) });
  const hero = c("hero");
  const steps = c("steps");
  const openDay = c("open_day");
  const faq = c("faq");

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-sand-50">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-900 mb-6">
              {hero.title.includes("קשת") ? (
                <>
                  הצטרפו ל<img src="/images/logo.png" alt="קשת" className="inline h-16 sm:h-20" style={{ verticalAlign: "middle", marginTop: "-0.15em" }} />
                </>
              ) : hero.title}
            </h1>
            <p className="text-xl text-sand-600 leading-relaxed">{hero.description}</p>
          </div>
        </Container>
      </section>

      {/* Steps */}
      <section className="py-16">
        <Container size="md">
          <h2 className="text-3xl font-bold text-sand-900 mb-10 text-center">{steps.heading}</h2>
          <div className="space-y-8">
            {steps.items.map((step: { number: string; title: string; description: string }, index: number) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0" style={{ backgroundColor: stepColors[index % stepColors.length] }}>
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
            <div className="text-sm font-bold mb-3 tracking-wider text-primary-600">{openDay.label}</div>
            <h2 className="text-3xl font-bold text-sand-900 mb-4">{openDay.heading}</h2>
            <p className="text-sand-600 mb-6 max-w-lg mx-auto">{openDay.description}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact"><Button size="lg">צרו קשר לקביעת ביקור</Button></Link>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <Container size="md">
          <h2 className="text-3xl font-bold text-sand-900 mb-10 text-center">{faq.heading}</h2>
          <div className="space-y-4">
            {faq.items.map((item: { question: string; answer: string }) => (
              <div key={item.question} className="bg-white rounded-xl p-6 shadow-sm border border-sand-200">
                <h3 className="font-bold text-sand-900 mb-2">{item.question}</h3>
                <p className="text-sand-600 text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
