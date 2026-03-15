"use client";

import { useState, useEffect, FormEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { RAINBOW_COLORS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { ContactInfo } from "@/lib/types/cms";

const defaultContact: ContactInfo = {
  address: "זכרון יעקב, ישראל",
  phone: "04-XXX-XXXX",
  email: "info@keshet-school.co.il",
  hours: "ראשון-חמישי 07:30-16:00",
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contact, setContact] = useState<ContactInfo>(defaultContact);

  useEffect(() => {
    async function fetchContact() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("site_content")
          .select("content")
          .eq("page", "global")
          .eq("section", "contact_info")
          .single();
        if (error) {
          console.error("Failed to fetch contact info:", error.message);
          return;
        }
        if (data?.content) {
          setContact({ ...defaultContact, ...(data.content as ContactInfo) });
        }
      } catch (err) {
        console.error("Contact fetch error:", err);
      }
    }
    fetchContact();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Connect to API route or Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  }

  const contactItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "כתובת",
      value: contact.address,
      color: RAINBOW_COLORS[0],
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: "טלפון",
      value: contact.phone,
      color: RAINBOW_COLORS[3],
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "אימייל",
      value: contact.email,
      color: RAINBOW_COLORS[4],
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "שעות פעילות",
      value: contact.hours,
      color: RAINBOW_COLORS[6],
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-sand-50">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-900 mb-6">
              צרו קשר
            </h1>
            <p className="text-xl text-sand-600 leading-relaxed">
              נשמח לשמוע מכם! אל תהססו לפנות בכל שאלה או עניין.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-sand-900 mb-6">שלחו לנו הודעה</h2>
              {isSubmitted ? (
                <div className="bg-rainbow-green/10 rounded-2xl p-8 text-center">
                  <svg className="w-12 h-12 text-rainbow-green mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-xl font-bold text-sand-900 mb-2">ההודעה נשלחה בהצלחה!</h3>
                  <p className="text-sand-600">נחזור אליכם בהקדם.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="שם מלא" name="name" placeholder="שם מלא" required />
                    <Input label="טלפון" name="phone" type="tel" dir="ltr" placeholder="05X-XXX-XXXX" />
                  </div>
                  <Input label="אימייל" name="email" type="email" dir="auto" placeholder="example@email.com" required />
                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-1.5">נושא</label>
                    <select name="subject" className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors" required>
                      <option value="">בחרו נושא</option>
                      <option value="admissions">הרשמה</option>
                      <option value="visit">ביקור בבית הספר</option>
                      <option value="general">שאלה כללית</option>
                      <option value="other">אחר</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-1.5">הודעה</label>
                    <textarea name="message" rows={5} className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-colors resize-none" placeholder="כתבו את הודעתכם כאן..." required />
                  </div>
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "שולח..." : "שליחה"}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info & Map */}
            <div>
              <h2 className="text-2xl font-bold text-sand-900 mb-6">פרטי התקשרות</h2>
              <div className="space-y-4 mb-8">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-sand-200">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: item.color }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm text-sand-500">{item.label}</p>
                      <p className="font-medium text-sand-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              {contact.social && Object.values(contact.social).some(Boolean) && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-sand-900 mb-3">עקבו אחרינו</h3>
                  <div className="flex flex-wrap gap-3">
                    {contact.social.facebook && (
                      <a href={contact.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-80" style={{ backgroundColor: "#1877F2" }} aria-label="פייסבוק">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                    )}
                    {contact.social.instagram && (
                      <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-80" style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }} aria-label="אינסטגרם">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      </a>
                    )}
                    {contact.social.youtube && (
                      <a href={contact.social.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-80" style={{ backgroundColor: "#FF0000" }} aria-label="יוטיוב">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      </a>
                    )}
                    {contact.social.tiktok && (
                      <a href={contact.social.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-80" style={{ backgroundColor: "#000000" }} aria-label="טיקטוק">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                      </a>
                    )}
                    {contact.social.whatsapp && (
                      <a href={contact.social.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-80" style={{ backgroundColor: "#25D366" }} aria-label="וואטסאפ">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </a>
                    )}
                    {contact.social.telegram && (
                      <a href={contact.social.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-80" style={{ backgroundColor: "#0088CC" }} aria-label="טלגרם">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                      </a>
                    )}
                    {contact.social.linkedin && (
                      <a href={contact.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-80" style={{ backgroundColor: "#0A66C2" }} aria-label="לינקדאין">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    )}
                    {contact.social.twitter && (
                      <a href={contact.social.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-80" style={{ backgroundColor: "#000000" }} aria-label="X">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z"/></svg>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Map */}
              <div className="rounded-2xl overflow-hidden shadow-sm border border-sand-200 h-64">
                <iframe
                  src={contact.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13361.088559073748!2d34.94!3d32.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d3f7e8d4e7e07%3A0x6cd81c3aa14f0c0!2sZikhron%20Ya'akov!5e0!3m2!1sen!2sil!4v1"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="מפת בית הספר קשת בזכרון יעקב"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
