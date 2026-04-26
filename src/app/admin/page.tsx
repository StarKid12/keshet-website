"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { RAINBOW_COLORS } from "@/lib/constants";

interface Stats {
  blogPosts: number;
  events: number;
}

const adminLinks = [
  {
    title: "ניהול תוכן",
    description: "עריכת טקסטים, תמונות וצוות בעמודי האתר",
    href: "/admin/content",
    icon: "📝",
    color: RAINBOW_COLORS[1], // orange
    statKey: null,
  },
  {
    title: "ניהול בלוג",
    description: "כתיבה, עריכה ופרסום כתבות בבלוג",
    href: "/admin/blog",
    icon: "✍️",
    color: RAINBOW_COLORS[3], // green
    statKey: "blogPosts" as keyof Stats,
  },
  {
    title: "ניהול אירועים",
    description: "יצירה ועריכה של אירועים בלוח השנה",
    href: "/admin/events",
    icon: "📅",
    color: RAINBOW_COLORS[4], // blue
    statKey: "events" as keyof Stats,
  },
  {
    title: "מנהלים",
    description: "הוספה והסרה של מנהלים והזמנת אימיילים חדשים",
    href: "/admin/admins",
    icon: "👥",
    color: RAINBOW_COLORS[6], // violet
    statKey: null,
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ blogPosts: 0, events: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      const [blogRes, eventsRes] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        blogPosts: blogRes.count || 0,
        events: eventsRes.count || 0,
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
        <p className="text-sand-500 mt-1">ניהול תוכן האתר</p>
      </div>

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
