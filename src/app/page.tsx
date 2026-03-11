import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSpiral } from "@/components/home/HeroSpiral";
import { PhilosophySection } from "@/components/home/PhilosophySection";
import { HighlightsGrid } from "@/components/home/HighlightsGrid";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { CTABanner } from "@/components/home/CTABanner";
import { NewsPreview } from "@/components/home/NewsPreview";
import { getPageContent } from "@/lib/cms";

export default async function HomePage() {
  const content = await getPageContent("homepage");

  return (
    <>
      <Navbar />
      <main>
        <HeroSpiral />
        <PhilosophySection content={content.philosophy as { heading?: string; subheading?: string; pillars?: Array<{ title: string; description: string }> }} />
        <HighlightsGrid content={content.highlights as { heading?: string; subheading?: string; items?: Array<{ title: string; description: string; image_url: string; href: string }> }} />
        <TestimonialCarousel content={content.testimonials as { heading?: string; subheading?: string; items?: Array<{ quote: string; author: string; role: string }> }} />
        <CTABanner content={content.cta as { heading?: string; description?: string; primary_label?: string; primary_href?: string; secondary_label?: string; secondary_href?: string }} />
        <NewsPreview />
      </main>
      <Footer />
    </>
  );
}
