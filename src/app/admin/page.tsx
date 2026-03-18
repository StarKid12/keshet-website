"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { RAINBOW_COLORS } from "@/lib/constants";

interface Stats {
  totalUsers: number;
  pendingUsers: number;
  approvedEmails: number;
  blogPosts: number;
  messages: number;
}

const adminLinks = [
  {
    title: "ניהול משתמשים",
    description: "אישור הרשמות, הקצאת תפקידים ושיוך לכיתות",
    href: "/admin/users",
    icon: "👥",
    color: RAINBOW_COLORS[1],
    statKey: "totalUsers" as keyof Stats,
  },
  {
    title: "מיילים מאושרים",
    description: "ניהול כתובות מייל שמורשות להירשם",
    href: "/admin/approved-emails",
    icon: "📧",
    color: RAINBOW_COLORS[2],
    statKey: "approvedEmails" as keyof Stats,
  },
  {
    title: "ניהול בלוג",
    description: "כתיבה, עריכה ופרסום כתבות בבלוג",
    href: "/admin/blog",
    icon: "✍️",
    color: RAINBOW_COLORS[3],
    statKey: "blogPosts" as keyof Stats,
  },
  {
    title: "ניהול אירועים",
    description: "יצירה ועריכה של אירועים בלוח השנה",
    href: "/admin/events",
    icon: "📅",
    color: RAINBOW_COLORS[4],
    statKey: null,
  },
  {
    title: "הודעות",
    description: "שליחת הכרזות לכלל בית הספר",
    href: "/admin/messages",
    icon: "📢",
    color: RAINBOW_COLORS[6],
    statKey: "messages" as keyof Stats,
  },
  {
    title: "מערכת שעות",
    description: "הוספת שיעורים שתלמידים יוכלו לבחור מתוכם",
    href: "/admin/timetable",
    icon: "🕐",
    color: RAINBOW_COLORS[2],
    statKey: null,
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    pendingUsers: 0,
    approvedEmails: 0,
    blogPosts: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      const [usersRes, pendingRes, emailsRes, blogRes, msgRes] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .eq("is_approved", false),
          supabase
            .from("approved_emails")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("blog_posts")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("messages")
            .select("id", { count: "exact", head: true }),
        ]);

      setStats({
        totalUsers: usersRes.count || 0,
        pendingUsers: pendingRes.count || 0,
        approvedEmails: emailsRes.count || 0,
        blogPosts: blogRes.count || 0,
        messages: msgRes.count || 0,
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">
          סקירה כללית
        </h1>
        <p className="text-sand-500 mt-1">ניהול תוכן ומשתמשי בית הספר</p>
      </div>

      {/* Pending users alert */}
      {stats.pendingUsers > 0 && (
        <Link
          href="/admin/users"
          className="flex items-center gap-4 bg-gradient-to-l from-rainbow-orange/10 to-rainbow-red/10 border border-rainbow-orange/20 rounded-2xl p-5 mb-8 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-rainbow-orange/20 flex items-center justify-center text-2xl shrink-0">
            ⏳
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sand-900">
              {stats.pendingUsers} משתמשים ממתינים לאישור
            </h3>
            <p className="text-sm text-sand-600">
              לחצו כאן כדי לאשר או לדחות הרשמות חדשות
            </p>
          </div>
          <svg
            className="w-5 h-5 text-sand-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "משתמשים",
            value: stats.totalUsers,
            color: RAINBOW_COLORS[1],
            icon: "👥",
          },
          {
            label: "מיילים מאושרים",
            value: stats.approvedEmails,
            color: RAINBOW_COLORS[2],
            icon: "📧",
          },
          {
            label: "פוסטים בבלוג",
            value: stats.blogPosts,
            color: RAINBOW_COLORS[3],
            icon: "✍️",
          },
          {
            label: "הודעות",
            value: stats.messages,
            color: RAINBOW_COLORS[6],
            icon: "📢",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-sand-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-sm text-sand-500">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold" style={{ color: stat.color }}>
              {loading ? (
                <div className="animate-pulse bg-sand-200 rounded h-9 w-12" />
              ) : (
                stat.value
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Admin links */}
      <h2 className="text-lg font-bold text-sand-900 mb-4">ניהול</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-2xl p-5 shadow-sm border border-sand-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: `${link.color}15` }}
              >
                {link.icon}
              </div>
              <h3 className="font-bold text-sand-900">{link.title}</h3>
            </div>
            <p className="text-sm text-sand-500 mb-3">{link.description}</p>
            <div
              className="text-xs font-medium px-2.5 py-1 rounded-full inline-block"
              style={{
                backgroundColor: `${link.color}10`,
                color: link.color,
              }}
            >
              {link.statKey && !loading
                ? `${stats[link.statKey]} רשומות`
                : "ניהול →"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
