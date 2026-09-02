"use client";

import Link from "next/link";

export default function OurStory() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Italiana&family=Josefin+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        .font-story-serif {
          font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
        }
        .font-sans-eyebrow {
          font-family: 'Josefin Sans', sans-serif;
        }
      `}</style>

      <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="space-y-6 sm:space-y-8">
            {/* Eyebrow Label */}
            <p className="font-sans-eyebrow text-[15px] sm:text-[16px] font-semibold uppercase tracking-[0.22em] text-gray-800">
              Our Story
            </p>

            {/* Brand Statement Headline */}
            <h2 className="font-story-serif text-2xl sm:text-3xl md:text-4xl text-gray-900 font-normal leading-[1.25] tracking-tight">
              Their Nibs has proudly evolved into a women-focused fashion brand, specialising in sleepwear and unique prints that celebrate the natural world, vibrant colour and feeling good.
            </h2>

            {/* Read More Link */}
            <div className="pt-2 sm:pt-4">
              <Link
                href="/about"
                className="font-story-serif inline-block text-[14px] sm:text-[16px] text-gray-900 hover:text-gray-600 transition-colors border-b border-gray-900 pb-1 hover:border-gray-600"
              >
                Read more
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
