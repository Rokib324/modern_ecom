"use client";

import Image from "next/image";
import Link from "next/link";

interface FeaturedBanner {
  id: string;
  title: string;
  buttonText: string;
  href: string;
  image: string;
  alt: string;
}

const banners: FeaturedBanner[] = [
  {
    id: "new-in",
    title: "New In",
    buttonText: "Shop Now",
    href: "/products?category=new",
    image: "/images/featured_new_in.jpg",
    alt: "Model wearing new in sky blue floral cotton pyjamas",
  },
  {
    id: "dressing-gowns",
    title: "Dressing Gowns & Robes",
    buttonText: "Shop Now",
    href: "/products?category=dressing-gowns",
    image: "/images/featured_dressing_gowns.jpg",
    alt: "Model wearing light blue floral cotton dressing gown robe",
  },
];

export default function FeaturedProduct() {
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

      <section className="w-full bg-white pb-12 sm:pb-16 lg:pb-20">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-4 lg:px-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] min-h-[480px] sm:min-h-[580px] lg:min-h-[680px] overflow-hidden group select-none"
            >
              {/* Background Image */}
              <Image
                src={banner.image}
                alt={banner.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Subtle ambient overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent transition-opacity duration-300" />

              {/* Centered Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                <h3 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-white tracking-normal font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mb-4 sm:mb-6 leading-tight">
                  {banner.title}
                </h3>
                <Link
                  href={banner.href}
                  className="font-sans-body inline-block bg-[#f2b8a0] hover:bg-[#ebb098] text-[#3b2a25] text-xs sm:text-[13px] tracking-[0.18em] uppercase font-semibold px-6 py-2.5 sm:px-8 sm:py-3 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {banner.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
