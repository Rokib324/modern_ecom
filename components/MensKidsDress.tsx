"use client";

import Image from "next/image";
import Link from "next/link";

interface CategoryBanner {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  image: string;
  alt: string;
}

const banners: CategoryBanner[] = [
  {
    id: "mens",
    title: "Mens Nightwear",
    description:
      "Pyjamas & Robes. From matching family moments to classic menswear-inspired styles, discover men's pyjamas and more",
    buttonText: "Shop Now",
    href: "/products?category=mens",
    image: "/images/mens_nightwear.jpg",
    alt: "Smiling man wearing classic navy printed pyjama shirt",
  },
  {
    id: "kids",
    title: "Kids Pyjamas",
    description:
      "20% of the profits from our kids pyjamas go to a children's charity close to our hearts",
    buttonText: "Find Out More",
    href: "/products?category=kids",
    image: "/images/kids_pyjamas.jpg",
    alt: "Young girl wearing colourful summer pyjama set",
  },
];

export default function MensKidsDress() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Josefin+Sans:wght@300;400;500;600&display=swap');
        .font-editorial-heading {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-sans-text {
          font-family: 'Josefin Sans', sans-serif;
        }
      `}</style>

      <section className="w-full bg-white pb-12 sm:pb-16 lg:pb-20">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-4 lg:px-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] min-h-[480px] sm:min-h-[580px] lg:min-h-[680px] overflow-hidden group select-none shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              {/* Background Photography */}
              <Image
                src={banner.image}
                alt={banner.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Ambient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/35 transition-opacity duration-300" />

              {/* Centered Campaign Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 text-center z-10">
                {/* Title */}
                <h3 className="font-editorial-heading text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-white tracking-normal font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] mb-3 sm:mb-4 leading-tight">
                  {banner.title}
                </h3>

                {/* Description */}
                <p className="font-sans-text text-white/95 text-xs sm:text-sm md:text-[15px] font-normal max-w-md leading-relaxed mb-6 sm:mb-8 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  {banner.description}
                </p>

                {/* CTA Button */}
                <Link
                  href={banner.href}
                  className="font-sans-text inline-block bg-[#f2b8a0] hover:bg-[#ebb098] text-[#3b2a25] text-xs sm:text-[13px] tracking-[0.18em] uppercase font-semibold px-7 py-2.5 sm:px-8 sm:py-3 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
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
