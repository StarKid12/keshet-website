import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";
import { getPageContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "קישורים שימושיים",
  description: "קישורים שימושיים לתלמידי בית הספר קשת — סביבות למידה, פורטלים ושירותים.",
};

interface LinkItem {
  title: string;
  url: string;
  description?: string;
  icon?: string;
}

const defaults = {
  hero: {
    title: "קישורים שימושיים",
    description: "כל מה שצריך, במקום אחד. קישורים לסביבות למידה, פורטלים ומידע נוסף.",
  },
  items: {
    items: [
      {
        title: "סביבות למידה בענן",
        url: "https://www.edu-haifa.org.il/סביבות-למידה-בענן",
        description: "פורטל סביבות הלמידה של עיריית חיפה.",
        icon: "☁️",
      },
    ] as LinkItem[],
  },
};

export default async function LinksPage() {
  const content = await getPageContent("links");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (key: keyof typeof defaults) => ({ ...defaults[key], ...(content[key] as any) });

  const hero = c("hero");
  const items: LinkItem[] = c("items").items ?? defaults.items.items;

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
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔗</div>
              <p className="text-sand-500">בקרוב יתפרסמו קישורים חדשים.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((link, index) => {
                const color = RAINBOW_COLORS[index % RAINBOW_COLORS.length];
                return (
                  <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-sand-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      {link.icon || "🔗"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sand-900 group-hover:text-primary-600 transition-colors">
                        {link.title}
                      </h3>
                      {link.description && (
                        <p className="text-sm text-sand-500 mt-0.5">
                          {link.description}
                        </p>
                      )}
                    </div>
                    <svg
                      className="w-5 h-5 text-sand-300 group-hover:text-primary-400 transition-colors shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
