"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function FeaturedProduct2() {
  const [showHotspot, setShowHotspot] = useState(false);

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

      <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* ── Left Column: Atmospheric Lifestyle Image with Hotspot ── */}
            <div className="lg:col-span-7 relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-[2px] overflow-hidden group select-none shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Image
                src="/images/featured_gingham_lifestyle.jpg"
                alt="Model in green and white watercolour gingham checkered pyjamas relaxing at vintage table"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
              />

              {/* Interactive Shop-the-look Hotspot Pin */}
              <div className="absolute top-[52%] left-[46%] z-20">
                <button
                  onClick={() => setShowHotspot(!showHotspot)}
                  onMouseEnter={() => setShowHotspot(true)}
                  aria-label="View product details"
                  className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/90 shadow-md hover:scale-110 transition-transform cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                  {/* Pulse effect */}
                  <span className="absolute inset-0 rounded-full bg-white/60 animate-ping" />
                </button>

                {/* Hotspot Floating Card */}
                {showHotspot && (
                  <div
                    onMouseLeave={() => setShowHotspot(false)}
                    className="absolute left-8 top-1/2 -translate-y-1/2 w-48 sm:w-56 bg-white p-3 rounded-md shadow-xl border border-gray-100 z-30 animate-fade-in"
                  >
                    <p className="font-sans-ui text-[11px] sm:text-xs font-semibold text-gray-900 leading-tight mb-1">
                      Womens Green Gingham Pyjama Set
                    </p>
                    <p className="font-sans-ui text-[11px] text-gray-600 mb-2">
                      £48.00
                    </p>
                    <Link
                      href="/products/new-6"
                      className="font-sans-ui block text-center bg-[#f2b8a0] text-[#3b2a25] text-[10px] tracking-wider uppercase font-semibold py-1 rounded-[2px] hover:bg-[#ebb098] transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right Column: Editorial Header & Framed Product Card ── */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
              
              {/* Header Title & CTA Button */}
              <div className="mb-6 sm:mb-8 flex flex-col items-center">
                <h2 className="font-editorial-heading text-2xl sm:text-[28px] uppercase tracking-[0.06em] text-gray-900 font-normal mb-3">
                  Shop New In
                </h2>
                <Link
                  href="/products/new-6"
                  className="font-sans-ui inline-block bg-[#f2b8a0] hover:bg-[#ebb098] text-[#3b2a25] text-xs sm:text-[13px] tracking-[0.16em] uppercase font-semibold px-6 py-2 rounded-[2px] shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Shop now
                </Link>
              </div>

              {/* Framed Single Product Card */}
              <div className="w-full max-w-[320px] sm:max-w-[340px] bg-white border border-gray-300/80 p-4 sm:p-5 flex flex-col items-center shadow-[0_1px_4px_rgba(0,0,0,0.03)] group">
                {/* Product Image */}
                <Link
                  href="/products/new-6"
                  className="relative aspect-[3/4] w-full overflow-hidden bg-[#faf8f5] mb-4 block"
                >
                  <Image
                    src="/images/featured_gingham_product.jpg"
                    alt="Womens Green Watercolour Gingham Seersucker Drop Shoulder Mini Nightdress"
                    fill
                    sizes="(max-width: 640px) 280px, 340px"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </Link>

                {/* Product Information */}
                <Link
                  href="/products/new-6"
                  className="font-sans-ui text-[13px] sm:text-[14px] text-gray-800 hover:text-gray-900 leading-snug font-normal px-2 mb-1.5 transition-colors"
                >
                  Womens Green Watercolour Gingham Seersucker Drop Shoulder Mini Nightdress
                </Link>
                <p className="font-sans-ui text-[13px] sm:text-[14px] text-gray-900 font-medium mb-4">
                  £46.00
                </p>

                {/* Choose Options Button */}
                <Link
                  href="/products/new-6"
                  className="font-sans-ui inline-block border border-gray-300 hover:border-gray-900 text-gray-800 hover:text-gray-900 text-[11px] sm:text-xs tracking-wider uppercase px-4 py-1.5 rounded-[2px] transition-colors font-medium"
                >
                  Choose options
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}