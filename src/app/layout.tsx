import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "קשת - בית הספר הדמוקרטי יהודי-פלורליסטי | זכרון יעקב",
    template: "%s | קשת",
  },
  description:
    "בית הספר הדמוקרטי יהודי-פלורליסטי קשת בזכרון יעקב. חינוך דמוקרטי, פלורליסטי וקהילתי מגן עד י״ב.",
  keywords: [
    "קשת",
    "בית ספר דמוקרטי",
    "זכרון יעקב",
    "חינוך פלורליסטי",
    "חינוך יהודי",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-[family-name:var(--font-heebo)] antialiased">
        {children}
      </body>
    </html>
  );
}
