// ============================================
// CMS Content Types
// ============================================

// --- Global ---
export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
  fax?: string;
  social?: {
    facebook?: string;
    instagram?: string;
  };
}

// --- Homepage ---
export interface HeroContent {
  title: string;
  subtitle: string;
  tagline: string;
  words: string[];
  cta_primary: string;
  cta_secondary: string;
}

export interface PhilosophyContent {
  heading: string;
  subheading: string;
  pillars: Array<{
    title: string;
    description: string;
  }>;
}

export interface HighlightsContent {
  heading: string;
  subheading: string;
  items: Array<{
    title: string;
    description: string;
    image_url: string;
    href: string;
  }>;
}

export interface TestimonialsContent {
  heading: string;
  subheading: string;
  items: Array<{
    quote: string;
    author: string;
    role: string;
  }>;
}

export interface CTAContent {
  heading: string;
  description: string;
  cta_primary: string;
  cta_primary_href: string;
  cta_secondary: string;
  cta_secondary_href: string;
}

// --- About ---
export interface VisionContent {
  heading: string;
  paragraphs: string[];
  image_url?: string;
}

export interface ValuesContent {
  heading: string;
  items: Array<{
    title: string;
    description: string;
  }>;
}

export interface DemocracyContent {
  heading: string;
  paragraphs: string[];
  bullets: string[];
  image_url?: string;
}

export interface PluralismContent {
  heading: string;
  description: string;
  items: Array<{
    title: string;
    description: string;
  }>;
}

export interface TimelineContent {
  heading: string;
  events: Array<{
    year: string;
    title: string;
    description: string;
  }>;
}

export interface StructureContent {
  heading: string;
  levels: Array<{
    name: string;
    grades: string;
    emoji: string;
  }>;
}

// --- Academics ---
export interface ProgramsContent {
  items: Array<{
    title: string;
    ages: string;
    description: string;
    highlights: string[];
    image_url: string;
  }>;
}

export interface ApproachesContent {
  heading: string;
  description: string;
  items: Array<{
    title: string;
    description: string;
  }>;
}

export interface ScheduleContent {
  heading: string;
  slots: Array<{
    time: string;
    activity: string;
  }>;
}

// --- Admissions ---
export interface StepsContent {
  heading: string;
  items: Array<{
    number: string;
    title: string;
    description: string;
  }>;
}

export interface OpenDayContent {
  label: string;
  heading: string;
  description: string;
}

export interface FAQContent {
  heading: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

// --- Community ---
export interface CommunityEventsContent {
  heading: string;
  items: Array<{
    title: string;
    description: string;
    image_url: string;
  }>;
}

export interface CommunityTestimonialsContent {
  heading: string;
  items: Array<{
    quote: string;
  }>;
}

// --- Staff Member (DB row) ---
export interface StaffMember {
  id: string;
  name: string;
  role: string;
  category: string;
  bio: string | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// --- Site Content (DB row) ---
export interface SiteContentRow {
  id: string;
  page: string;
  section: string;
  content: Record<string, unknown>;
  sort_order: number;
  updated_at: string;
  updated_by: string | null;
}

// --- Hero content for page headers ---
export interface PageHeroContent {
  title: string;
  description: string;
}
