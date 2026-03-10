"use client";

import Link from "next/link";
import { RAINBOW_COLORS } from "@/lib/constants";

const adminLinks = [
  {
    title: "ניהול משתמשים",
    description: "אישור הרשמות, הקצאת תפקידים ושיוך לכיתות",
    href: "/admin/users",
    icon: "👥",
    color: RAINBOW_COLORS[0],
  },
  {
    title: "רשימת מיילים מאושרים",
    description: "ניהול כתובות מייל שמורשות להירשם",
    href: "/admin/approved-emails",
    icon: "📧",
    color: RAINBOW_COLORS[1],
  },
  {
    title: "ניהול בלוג",
    description: "כתיבה, עריכה ופרסום כתבות בבלוג",
    href: "/admin/blog",
    icon: "✍️",
    color: RAINBOW_COLORS[3],
  },
  {
    title: "ניהול תמונות",
    description: "יצירת אלבומים והעלאת תמונות כיתה",
    href: "/admin/photos",
    icon: "📸",
    color: RAINBOW_COLORS[4],
  },
  {
    title: "מערכת שעות",
    description: "עריכת מערכת השעות לכל כיתה",
    href: "/admin/schedule",
    icon: "📅",
    color: RAINBOW_COLORS[5],
  },
  {
    title: "הודעות",
    description: "שליחת הכרזות לכיתות או לכלל בית הספר",
    href: "/admin/messages",
    icon: "📢",
    color: RAINBOW_COLORS[6],
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">לוח ניהול</h1>
        <p className="text-sand-500 mt-1">ניהול תוכן ומשתמשי בית הספר</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200
              hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <span className="text-3xl mb-4 block">{link.icon}</span>
            <h2 className="text-lg font-bold text-sand-900 mb-1">{link.title}</h2>
            <p className="text-sm text-sand-500">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
