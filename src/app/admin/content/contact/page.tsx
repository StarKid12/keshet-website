"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { ContentSection } from "@/components/admin/ContentSection";
import { SaveButton } from "@/components/admin/SaveButton";
import Link from "next/link";
import type { ContactInfo } from "@/lib/types/cms";

const defaultContact: ContactInfo = {
  address: "זכרון יעקב, ישראל",
  phone: "04-XXX-XXXX",
  email: "info@keshet-school.co.il",
  hours: "ראשון-חמישי 07:30-16:00",
  social: { facebook: "", instagram: "" },
};

export default function ContactContentPage() {
  const [contact, setContact] = useState<ContactInfo>(defaultContact);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    const supabase = createClient();
    const { data } = await supabase
      .from("site_content")
      .select("content")
      .eq("page", "global")
      .eq("section", "contact_info")
      .single();

    if (data?.content) {
      setContact({ ...defaultContact, ...(data.content as ContactInfo) });
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    setSuccess(null);
    const supabase = createClient();

    const { error } = await supabase.from("site_content").upsert(
      {
        page: "global",
        section: "contact_info",
        content: contact,
      },
      { onConflict: "page,section" }
    );

    if (!error) {
      await fetch("/api/revalidate", { method: "POST" });
      setSuccess("נשמר בהצלחה!");
      setTimeout(() => setSuccess(null), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-sand-200 rounded-xl h-16" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/content"
          className="w-8 h-8 rounded-lg bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
        >
          <svg className="w-4 h-4 text-sand-600 -scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">
            פרטי קשר
          </h1>
          <p className="text-sand-500 mt-0.5 text-sm">
            פרטים שמופיעים בדף צור קשר ובתחתית האתר
          </p>
        </div>
      </div>

      <div className="space-y-4 max-w-2xl">
        <ContentSection title="פרטי התקשרות">
          <Input
            label="כתובת"
            value={contact.address}
            onChange={(e) => setContact({ ...contact, address: e.target.value })}
            placeholder="כתובת מלאה"
          />
          <Input
            label="טלפון"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            placeholder="04-XXX-XXXX"
            dir="ltr"
          />
          <Input
            label="אימייל"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            placeholder="info@keshet-school.co.il"
            dir="ltr"
          />
          <Input
            label="שעות פעילות"
            value={contact.hours}
            onChange={(e) => setContact({ ...contact, hours: e.target.value })}
            placeholder="ראשון-חמישי 07:30-16:00"
          />
        </ContentSection>

        <ContentSection title="מפה" defaultOpen={false}>
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">
              הדביקו את קוד ההטמעה מגוגל מפות
            </label>
            <textarea
              value={contact.map_embed_url || ""}
              onChange={(e) => {
                let value = e.target.value.trim();
                // Extract src URL if user pasted full iframe tag
                const srcMatch = value.match(/src=["']([^"']+)["']/);
                if (srcMatch) value = srcMatch[1];
                // Decode HTML entities (e.g. &#39; → ')
                value = value.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
                value = value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
                setContact({ ...contact, map_embed_url: value });
              }}
              rows={3}
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 text-xs font-mono placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-y"
              placeholder='הדביקו כאן את כל קוד ה-iframe מגוגל מפות, או רק את הקישור'
            />
          </div>
          <p className="text-xs text-sand-400 mt-1">
            העתיקו את כל הקוד והדביקו כאן &larr; הטמעת מפה &larr; שיתוף &larr; גוגל מפות
          </p>
          {contact.map_embed_url && (
            <div className="rounded-xl overflow-hidden border border-sand-200 h-48 mt-3">
              <iframe
                src={contact.map_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="תצוגה מקדימה של המפה"
              />
            </div>
          )}
        </ContentSection>

        <ContentSection title="רשתות חברתיות" defaultOpen={false}>
          <Input
            label="פייסבוק"
            value={contact.social?.facebook || ""}
            onChange={(e) =>
              setContact({
                ...contact,
                social: { ...contact.social, facebook: e.target.value },
              })
            }
            placeholder="https://facebook.com/..."
            dir="ltr"
          />
          <Input
            label="אינסטגרם"
            value={contact.social?.instagram || ""}
            onChange={(e) =>
              setContact({
                ...contact,
                social: { ...contact.social, instagram: e.target.value },
              })
            }
            placeholder="https://instagram.com/..."
            dir="ltr"
          />
          <Input
            label="יוטיוב"
            value={contact.social?.youtube || ""}
            onChange={(e) =>
              setContact({
                ...contact,
                social: { ...contact.social, youtube: e.target.value },
              })
            }
            placeholder="https://youtube.com/..."
            dir="ltr"
          />
          <Input
            label="טיקטוק"
            value={contact.social?.tiktok || ""}
            onChange={(e) =>
              setContact({
                ...contact,
                social: { ...contact.social, tiktok: e.target.value },
              })
            }
            placeholder="https://tiktok.com/@..."
            dir="ltr"
          />
          <Input
            label="וואטסאפ"
            value={contact.social?.whatsapp || ""}
            onChange={(e) =>
              setContact({
                ...contact,
                social: { ...contact.social, whatsapp: e.target.value },
              })
            }
            placeholder="https://wa.me/972..."
            dir="ltr"
          />
          <Input
            label="טלגרם"
            value={contact.social?.telegram || ""}
            onChange={(e) =>
              setContact({
                ...contact,
                social: { ...contact.social, telegram: e.target.value },
              })
            }
            placeholder="https://t.me/..."
            dir="ltr"
          />
          <Input
            label="לינקדאין"
            value={contact.social?.linkedin || ""}
            onChange={(e) =>
              setContact({
                ...contact,
                social: { ...contact.social, linkedin: e.target.value },
              })
            }
            placeholder="https://linkedin.com/..."
            dir="ltr"
          />
          <Input
            label="X (טוויטר)"
            value={contact.social?.twitter || ""}
            onChange={(e) =>
              setContact({
                ...contact,
                social: { ...contact.social, twitter: e.target.value },
              })
            }
            placeholder="https://x.com/..."
            dir="ltr"
          />
        </ContentSection>

        <SaveButton saving={saving} onClick={handleSave} successMessage={success} />
      </div>
    </div>
  );
}
