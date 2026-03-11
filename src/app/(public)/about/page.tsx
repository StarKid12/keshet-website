import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";
import { getPageContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "אודות",
  description: "הכירו את בית הספר הדמוקרטי יהודי-פלורליסטי קשת בזכרון יעקב - חזון, ערכים והגישה החינוכית שלנו.",
};

const defaults = {
  hero: {
    title: "אודות",
    description: "בית הספר הדמוקרטי יהודי-פלורליסטי קשת בזכרון יעקב הוא מוסד חינוכי ייחודי, שנוסד בשנת 2001 על ידי קבוצת משפחות חילוניות ודתיות שחיפשו חלופה חינוכית לילדיהם - מגיל הגן ועד התיכון.",
  },
  vision: {
    heading: "החזון שלנו",
    paragraphs: [
      "<strong>גיוון ושוני מעשירים אותנו, וחברה ראויה מדגישה את הייחודיות של כל אדם ואינה מחפשת אחידות.</strong> זהו הבסיס החינוכי של בית הספר, המוכר על ידי משרד החינוך.",
      "קשת יצרה מודל של שפה, תרבות וסביבה יהודית שמדברת אל חילונים ודתיים כאחד. סוגיות כמו פלורליזם דתי וסובלנות מטופלות באמצעות דיונים דמוקרטיים וכבוד הדדי, ויוצרות חיי קהילה משותפים בין זרמים שונים של החברה הישראלית.",
      "בוגרי בית הספר הם שגרירים של ערכי קשת. מטרתנו שיהפכו למנהיגים פעילים ואחראיים, שיסייעו לגשר על פערים בחברה הישראלית ויתמכו בדו-קיום של השקפות, דעות ואמונות שונות.",
    ],
    image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
  },
  values: {
    heading: "הערכים שלנו",
    items: [
      { title: "חופש בחירה", description: "חופש ללמוד, לחקור ולבחור - תוך אחריות ומודעות. כל תלמיד שותף בתהליך." },
      { title: "שוויון", description: "מורים ותלמידים שווים. כל אחד, ללא קשר לגיל, בעל קול שווה בהכרעות." },
      { title: "פלורליזם", description: "חילונים ודתיים לומדים יחד, מכבדים את השונות ומתעשרים ממנה." },
      { title: "קהילתיות", description: "משפחה רחבה של הורים, מורים ותלמידים שבונים יחד חברה טובה יותר." },
    ],
  },
  democracy: {
    heading: "הגישה הדמוקרטית",
    paragraphs: [
      "בית הספר מתנהל כמדינה דמוקרטית. <strong>כנסת קשת</strong> היא הפרלמנט של בית הספר - היא מחוקקת חוקים שלפיהם מתנהל בית הספר, וכל אחד, ללא קשר לגיל, בעל זכות הצבעה שווה.",
      "פעילות בית הספר מנוהלת על ידי <strong>ועדות</strong> המורכבות מתלמידים, מורים והורים. הוועדות מתכננות ומבצעות טיולים, אירועים ופעילויות ספורט. קונפליקטים נפתרים באמצעות דיאלוג, גישור או הליך דמוקרטי דרך ועדת <strong>המעגל</strong>.",
    ],
    bullets: [
      "כנסת בית ספר - פרלמנט עם הצבעה שוויונית",
      "ועדות תלמידים-מורים-הורים פעילות",
      "ועדת המעגל - גישור ופתרון קונפליקטים",
      "שוויון מלא בין מורים לתלמידים בהצבעות",
    ],
    image_url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&q=80",
  },
  pluralism: {
    heading: "מסע הפלורליזם",
    description: "תוכנית \"מסע פלורליזם ישראלי\" מטרתה להכיר לתלמידים דרכי חיים מגוונות בישראל - דעות פוליטיות ודתיות, תרבויות וקבוצות אתניות, וצורות מגורים חלופיות. התלמידים לומדים להבין ולקבל את האחר, מתוך מטרה לבנות חברה פלורליסטית שמתעשרת מהשונות.",
    items: [
      { title: "למידה בשטח", description: "טיולים ברחבי הארץ לפגישה עם קהילות מגוונות וחשיפה לאורחות חיים שונות." },
      { title: "דיאלוג ומפגש", description: "פעילויות בבית הספר הכוללות דיונים, סדנאות ומפגשים עם אנשים מרקעים שונים." },
      { title: "מנהיגות אחראית", description: "הכשרת הדור הבא של אזרחי ישראל - מנהיגים שמבינים ומכבדים את הפסיפס הישראלי." },
    ],
  },
  timeline: {
    heading: "ציר הזמן שלנו",
    events: [
      { year: "2001", title: "הקמת עמותת קשת", description: "קבוצה קטנה של משפחות חילוניות ודתיות בזכרון יעקב הקימה את עמותת קשת, בחיפוש אחר חלופה חינוכית מגן ועד תיכון." },
      { year: "2002", title: "פתיחת בית הספר", description: "קשת פתחה את שעריה כבית ספר דמוקרטי יהודי-פלורליסטי, מבוסס על ערכי דמוקרטיה ופלורליזם דתי." },
      { year: "2010", title: "הרחבה והתפתחות", description: "פתיחת חטיבת הביניים והמשך צמיחה. בית הספר עבר ארבע פעמים מאז הקמתו, וגדל ללא הפסקה." },
      { year: "2015", title: "השלמת המסלול החינוכי", description: "השלמת המסלול מגן ועד י\"ב עם פתיחת כיתות התיכון." },
    ],
  },
  structure: {
    heading: "מבנה בית הספר",
    levels: [
      { name: "בית צעירים", grades: "גן - כיתה ב׳", emoji: "🌱" },
      { name: "חממה", grades: "כיתות ג׳-ה׳", emoji: "🪴" },
      { name: 'שכב"ג', grades: "כיתות ו׳-ח׳", emoji: "🌿" },
      { name: "תיכון", grades: "כיתות ט׳-י״ב", emoji: "🌳" },
    ],
  },
};

