import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "הדמוקרטיה בקשת",
  description: "כיצד פועלת הדמוקרטיה בבית הספר קשת - כנסת, ועדות, מעגל, וקבלת החלטות משותפת.",
};

const pillars = [
  {
    title: "כנסת קשת",
    icon: "🏛️",
    description: "הפרלמנט של בית הספר. כנסת קשת היא המוסד הדמוקרטי המרכזי - אסיפה שבועית שבה כל חברי הקהילה (תלמידים, מורים וצוות) מצביעים על החלטות הנוגעות לחיי בית הספר. לכל אחד קול שווה, מכיתה א׳ ועד י״ב.",
    examples: ["קביעת כללי התנהגות", "אישור פעילויות בית ספריות", "הקצאת תקציבים", "בחירת נציגים לוועדות"],
    color: RAINBOW_COLORS[4],
  },
  {
    title: "ועדות",
    icon: "👥",
    description: "ועדות הן הזרוע הביצועית של הדמוקרטיה. תלמידים ומורים עובדים יחד בוועדות מתמחות שמנהלות תחומים שונים בחיי בית הספר. חברות בוועדה היא וולונטרית ופתוחה לכולם.",
    examples: ["ועדת תרבות ואירועים", "ועדת סביבה וניקיון", "ועדת חברה וקהילה", "ועדת תקשורת"],
    color: RAINBOW_COLORS[3],
  },
  {
    title: "מעגל",
    icon: "⭕",
    description: "המעגל הוא כלי מרכזי ליישוב סכסוכים ולשיח פתוח. כשיש קונפליקט, בעיה, או נושא שדורש דיון - מתכנסים למעגל. כולם יושבים בשוויון, כולם מדברים, כולם מקשיבים. אין היררכיה - יש הקשבה.",
    examples: ["יישוב סכסוכים בין תלמידים", "דיון בנושאים רגשיים", "חגיגות וטקסים", "שיתוף חוויות אישיות"],
    color: RAINBOW_COLORS[6],
  },
  {
    title: "בחירה אישית",
    icon: "🎯",
    description: "בקשת, התלמידים שותפים פעילים בעיצוב מסלול הלמידה שלהם. החל מגיל צעיר, הם לומדים לבחור, לקחת אחריות ולהתמודד עם תוצאות הבחירות שלהם. הבחירה היא לא רק זכות - היא כלי חינוכי.",
    examples: ["בחירת קורסי העשרה", "הצעת נושאים ללמידה", "ניהול זמן עצמאי", "פרויקטים אישיים"],
    color: RAINBOW_COLORS[1],
  },
];

const dayInLife = [
  {
    division: "בית צעירים",
    grades: "גן - כיתה ב׳",
    description: "הילדים מתחילים את היום במעגל בוקר - שיתוף, שירה ותכנון היום. הלמידה משלבת משחק חופשי, סדנאות יצירה, פעילות בטבע ולמידה בקבוצות קטנות. ההחלטות נעשות יחד: מה נבשל? לאן נטייל? איך נפתור את הבעיה?",
    color: RAINBOW_COLORS[0],
    emoji: "🌱",
  },
  {
    division: "חממה",
    grades: "כיתות ג׳-ה׳",
    description: "היום מתחיל בכנסת החממה - דיון בנושאים שעלו, הצעות חדשות והצבעות. לימודי הליבה משולבים עם פרויקטים בין-תחומיים שהתלמידים בוחרים. יש שעות קבועות ושעות בחירה, ותלמידים לומדים לנהל את הזמן שלהם.",
    color: RAINBOW_COLORS[1],
    emoji: "🪴",
  },
  {
    division: 'שכב"ג',
    grades: "כיתות ו׳-ח׳",
    description: "התלמידים מנהלים חלק משמעותי מחיי בית הספר דרך הוועדות. הם מובילים פרויקטים, מארגנים אירועים ומשתתפים בכנסת קשת הגדולה. הלמידה מעמיקה יותר, עם דגש על חשיבה ביקורתית, ויכוח ומחקר עצמאי.",
    color: RAINBOW_COLORS[3],
    emoji: "🌿",
  },
  {
    division: "תיכון",
    grades: "כיתות ט׳-י״ב",
    description: "תלמידי התיכון הם שותפים מלאים בניהול בית הספר. הם מובילים ועדות, מייעצים לצוות ומשמשים מנטורים לצעירים. לצד ההכנה לבגרויות, יש פרויקט גמר אישי, שירות קהילתי ותוכנית מנהיגות.",
    color: RAINBOW_COLORS[4],
    emoji: "🌳",
  },
];

