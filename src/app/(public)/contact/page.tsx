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

              {/* Map */}
              <div className="rounded-2xl overflow-hidden shadow-sm border border-sand-200 h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13361.088559073748!2d34.94!3d32.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d3f7e8d4e7e07%3A0x6cd81c3aa14f0c0!2sZikhron%20Ya&#39;akov!5e0!3m2!1sen!2sil!4v1"
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
