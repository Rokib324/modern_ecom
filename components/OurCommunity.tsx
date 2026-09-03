"use client";

import Link from "next/link";

export default function OurCommunity() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Josefin+Sans:wght@300;400;500;600&display=swap');
        .font-editorial-serif {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-sans-body {
          font-family: 'Josefin Sans', sans-serif;
        }
      `}</style>

      <section className="w-full">
        {/* ── Top Section: Join Our Community ── */}
        <div className="bg-white py-16 sm:py-20 lg:py-24 text-center px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            {/* Title */}
            <h2 className="font-editorial-serif text-3xl sm:text-4xl md:text-[44px] text-gray-900 font-normal leading-tight mb-4">
              Join Our Community
            </h2>

            {/* Description */}
            <p className="font-sans-body text-xs sm:text-[13px] md:text-sm text-gray-700 leading-relaxed max-w-xl mx-auto mb-8 sm:mb-10">
              Join us on Instagram, Facebook or TikTok with our community of print-lovers and pyjama enthusiasts to see behind-the-scenes designing, photoshoots, competitions and our small business life right{" "}
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2 hover:text-black transition-colors"
              >
                here
              </Link>
              .
            </p>

            {/* CTA Button */}
            <div>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans-body inline-block bg-[#f2b8a0] hover:bg-[#ebb098] text-[#3b2a25] text-xs sm:text-[13px] tracking-[0.2em] uppercase font-semibold px-8 py-3 rounded-[2px] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Go To Instagram
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
