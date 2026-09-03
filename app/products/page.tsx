"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";

interface CatalogProduct {
  id: string;
  name: string;
  price: string;
  numPrice: number;
  image: string;
  category: string;
  isNew?: boolean;
}

const PRODUCTS: CatalogProduct[] = [
  {
    id: "new-1",
    name: "Ivory Cami Short Pyjama Set with Blue Lace Trim Satin",
    price: "£48.00",
    numPrice: 48.0,
    image: "/images/newin_ivory_cami.jpg",
    category: "Womens",
    isNew: true,
  },
  {
    id: "new-2",
    name: "Ivory Satin Dressing Gown with Blue Lace Trim",
    price: "£48.00",
    numPrice: 48.0,
    image: "/images/newin_ivory_gown.jpg",
    category: "Womens",
    isNew: true,
  },
  {
    id: "new-3",
    name: "Silver Grey with Pink Lace Trim Satin Cap Sleeve Nightdress",
    price: "£48.00",
    numPrice: 48.0,
    image: "/images/newin_silver_nightdress.jpg",
    category: "Womens",
    isNew: true,
  },
  {
    id: "new-4",
    name: "Autumn Floral with Pink Lace Trim Satin Cami Long Pyjama Set",
    price: "£46.00",
    numPrice: 46.0,
    image: "/images/newin_autumn_floral_cami.jpg",
    category: "Womens",
    isNew: true,
  },
  {
    id: "new-5",
    name: "Autumn Floral Satin Oversize Pyjama Set",
    price: "£48.00",
    numPrice: 48.0,
    image: "/images/newin_autumn_floral_set.jpg",
    category: "Womens",
    isNew: true,
  },
  {
    id: "best-1",
    name: "Classic Navy Striped Cotton Traditional Pyjama Set",
    price: "£45.00",
    numPrice: 45.0,
    image: "/images/collection_striped_pyjamas.jpg",
    category: "Womens",
  },
  {
    id: "best-2",
    name: "Luxury Satin Long Sleeve & Trouser Nightwear Set",
    price: "£52.00",
    numPrice: 52.0,
    image: "/images/collection_satin_pyjamas.jpg",
    category: "Womens",
  },
  {
    id: "best-3",
    name: "Vintage Botanical Floral Cotton Nightdress",
    price: "£42.00",
    numPrice: 42.0,
    image: "/images/collection_nightdresses.jpg",
    category: "Womens",
  },
  {
    id: "best-4",
    name: "Silk Touch Emerald Green Dressing Gown",
    price: "£58.00",
    numPrice: 58.0,
    image: "/images/featured_dressing_gowns.jpg",
    category: "Womens",
  },
  {
    id: "linen-1",
    name: "Relaxed Organic Linen Blend Long Sleeve Pyjama Set",
    price: "£56.00",
    numPrice: 56.0,
    image: "/images/folded_cloths.jpg",
    category: "Linen Blend",
    isNew: true,
  },
  {
    id: "linen-2",
    name: "Heritage Botanical Print Linen-Cotton Pyjamas",
    price: "£54.00",
    numPrice: 54.0,
    image: "/images/homepagemodel.jpg",
    category: "Linen Blend",
  },
  {
    id: "linen-5",
    name: "Sage Green Linen Blend Lightweight Dressing Gown",
    price: "£62.00",
    numPrice: 62.0,
    image: "/images/featured_dressing_gowns.jpg",
    category: "Linen Blend",
  },
];

export default function ProductsPage() {
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const wishlistItems = useWishlistStore((s) => s.items);
  const addWishlistItem = useWishlistStore((s) => s.addItem);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);

  const filtered =
    selectedCat === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCat);

  const toggleWishlist = (product: CatalogProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const exists = wishlistItems.some((i) => i.productId === product.id);
    if (exists) {
      removeWishlistItem(product.id);
    } else {
      addWishlistItem({
        productId: product.id,
        name: product.name,
        price: product.numPrice,
        image: product.image,
        slug: product.id,
        category: product.category,
      });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Josefin+Sans:wght@300;400;500;600&display=swap');
        .font-editorial-serif {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-sans-clean {
          font-family: 'Josefin Sans', sans-serif;
        }
      `}</style>

      <div className="w-full bg-white text-gray-900 pt-28 sm:pt-32 pb-20 font-sans-clean">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h1 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl font-normal mb-3 text-gray-900">
              Women&apos;s Pyjamas &amp; Nightwear
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Explore our luxury hand-crafted nightwear collection, featuring liquid satin, breathable organic cotton, and artisanal hand-painted prints.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
            {["All", "Womens", "Linen Blend"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-5 py-2 text-xs uppercase tracking-wider font-semibold rounded-full transition-all cursor-pointer ${
                  selectedCat === cat
                    ? "bg-[#383d49] text-white shadow-sm"
                    : "bg-[#fbf1ea] text-[#3b2a25] hover:bg-[#f2b8a0]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filtered.map((product) => {
              const isWishlisted = wishlistItems.some(
                (i) => i.productId === product.id
              );

              return (
                <div key={product.id} className="group">
                  <div className="relative aspect-[3/4] w-full rounded-[2px] overflow-hidden bg-[#faf8f5] mb-3 select-none">
                    <Link
                      href={`/products/${product.id}`}
                      className="block w-full h-full relative"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </Link>

                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-white/95 text-gray-900 text-[9px] tracking-[0.2em] font-semibold px-2 py-0.5 rounded-[2px] uppercase shadow-sm">
                        New
                      </span>
                    )}

                    <button
                      onClick={(e) => toggleWishlist(product, e)}
                      aria-label="Wishlist"
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-white/70 hover:bg-white text-gray-800 hover:text-red-500 transition-colors shadow-sm cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isWishlisted ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <Link
                    href={`/products/${product.id}`}
                    className="font-editorial-serif text-sm sm:text-[15px] text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 block leading-snug"
                  >
                    {product.name}
                  </Link>
                  <p className="font-editorial-serif text-xs sm:text-sm text-gray-700 mt-1">
                    {product.price}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
