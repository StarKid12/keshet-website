import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE_FULL_NAME, SITE_LOCATION, NAV_ITEMS } from "@/lib/constants";
import { getGlobalContent } from "@/lib/cms";
import type { ContactInfo } from "@/lib/types/cms";

const defaultContact: ContactInfo = {
  address: "זכרון יעקב, ישראל",
  phone: "04-XXX-XXXX",
  email: "info@keshet-school.co.il",
  hours: "ראשון-חמישי 07:30-16:00",
};

export async function Footer() {
  const global = await getGlobalContent();
  const contact: ContactInfo = { ...defaultContact, ...(global.contact_info as unknown as ContactInfo) };

  return (
    <footer className="bg-sand-900 text-sand-300">
      <div className="rainbow-divider" />
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* School Info */}
          <div>
            <img src="/images/logo.png" alt="קשת" className="h-12 mb-3" />
            <p className="text-sand-400 text-sm leading-relaxed">
              {SITE_FULL_NAME}
              <br />
              {SITE_LOCATION}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              ניווט מהיר
            </h4>
            <ul className="space-y-2">
              {NAV_ITEMS.slice(1).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-sand-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              צרו קשר
            </h4>
            <ul className="space-y-2 text-sm text-sand-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{contact.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span dir="ltr">{contact.phone}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-sand-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-sand-500">
          <p>© {new Date().getFullYear()} {SITE_FULL_NAME}. כל הזכויות שמורות.</p>
          <Link href="/accessibility" className="hover:text-white transition-colors">
            הצהרת נגישות
          </Link>
        </div>
      </Container>
    </footer>
  );
}
