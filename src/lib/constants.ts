export const SITE_NAME = "קשת";
export const SITE_FULL_NAME = "בית הספר הדמוקרטי יהודי-פלורליסטי קשת";
export const SITE_LOCATION = "זכרון יעקב";

export const NAV_ITEMS = [
  { label: "ראשי", href: "/" },
  { label: "אודות", href: "/about" },
  { label: "לימודים", href: "/academics" },
  { label: "צוות", href: "/staff" },
  { label: "הרשמה", href: "/admissions" },
  { label: "הדמוקרטיה בקשת", href: "/democracy" },
  { label: "חיים בקשת", href: "/community" },
  { label: "אירועים", href: "/events" },
  { label: "בלוג", href: "/blog" },
  { label: "צור קשר", href: "/contact" },
] as const;

export const PRIVATE_NAV_ITEMS = [
  { label: "לוח בקרה", href: "/dashboard", icon: "home" },
  { label: "תמונות כיתה", href: "/photos", icon: "camera" },
  { label: "מערכת שעות", href: "/schedule", icon: "calendar" },
  { label: "הודעות", href: "/messages", icon: "mail" },
  { label: "צ׳אט כיתתי", href: "/chat", icon: "chat" },
] as const;

export const DAYS_OF_WEEK_HE = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
] as const;

export const GRADE_LEVELS = [
  { value: 0, label: "גן" },
  { value: 1, label: "כיתה א׳" },
  { value: 2, label: "כיתה ב׳" },
  { value: 3, label: "כיתה ג׳" },
  { value: 4, label: "כיתה ד׳" },
  { value: 5, label: "כיתה ה׳" },
  { value: 6, label: "כיתה ו׳" },
  { value: 7, label: "כיתה ז׳" },
  { value: 8, label: "כיתה ח׳" },
  { value: 9, label: "כיתה ט׳" },
  { value: 10, label: "כיתה י׳" },
  { value: 11, label: "כיתה י״א" },
  { value: 12, label: "כיתה י״ב" },
] as const;

export const RAINBOW_COLORS = [
  "#e74c3c", // red
  "#f39c12", // orange
  "#f1c40f", // yellow
  "#27ae60", // green
  "#2980b9", // blue
  "#5b4dbd", // indigo
  "#8e44ad", // violet
] as const;
