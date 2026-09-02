"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CollectionItem {
  id: string;
  title: string;
  image: string;
  href: string;
}

const collections: CollectionItem[] = [
  {
    id: "cotton",
    title: "Women's Cotton Pyjamas & Nightwear",
    image: "/images/collection_cotton_pyjamas.jpg",
    href: "/products?category=cotton-pyjamas",
  },
  {
    id: "nightdresses",
    title: "Women's Nightdresses and Shirts",
    image: "/images/collection_nightdresses.jpg",
    href: "/products?category=nightdresses",
  },
  {
    id: "satin",
    title: "Women's Satin Pyjamas & Nightwear",
    image: "/images/collection_satin_pyjamas.jpg",
    href: "/products?category=satin-pyjamas",
  },
  {
    id: "striped",
    title: "Striped Pyjamas & Nightwear",
    image: "/images/collection_striped_pyjamas.jpg",
    href: "/products?category=striped-pyjamas",
  },
];

export default function ShopCollection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Josefin+Sans:wght@300;400;500;600&display=swap');
        .font-editorial-heading {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>

      <section className="w-full bg-white pt-10 pb-14 sm:pt-14 sm:pb-20">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Top Divider */}
          <div className="w-full border-t border-gray-200/70 mb-8 sm:mb-10" />

          {/* Section Heading */}
          <h2 className="font-editorial-heading text-xl sm:text-2xl md:text-[28px] uppercase tracking-[0.06em] text-gray-900 font-normal mb-6 sm:mb-8">
            Shop Our Collections
          </h2>

          {/* Collections 4-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {collections.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group flex flex-col overflow-hidden transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#faf8f5]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Bottom Title Bar with Salmon Background */}
                <div className="bg-[#f2b8a0] px-4 py-3 sm:py-3.5 flex items-center justify-between gap-2 transition-colors duration-200 group-hover:bg-[#ebb098]">
                  <span className="font-editorial-heading text-[13px] sm:text-[14px] text-[#3b2a25] leading-snug font-normal">
                    {item.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#3b2a25] stroke-[1.25] flex-shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
