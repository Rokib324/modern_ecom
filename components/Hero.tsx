"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id: string;
  src: string;
  alt: string;
  heading: string;
  ctaLabel: string;
  ctaHref: string;
  active: boolean;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    src: "/images/folded_cloths.jpg",
    alt: "Stacked folded garments with floral and gingham prints",
    heading: "New shapes, fresh prints, instant favourites.",
    ctaLabel: "SHOP NEW IN",
    ctaHref: "/products?category=new",
    active: true,
  },
  {
    id: "slide-2",
    src: "/images/homepagemodel.jpg",
    alt: "Model wearing new season styles",
    heading: "Effortless style, beautifully made.",
    ctaLabel: "SHOP WOMENS",
    ctaHref: "/products?category=womens",
    active: true,
  },
];

/** SVG circular progress ring */
function ProgressRing({ progress }: { progress: number }) {
  const radius = 11;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg width="30" height="30" viewBox="0 0 30 30" className="rotate-[-90deg]">
      {/* Track */}
      <circle cx="15" cy="15" r={radius} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      {/* Progress arc */}
      <circle
        cx="15" cy="15" r={radius} fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.1s linear" }}
      />
      {/* Centre dot */}
      <circle cx="15" cy="15" r="2.5" fill="white" className="rotate-90 origin-center" />
    </svg>
  );
}

export default function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [slideDuration, setSlideDuration] = useState(6000);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Fetch CMS data
  useEffect(() => {
    fetch("/api/site-content?section=hero")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const activeSlides = (json.data.slides ?? []).filter((s: HeroSlide) => s.active);
          if (activeSlides.length > 0) setSlides(activeSlides);
          if (json.data.slideDuration) setSlideDuration(json.data.slideDuration);
        }
      })
      .catch(() => {/* keep defaults */});
  }, []);

  // Reset index when slides change
  useEffect(() => {
    setCurrent(0);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [slides]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, goTo, slides.length]
  );

  // Tick progress
  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / slideDuration, 1);
      setProgress(p);
      if (p >= 1) {
        next();
      }
    };
    intervalRef.current = setInterval(tick, 50);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next, slideDuration]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full h-screen min-h-[640px] overflow-hidden bg-black">
      {/* ── Slides ── */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Subtle dark vignette so text and navbar are legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/40" />
        </div>
      ))}

      {/* ── Centre overlay: heading + CTA ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-4 text-center pt-16"
        style={{ zIndex: 2 }}
      >
        <p
          className="text-white text-lg sm:text-xl md:text-2xl leading-snug max-w-md"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, letterSpacing: "0.02em" }}
        >
          {slides[current].heading}
        </p>
        <Link
          href={slides[current].ctaHref}
          className="bg-white text-[#3b2a25] text-[11px] tracking-[0.25em] font-semibold px-8 py-3 hover:bg-[#f2b8a0] transition-colors duration-200"
          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
        >
          {slides[current].ctaLabel}
        </Link>
      </div>

      {/* ── Bottom-centre slider controls ── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4"
        style={{ zIndex: 3 }}
      >
        <button onClick={prev} aria-label="Previous slide" className="text-white/70 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <button onClick={next} aria-label="Next slide" className="hover:opacity-80 transition-opacity" title="Next slide">
          <ProgressRing progress={progress} />
        </button>

        <button onClick={next} aria-label="Next slide" className="text-white/70 hover:text-white transition-colors">
          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Slide index dots (hidden, accessibility) */}
      <div className="sr-only" aria-live="polite">
        Slide {current + 1} of {slides.length}
      </div>
    </section>
  );
}
