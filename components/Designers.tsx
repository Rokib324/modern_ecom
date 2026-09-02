"use client";

import Image from "next/image";
import Link from "next/link";

export default function Designers() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Josefin+Sans:wght@300;400;500;600&display=swap');
        .font-editorial-heading {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-sans-ui {
          font-family: 'Josefin Sans', sans-serif;
        }
      `}</style>

      <section className="w-full bg-white pb-12 sm:pb-16 lg:pb-20">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          
          {/* ── Left Column: Blush Pink Info Panel ── */}
          <div className="bg-[#f2b8a0] flex flex-col justify-center items-start px-8 sm:px-14 md:px-20 lg:px-24 py-16 sm:py-20 lg:py-28 text-left">
            <div className="max-w-md">
              {/* Eyebrow */}
              <p className="font-sans-ui text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-semibold text-[#3b2a25] mb-3 sm:mb-4">
                We Are A
              </p>

              {/* Main Headline */}
              <h2 className="font-editorial-heading text-3xl sm:text-4xl md:text-5xl lg:text-[46px] text-[#2d1e1a] font-normal leading-[1.18] tracking-tight mb-3 sm:mb-4">
                Women-Led Design Duo
              </h2>

              {/* Sub-text */}
              <p className="font-editorial-heading text-base sm:text-lg md:text-xl text-[#3b2a25] font-normal mb-8 sm:mb-10">
                Thanks for supporting us
              </p>

              {/* Button */}
              <Link
                href="/about"
                className="font-sans-ui inline-block bg-black hover:bg-gray-800 text-white text-xs sm:text-[13px] tracking-[0.14em] uppercase font-medium px-6 py-3 rounded-[3px] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Read Our Story
              </Link>
            </div>
          </div>

          {/* ── Right Column: Designers Photo ── */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[580px] bg-[#faf8f5] overflow-hidden group">
            <Image
              src="/images/designers_duo.jpg"
              alt="Two women fashion designers smiling in studio"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
            />
          </div>

        </div>
      </section>
    </>
  );
}
