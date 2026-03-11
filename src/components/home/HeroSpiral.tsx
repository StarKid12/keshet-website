"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export function HeroSpiral() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const swirlRef = useRef<SVGSVGElement>(null);
  const wordContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const swirl = swirlRef.current;
    const wordContainer = wordContainerRef.current;
    const logo = logoRef.current;
    const cta = ctaRef.current;
    if (!wrapper || !swirl || !wordContainer || !logo || !cta) return;

    const words = wordContainer.querySelectorAll<HTMLElement>(".cycle-word");
    const firstWord = wordContainer.querySelector<HTMLElement>(".first-word");

    const mm = gsap.matchMedia();

    mm.add("(min-height: 400px)", () => {
      // Initial states - start at moderate size, centered
      gsap.set(swirl, {
        rotate: "-30deg",
        scale: 2,
        transformOrigin: "center center",
        opacity: 1,
      });
      gsap.set(logo, { opacity: 0, scale: 0.7, y: 60 });
      gsap.set(cta, { opacity: 0, y: 40 });
      words.forEach((w) => gsap.set(w, { opacity: 0 }));
      if (firstWord) gsap.set(firstWord, { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "+=1500",
          pin: true,
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Spiral expands outward + rotates (like Kehillah)
      tl.to(
        swirl,
        {
          scale: 25,
          rotate: "-480deg",
          opacity: 0,
          duration: 0.5,
          ease: "power1.in",
        },
        0
      );

      // Phase 1b: First word ("קשת") fades away
      if (firstWord) {
        tl.to(firstWord, { opacity: 0, y: -50, duration: 0.12 }, 0.02);
      }

      // Phase 2: Value words cycle in and out (during spiral)
      const wordGap = 0.05;
      words.forEach((w, i) => {
        const start = 0.08 + i * wordGap;
        tl.to(w, { opacity: 1, duration: 0.015 }, start);
        tl.to(w, { opacity: 0, y: -25, duration: 0.02 }, start + wordGap * 0.65);
      });

      // Phase 3: Logo + school info reveals
      tl.to(
        logo,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.25,
          ease: "power3.out",
        },
        0.52
      );

      // Phase 4: CTA buttons appear
      tl.to(
        cta,
        {
          opacity: 1,
          y: 0,
          duration: 0.15,
          ease: "power2.out",
        },
        0.75
      );

      return () => {
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const cycleWords = [
    "קהילה",
    "דמוקרטיה",
    "פלורליזם",
    "חופש",
    "שייכות",
    "יצירה",
    "צמיחה",
    "משפחה",
  ];

  return (
    <section
      ref={wrapperRef}
      className="relative h-screen w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #1a1a3e 0%, #0d1b2a 60%, #0a0a1a 100%)",
      }}
    >
      {/* Subtle star-like dots background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20px 30px, white, transparent), radial-gradient(1px 1px at 40px 70px, white, transparent), radial-gradient(1px 1px at 50px 160px, white, transparent), radial-gradient(1px 1px at 90px 40px, white, transparent), radial-gradient(1px 1px at 130px 80px, white, transparent), radial-gradient(1px 1px at 160px 30px, white, transparent)",
          backgroundSize: "200px 200px",
        }}
      />

      {/* === RAINBOW SWIRL SVG === */}
      <svg
        ref={swirlRef}
        className="pointer-events-none"
        width="400"
        height="400"
        viewBox="0 0 400 400"
        fill="none"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: "-200px",
          marginLeft: "-200px",
          willChange: "transform, opacity",
        }}
      >
        <path
          d="M200 200 C210 130 270 45 340 75 C410 105 385 210 335 245 C285 280 230 235 200 200Z"
          fill="#e74c3c"
        />
        <path
          d="M200 200 C260 175 365 180 370 255 C375 330 295 380 230 345 C165 310 165 245 200 200Z"
          fill="#f39c12"
        />
        <path
          d="M200 200 C235 260 215 365 140 375 C65 385 15 310 40 240 C65 170 160 165 200 200Z"
          fill="#f1c40f"
        />
        <path
          d="M200 200 C150 250 50 250 30 175 C10 100 85 30 160 40 C235 50 225 150 200 200Z"
          fill="#27ae60"
        />
        <path
          d="M200 200 C165 140 105 50 175 15 C245 -20 330 45 335 125 C340 205 250 210 200 200Z"
          fill="#2980b9"
        />
        <path
          d="M200 200 C220 165 270 135 295 160 C320 185 295 235 265 250 C235 265 210 235 200 200Z"
          fill="#5b4dbd"
          opacity="0.9"
        />
        <path
          d="M200 200 C180 170 145 135 125 158 C105 180 130 225 155 238 C180 250 200 225 200 200Z"
          fill="#8e44ad"
          opacity="0.9"
        />
      </svg>

      {/* === CYCLING TEXT (during spiral phase) === */}
      <div
        ref={wordContainerRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      >
        <span className="first-word absolute text-6xl sm:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl">
          קשת
        </span>
        {cycleWords.map((word) => (
          <span
            key={word}
            className="cycle-word absolute text-4xl sm:text-5xl lg:text-6xl font-bold text-white/90 drop-shadow-lg opacity-0"
          >
            {word}
          </span>
        ))}
      </div>

      {/* === LOGO + CONTENT (revealed after spiral) === */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div ref={logoRef} className="text-center px-4 opacity-0">
          {/* School logo */}
          <div className="mb-6">
            <img
              src="/images/logo-circle.png"
              alt="לוגו קשת"
              className="h-40 sm:h-52 lg:h-64 mx-auto rounded-full"
              style={{ filter: "drop-shadow(0 0 30px rgba(255,255,255,0.2))" }}
            />
          </div>

          <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/85 mb-2">
            בית הספר הדמוקרטי יהודי-פלורליסטי
          </p>
          <p className="text-lg sm:text-xl text-white/50">זכרון יעקב</p>

          {/* Rainbow divider */}
          <div className="rainbow-divider w-40 sm:w-56 lg:w-64 mx-auto mt-8 rounded-full" />

          <p className="text-base sm:text-lg text-white/60 mt-8 max-w-lg mx-auto leading-relaxed">
            חינוך שמאמין בילד, בקהילה ובדמוקרטיה.
            <br />
            מרחב צמיחה מגן ועד י&quot;ב.
          </p>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4 mt-10 opacity-0 w-full max-w-sm sm:max-w-none mx-auto sm:mx-0">
          <Link href="/about" className="w-full sm:w-auto">
            <Button size="lg" className="text-lg px-10 py-3 w-full sm:w-auto">
              הכירו אותנו
            </Button>
          </Link>
          <Link href="/admissions" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-3 w-full sm:w-auto border-white/50 text-white hover:bg-white/10"
            >
              הרשמה
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 flex flex-col items-center gap-2 text-white/25 z-10" style={{ left: "50%", transform: "translateX(-50%)" }}>
        <span className="text-xs tracking-widest uppercase">גללו למטה</span>
        <div className="w-5 h-9 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2.5 bg-white/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
