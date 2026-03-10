import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "צוות",
  description: "הכירו את הצוות החינוכי של בית הספר קשת - מחנכים, מורים ואנשי מקצוע.",
};

const staffMembers = [
  {
    name: "שם המנהל/ת",
    role: "מנהל/ת בית הספר",
    bio: "מוביל/ה את החזון החינוכי של קשת מזה שנים רבות.",
    image: null,
    color: RAINBOW_COLORS[0],
  },
  {
    name: "שם סגן/ית",
    role: "סגן/ית מנהל/ת",
    bio: "אחראי/ת על ההיבטים הפדגוגיים והחינוכיים.",
    image: null,
    color: RAINBOW_COLORS[1],
  },
  {
    name: "שם יועץ/ת",
    role: "יועץ/ת חינוכי/ת",
    bio: "מלווה את התלמידים ברמה הרגשית והחברתית.",
    image: null,
    color: RAINBOW_COLORS[2],
  },
  {
    name: "שם רכז/ת",
    role: "רכז/ת שכבה - יסודי",
    bio: "מרכז/ת את הפעילות החינוכית בשכבת היסודי.",
    image: null,
    color: RAINBOW_COLORS[3],
  },
  {
    name: "שם רכז/ת",
    role: "רכז/ת שכבה - חטיבה",
    bio: "מרכז/ת את הפעילות החינוכית בחטיבת הביניים.",
    image: null,
    color: RAINBOW_COLORS[4],
  },
  {
    name: "שם רכז/ת",
    role: "רכז/ת שכבה - תיכון",
    bio: "מרכז/ת את הפעילות החינוכית בתיכון.",
    image: null,
    color: RAINBOW_COLORS[5],
  },
  {
    name: "דבורה ביבליוביץ",
    role: "מורה",
    bio: "מורה ותיקה בקשת, תורמת לבלוג בית הספר ומלווה פרויקטים מיוחדים.",
    image: null,
    color: RAINBOW_COLORS[6],
  },
  {
    name: "שם מורה",
    role: "מורה למתמטיקה",
    bio: "מלמד/ת מתמטיקה בגישה חווייתית ומותאמת אישית.",
    image: null,
    color: RAINBOW_COLORS[0],
  },
];

export default function StaffPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-sand-50">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-900 mb-6">
              הצוות שלנו
            </h1>
            <p className="text-xl text-sand-600 leading-relaxed">
              צוות מסור ומקצועי שמאמין בחינוך דמוקרטי ומלווה כל תלמיד בדרכו הייחודית.
            </p>
          </div>
        </Container>
      </section>

      {/* Staff Grid */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {staffMembers.map((member, index) => (
              <div
                key={`${member.name}-${index}`}
                className="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden
                  hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Avatar placeholder */}
                <div
                  className="h-48 flex items-center justify-center"
                  style={{ backgroundColor: `${member.color}15` }}
                >
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-sand-900">{member.name}</h3>
                  <p className="text-sm font-medium mb-2" style={{ color: member.color }}>
                    {member.role}
                  </p>
                  <p className="text-sm text-sand-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-sand-500 text-sm italic">
            * דף זה מציג מידע חלקי. נשמח לעדכן עם פרטים מלאים של כל חברי הצוות.
          </p>
        </Container>
      </section>
    </>
  );
}
