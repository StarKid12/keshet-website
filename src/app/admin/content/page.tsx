"use client";

import Link from "next/link";
import { RAINBOW_COLORS } from "@/lib/constants";

const contentPages = [
  {
    label: "פרטי קשר",
    href: "/admin/content/contact",
    icon: "📞",
    description: "כתובת, טלפון, אימייל, שעות פעילות",
    color: RAINBOW_COLORS[0],
  },
  {
    label: "צוות",
    href: "/admin/content/staff",
    icon: "👩‍🏫",
    description: "שמות, תפקידים, תיאורים ותמונות צוות",
    color: RAINBOW_COLORS[1],
  },
  {
    label: "דף ראשי",
    href: "/admin/content/homepage",
    icon: "🏠",
    description: "כותרות, פילוסופיה, הדגשים, ציטוטים",
    color: RAINBOW_COLORS[2],
  },
  {
    label: "אודות",
    href: "/admin/content/about",
    icon: "📖",
    description: "חזון, ערכים, ציר זמנים, מבנה בית הספר",
    color: RAINBOW_COLORS[3],
  },
  {
    label: "לימודים",
    href: "/admin/content/academics",
    icon: "📚",
    description: "תכניות לימוד, גישות חינוכיות, מערכת שעות",
    color: RAINBOW_COLORS[4],
  },
  {
    label: "הרשמה",
    href: "/admin/content/admissions",
    icon: "📋",
    description: "תהליך הרשמה, שאלות נפוצות, יום פתוח",
    color: RAINBOW_COLORS[5],
  },
  {
    label: "חיים בקשת",
    href: "/admin/content/community",
    icon: "🎉",
    description: "אירועי קהילה, ציטוטים של תלמידים",
    color: RAINBOW_COLORS[6],
  },
  {
    label: "הצהרת נגישות",
    href: "/admin/content/accessibility",
    icon: "♿",
    description: "טקסטים ופרטי קשר בעמוד הצהרת הנגישות",
    color: RAINBOW_COLORS[4],
  },
];

export default function ContentOverviewPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">
          ניהול תוכן
        </h1>
        <p className="text-sand-500 mt-1">
          עריכת התכנים בעמודי האתר - טקסטים, תמונות ופרטים
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="bg-white rounded-2xl p-5 shadow-sm border border-sand-200 hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: `${page.color}15` }}
              >
                {page.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sand-900 group-hover:text-primary-600 transition-colors">
                  {page.label}
                </h3>
                <p className="text-sm text-sand-500 mt-0.5">
                  {page.description}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-sand-300 group-hover:text-primary-400 transition-colors shrink-0 mt-1 -scale-x-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