const valueColors = [RAINBOW_COLORS[0], RAINBOW_COLORS[1], RAINBOW_COLORS[3], RAINBOW_COLORS[5]];
const pluralismColors = [RAINBOW_COLORS[4], RAINBOW_COLORS[1], RAINBOW_COLORS[3]];
const structureColors = [RAINBOW_COLORS[0], RAINBOW_COLORS[1], RAINBOW_COLORS[3], RAINBOW_COLORS[4]];

export default async function AboutPage() {
  const content = await getPageContent("about");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (key: string) => ({ ...defaults[key as keyof typeof defaults], ...(content[key] as any) });
  const hero = c("hero");
  const vision = c("vision");
  const values = c("values");
  const democracy = c("democracy");
  const pluralism = c("pluralism");
  const timeline = c("timeline");
  const structure = c("structure");

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-sand-50">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-900 mb-6">
              {hero.title} <img src="/images/logo.png" alt="קשת" className="inline h-16 sm:h-20" style={{ verticalAlign: "middle", marginTop: "-0.15em" }} />
            </h1>
            <p className="text-xl text-sand-600 leading-relaxed">
              {hero.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-sand-900 mb-6">{vision.heading}</h2>
              {vision.paragraphs.map((p: string, i: number) => (
                <p key={i} className="text-sand-600 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
            <div className="relative">
              <img src={vision.image_url} alt="תלמידים בקשת" className="rounded-2xl shadow-lg" />
              <div className="absolute -bottom-4 -start-4 w-24 h-24 rounded-2xl opacity-20" style={{ backgroundColor: RAINBOW_COLORS[3] }} />
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 bg-sand-50">
        <Container>
          <h2 className="text-3xl font-bold text-sand-900 mb-10 text-center">{values.heading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.items.map((value: { title: string; description: string }, index: number) => (
              <div key={value.title} className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200 text-center">
                <div className="w-12 h-1 mx-auto rounded-full mb-4" style={{ backgroundColor: valueColors[index % valueColors.length] }} />
                <h3 className="text-lg font-bold text-sand-900 mb-2">{value.title}</h3>
                <p className="text-sm text-sand-600">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Democratic Approach */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img src={democracy.image_url} alt="כנסת קשת" className="rounded-2xl shadow-lg" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-sand-900 mb-6">{democracy.heading}</h2>
              {democracy.paragraphs.map((p: string, i: number) => (
                <p key={i} className="text-sand-600 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: p }} />
              ))}
              <ul className="space-y-3">
                {democracy.bullets.map((item: string) => (
                  <li key={item} className="flex items-center gap-3 text-sand-700">
                    <svg className="w-5 h-5 text-rainbow-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Pluralism Journey */}
      <section className="py-16 bg-gradient-to-b from-sand-50 to-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold text-sand-900 mb-4">{pluralism.heading}</h2>
            <p className="text-sand-600 leading-relaxed">{pluralism.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pluralism.items.map((item: { title: string; description: string }, index: number) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${pluralismColors[index % pluralismColors.length]}20` }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pluralismColors[index % pluralismColors.length] }} />
                </div>
                <h3 className="font-bold text-sand-900 mb-2">{item.title}</h3>
                <p className="text-sm text-sand-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <Container size="md">
          <h2 className="text-3xl font-bold text-sand-900 mb-10 text-center">{timeline.heading}</h2>
          <div className="relative">
            <div className="absolute start-6 top-0 bottom-0 w-0.5 bg-sand-300" />
            <div className="space-y-8">
              {timeline.events.map((event: { year: string; title: string; description: string }, index: number) => (
                <div key={event.year} className="relative flex gap-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 z-10" style={{ backgroundColor: RAINBOW_COLORS[index % RAINBOW_COLORS.length] }}>
                    {event.year.slice(2)}
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-sand-200 flex-1">
                    <div className="text-sm text-sand-500 mb-1">{event.year}</div>
                    <h3 className="font-bold text-sand-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-sand-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* School Structure */}
      <section className="py-16 bg-sand-50">
        <Container>
          <h2 className="text-3xl font-bold text-sand-900 mb-10 text-center">{structure.heading}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {structure.levels.map((level: { name: string; grades: string; emoji: string }, index: number) => (
              <div key={level.name} className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{level.emoji}</div>
                <h3 className="font-bold text-sand-900 mb-1">{level.name}</h3>
                <p className="text-sm text-sand-500">{level.grades}</p>
                <div className="w-full h-1 rounded-full mt-4" style={{ backgroundColor: structureColors[index % structureColors.length] }} />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