const faqs = [
  {
    q: "מה עם הבגרויות?",
    a: "תלמידי קשת ניגשים לבגרויות ומצליחים בהן. אנחנו מאמינים שאפשר להכין לבגרויות ברמה גבוהה מבלי לוותר על ערכי הדמוקרטיה. ההכנה מתחילה בחטיבת הביניים ומתעצמת בתיכון, עם ליווי אישי צמוד.",
  },
  {
    q: "אם הילדים מחליטים - מי שומר על הסדר?",
    a: "דמוקרטיה אינה אנרכיה. בקשת יש כללים ברורים שנקבעו על ידי הקהילה כולה. מי שמפר אותם עובר תהליך של מעגל ושיחה. הכלים הדמוקרטיים (כנסת, ועדות, מעגל) הם שמנהלים את החיים המשותפים.",
  },
  {
    q: "האם ילדים צעירים באמת יכולים לקבל החלטות?",
    a: "בהחלט. ההחלטות מותאמות לגיל - ילד בגן מחליט על פעילויות יומיות, ילד בכיתה ו׳ מנהל ועדה, ותלמיד בתיכון משפיע על מדיניות בית ספרית. זו למידה הדרגתית של אחריות ומנהיגות.",
  },
  {
    q: "מה המשמעות של 'פלורליסטי'?",
    a: "קשת הוקם על ידי משפחות חילוניות ודתיות יחד. אנחנו חוגגים את המגוון - יהודי, חילוני, מסורתי ודתי. התלמידים לומדים לכבד שונות, להכיר מסורות שונות ולבנות זהות אישית מתוך בחירה.",
  },
];

export default function DemocracyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-sand-50">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-900 mb-6">
              הדמוקרטיה ב<img src="/images/logo.png" alt="קשת" className="inline h-16 sm:h-20" style={{ verticalAlign: "middle", marginTop: "-0.15em" }} />
            </h1>
            <p className="text-xl text-sand-600 leading-relaxed">
              בקשת, דמוקרטיה היא לא רק ערך - היא דרך חיים. התלמידים לא רק לומדים
              על דמוקרטיה, הם חיים אותה כל יום. מכיתה א׳ ועד י״ב, כל קול נשמע
              וכל אדם שווה.
            </p>
          </div>
        </Container>
      </section>

      {/* Core Pillars */}
      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-bold text-sand-900 mb-4 text-center">
            ארבעת עמודי התווך
          </h2>
          <p className="text-lg text-sand-600 text-center mb-12 max-w-2xl mx-auto">
            הכלים הדמוקרטיים שמנהלים את החיים המשותפים בקשת
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${pillar.color}15` }}
                  >
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-sand-900">{pillar.title}</h3>
                </div>
                <p className="text-sand-600 leading-relaxed mb-4">{pillar.description}</p>
                <div className="flex flex-wrap gap-2">
                  {pillar.examples.map((example) => (
                    <span
                      key={example}
                      className="text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: `${pillar.color}10`,
                        color: pillar.color,
                      }}
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* A Day in the Life */}
      <section className="py-16 bg-sand-50">
        <Container>
          <h2 className="text-3xl font-bold text-sand-900 mb-4 text-center">
            יום בחיי תלמיד/ה בקשת
          </h2>
          <p className="text-lg text-sand-600 text-center mb-12 max-w-2xl mx-auto">
            כך נראית הדמוקרטיה בפועל, בכל שכבת גיל
          </p>
          <div className="space-y-6">
            {dayInLife.map((level) => (
              <div
                key={level.division}
                className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200 flex gap-5 items-start"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: `${level.color}15` }}
                >
                  {level.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-sand-900">{level.division}</h3>
                    <span className="text-sm text-sand-500">({level.grades})</span>
                  </div>
                  <p className="text-sand-600 leading-relaxed">{level.description}</p>
                </div>
                <div
                  className="w-1.5 h-full min-h-[60px] rounded-full shrink-0 hidden sm:block"
                  style={{ backgroundColor: level.color }}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Quote */}
      <section className="py-16">
        <Container size="md">
          <blockquote className="text-center">
            <div
              className="text-5xl mb-4 opacity-30"
              style={{ color: RAINBOW_COLORS[4] }}
            >
              &ldquo;
            </div>
            <p className="text-2xl sm:text-3xl font-medium text-sand-800 leading-relaxed mb-6">
              דמוקרטיה בחינוך אינה מתירנות. היא הדרך הכי רצינית ללמד ילדים
              לקחת אחריות על עצמם ועל הקהילה שלהם.
            </p>
            <footer className="text-sand-500">
              — מתוך החזון החינוכי של קשת
            </footer>
          </blockquote>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-sand-50">
        <Container size="md">
          <h2 className="text-3xl font-bold text-sand-900 mb-10 text-center">
            שאלות נפוצות
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: RAINBOW_COLORS[index % RAINBOW_COLORS.length] }}
                  >
                    ?
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-sand-900 mb-2">{faq.q}</h3>
                    <p className="text-sand-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
