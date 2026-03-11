import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";
import { getStaffMembers } from "@/lib/cms";

export const metadata: Metadata = {
  title: "צוות",
  description: "הכירו את הצוות החינוכי של בית הספר קשת - מחנכים, מורים ואנשי מקצוע.",
};

const fallbackStaff = [
  { name: "שם המנהל/ת", role: "מנהל/ת בית הספר", bio: "מוביל/ה את החזון החינוכי של קשת מזה שנים רבות.", image_url: null },
  { name: "שם סגן/ית", role: "סגן/ית מנהל/ת", bio: "אחראי/ת על ההיבטים הפדגוגיים והחינוכיים.", image_url: null },
  { name: "שם יועץ/ת", role: "יועץ/ת חינוכי/ת", bio: "מלווה את התלמידים ברמה הרגשית והחברתית.", image_url: null },
  { name: "דבורה ביבליוביץ", role: "מורה", bio: "מורה ותיקה בקשת, תורמת לבלוג בית הספר ומלווה פרויקטים מיוחדים.", image_url: null },
];

export default async function StaffPage() {
  const dbStaff = await getStaffMembers();
  const staffMembers = dbStaff.length > 0 ? dbStaff : fallbackStaff;

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
                <div
                  className="h-48 flex items-center justify-center"
                  style={{ backgroundColor: `${RAINBOW_COLORS[index % RAINBOW_COLORS.length]}15` }}
                >
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ backgroundColor: RAINBOW_COLORS[index % RAINBOW_COLORS.length] }}
                    >
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-sand-900">{member.name}</h3>
                  <p className="text-sm font-medium mb-2" style={{ color: RAINBOW_COLORS[index % RAINBOW_COLORS.length] }}>
                    {member.role}
                  </p>
                  <p className="text-sm text-sand-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
