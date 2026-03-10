"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80",
    alt: "תלמידים בכיתה",
  },
  {
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1920&q=80",
    alt: "פעילות בחצר בית הספר",
  },
  {
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&q=80",
    alt: "למידה משותפת",
  },
  {
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1920&q=80",
    alt: "יצירה ואמנות",
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: "rtl" },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
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
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Carousel */}
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative h-full"
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 leading-tight">
            <span className="rainbow-gradient bg-clip-text text-transparent">
              קשת
            </span>
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-light mb-3 text-white/90">
            בית הספר הדמוקרטי יהודי-פלורליסטי
          </p>
          <p className="text-lg sm:text-xl text-white/70 mb-8">
            זכרון יעקב
          </p>
          <p className="text-base sm:text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            חינוך שמאמין בילד, בקהילה ובדמוקרטיה.
            <br />
            מרחב צמיחה מגן ועד י&quot;ב.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about">
              <Button size="lg" className="text-lg px-8">
                הכירו אותנו
              </Button>
            </Link>
            <Link href="/admissions">
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white/10">
                הרשמה
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`שקופית ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
