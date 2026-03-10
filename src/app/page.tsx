import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSpiral } from "@/components/home/HeroSpiral";
import { PhilosophySection } from "@/components/home/PhilosophySection";
import { HighlightsGrid } from "@/components/home/HighlightsGrid";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { CTABanner } from "@/components/home/CTABanner";
import { NewsPreview } from "@/components/home/NewsPreview";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSpiral />
        <PhilosophySection />
        <HighlightsGrid />
        <TestimonialCarousel />
        <CTABanner />
        <NewsPreview />
      </main>
      <Footer />
    </>
  );
}
