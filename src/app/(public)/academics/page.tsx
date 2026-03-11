import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "לימודים",
  description: "תוכניות הלימוד בבית הספר קשת - מגן ועד י\"ב. חינוך דמוקרטי, יהודי-פלורליסטי ומותאם אישית.",
};

const programs = [
  {
    title: "בית צעירים",
    ages: "גן - כיתה ב׳",
    description: "סביבה חמה ומטפחת שבה ילדים לומדים דרך משחק, יצירה וחקירה. דגש על התפתחות רגשית-חברתית ופיתוח סקרנות טבעית.",
    highlights: ["למידה דרך משחק", "פעילויות בטבע", "יצירה ואמנות", "מעגלי שיחה"],
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=800&q=80",
    color: RAINBOW_COLORS[0],
  },
  {
    title: "חממה",
    ages: "כיתות ג׳-ה׳",
    description: "תוכנית לימודים מקיפה שמשלבת בין לימודי ליבה לבין פיתוח אישי, ערכי דמוקרטיה וזהות יהודית-פלורליסטית.",
    highlights: ["לימודי ליבה", "פרויקטים בין-תחומיים", "כנסת תלמידים", "טיולים ומסעות"],
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
    color: RAINBOW_COLORS[1],
  },
  {
    title: 'שכב"ג',
    ages: "כיתות ו׳-ח׳",
    description: "שנות המעבר החשובות. ליווי אישי, העמקה אקדמית ופיתוח חשיבה ביקורתית ועצמאית בסביבה תומכת.",
    highlights: ["התמחויות בחירה", "פרויקטים אישיים", "מנהיגות ומעורבות", "הכנה לתיכון"],
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    color: RAINBOW_COLORS[3],
  },
  {
    title: "תיכון",
    ages: "כיתות ט׳-י״ב",
    description: "הכנה לבגרויות ולחיים. מגוון מקצועות בחירה, העמקה אקדמית, מנהיגות קהילתית ופיתוח זהות אישית.",
    highlights: ["מגמות בגרות", "שירות קהילתי", "הכנה לצבא/שירות", "פרויקט גמר אישי"],
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
    color: RAINBOW_COLORS[4],
  },
];

const approaches = [
  {
    title: "למידה פרויקטלית",
    description: "תלמידים לומדים דרך פרויקטים מעשיים שמחברים בין תחומי דעת שונים ומפתחים חשיבה יצירתית.",
    icon: "🔬",
  },
  {
    title: "למידה מותאמת אישית",
    description: "כל תלמיד מקבל תשומת לב אישית, בהתאם לקצב, לסגנון הלמידה ולתחומי העניין שלו.",
    icon: "🎯",
  },
  {
    title: "למידה חברתית-רגשית",
    description: "פיתוח מיומנויות חברתיות, ניהול רגשות ותקשורת בין-אישית כחלק בלתי נפרד מתוכנית הלימודים.",
    icon: "💬",
  },
  {
    title: "חינוך יהודי-פלורליסטי",
    description: "הכרות עם מסורת ותרבות יהודית מגוונת, חגים, טקסטים ודיונים - מתוך כבוד ופתיחות.",
    icon: "📖",
  },
];

export default function AcademicsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-sand-50">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-900 mb-6">
              לימודים ב<img src="/images/logo.png" alt="קשת" className="inline h-16 sm:h-20" style={{ verticalAlign: "middle", marginTop: "-0.15em" }} />
            </h1>
            <p className="text-xl text-sand-600 leading-relaxed">
              תוכנית חינוכית מקיפה מגן ועד י&quot;ב, שמשלבת מצוינות אקדמית
              עם ערכים דמוקרטיים וזהות יהודית-פלורליסטית.
            </p>
          </div>
        </Container>
      </section>

      {/* Programs */}
      <section className="py-16">
        <Container>
          <div className="space-y-16">
            {programs.map((program, index) => (
              <div
                key={program.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                  index % 2 === 1 ? "lg:direction-ltr" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-1 rounded-full"
                      style={{ backgroundColor: program.color }}
                    />
                    <span className="text-sm font-medium text-sand-500">{program.ages}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-sand-900 mb-4">{program.title}</h2>
                  <p className="text-sand-600 leading-relaxed mb-6">{program.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {program.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-center gap-2 text-sm text-sand-700"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: program.color }}
                        />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <img
                    src={program.image}
                    alt={program.title}
                    className="rounded-2xl shadow-lg w-full object-cover h-72 lg:h-80"
                  />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Teaching Approach */}
      <section className="py-16 bg-sand-50">
        <Container>
          <h2 className="text-3xl font-bold text-sand-900 mb-4 text-center">הגישה החינוכית</h2>
          <p className="text-lg text-sand-600 text-center mb-12 max-w-2xl mx-auto">
            כך אנחנו מלמדים בקשת - גישה שמכבדת את הילד ומאמינה ביכולת שלו
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {approaches.map((approach) => (
              <div
                key={approach.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200"
              >
                <span className="text-3xl mb-4 block">{approach.icon}</span>
                <h3 className="text-lg font-bold text-sand-900 mb-2">{approach.title}</h3>
                <p className="text-sand-600 text-sm leading-relaxed">{approach.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Daily Routine */}
      <section className="py-16">
        <Container size="md">
          <h2 className="text-3xl font-bold text-sand-900 mb-8 text-center">יום טיפוסי בקשת</h2>
          <div className="space-y-4">
            {[
              { time: "07:45-08:15", activity: "התכנסות ומעגל בוקר", color: RAINBOW_COLORS[0] },
              { time: "08:15-10:00", activity: "לימודי בוקר - מקצועות ליבה", color: RAINBOW_COLORS[1] },
              { time: "10:00-10:30", activity: "הפסקה ואוכל", color: RAINBOW_COLORS[2] },
              { time: "10:30-12:00", activity: "למידה פרויקטלית / בחירה", color: RAINBOW_COLORS[3] },
              { time: "12:00-12:30", activity: "הפסקת צהריים", color: RAINBOW_COLORS[4] },
              { time: "12:30-14:00", activity: "פעילויות העשרה / ועדות / חוגים", color: RAINBOW_COLORS[5] },
              { time: "14:00", activity: "סיום יום", color: RAINBOW_COLORS[6] },
            ].map((slot) => (
              <div key={slot.time} className="flex items-center gap-4">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: slot.color }}
                />
                <span dir="ltr" className="text-sm font-mono text-sand-500 w-24 text-start">
                  {slot.time}
                </span>
                <span className="text-sand-800">{slot.activity}</span>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-sand-500 text-sm italic">
            * המערכת עשויה להשתנות בין שכבות הגיל
          </p>
        </Container>
      </section>
    </>
  );
}
