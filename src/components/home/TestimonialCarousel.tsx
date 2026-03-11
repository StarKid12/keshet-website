"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Container } from "@/components/ui/Container";
import { RAINBOW_COLORS } from "@/lib/constants";

const testimonials = [
  {
    quote: "בית ספר כיפי שבו לומדים דברים ואפשר להשפיע עליו",
    author: "תלמיד/ה",
    role: "תלמיד/ה בקשת",
    color: RAINBOW_COLORS[0],
  },
  {
    quote: "חופש קיים פה, ומורים שווים לתלמידים",
    author: "תלמיד/ה",
    role: "תלמיד/ה בקשת",
    color: RAINBOW_COLORS[1],
  },
  {
    quote: "בית שני, מקום שעזר לי לצמוח",
    author: "בוגר/ת",
    role: "בוגר/ת קשת",
    color: RAINBOW_COLORS[3],
  },
  {
    quote: "משפחה",
    author: "תלמיד/ה",
    role: "תלמיד/ה בקשת",
    color: RAINBOW_COLORS[4],
  },
  {
    quote: "נרניה. הצלה. המקום הכי טוב בעולם.",
    author: "תלמיד/ה",
    role: "תלמיד/ה בקשת",
    color: RAINBOW_COLORS[6],
  },
];

interface TestimonialCarouselProps {
  content?: {
    heading?: string;
    subheading?: string;
    items?: Array<{ quote: string; author: string; role: string }>;
  };
}

export function TestimonialCarousel({ content }: TestimonialCarouselProps = {}) {
  const heading = content?.heading ?? "מה אומרים עלינו";
  const subheading = content?.subheading ?? "קולות מהקהילה שלנו";
  const displayTestimonials = content?.items
    ? content.items.map((item, i) => ({
        ...item,
        color: RAINBOW_COLORS[i % RAINBOW_COLORS.length],
      }))
    : testimonials;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: "rtl", align: "center" },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <section className="py-20 rainbow-gradient-subtle">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-900 mb-4">
            {heading}
          </h2>
          <p className="text-lg text-sand-600">
            {subheading}
          </p>
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {displayTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-4"
              >
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-sand-200 h-full flex flex-col">
                  {/* Quote mark */}
                  <span
                    className="text-5xl font-serif leading-none mb-4"
                    style={{ color: testimonial.color }}
                  >
                    &ldquo;
                  </span>
                  <p className="text-lg text-sand-800 flex-1 leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="mt-6 pt-4 border-t border-sand-100">
                    <p className="font-medium text-sand-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-sand-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {displayTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-primary-500 w-6"
                  : "bg-sand-300 hover:bg-sand-400"
              }`}
              aria-label={`ציטוט ${index + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
