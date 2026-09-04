"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";

interface Product {
  id: string;
  name: string;
  price: string;
  numPrice: number;
  image: string;
  category: "new-in" | "best-sellers" | "linen-blend";
  sizes: string[];
  isNew?: boolean;
}

const productsData: Product[] = [
  // ── NEW IN ──
  {
    id: "new-1",
    name: "Ivory Cami Short Pyjama Set with Blue Lace Trim Satin",
    price: "৳5,800",
    numPrice: 5800,
    image: "/images/newin_ivory_cami.jpg",
    category: "new-in",
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
  },
  {
    id: "new-2",
    name: "Ivory Satin Dressing Gown with Blue Lace Trim",
    price: "৳6,200",
    numPrice: 6200,
    image: "/images/newin_ivory_gown.jpg",
    category: "new-in",
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
  },
  {
    id: "new-3",
    name: "Silver Grey with Pink Lace Trim Satin Cap Sleeve Nightdress",
    price: "৳5,500",
    numPrice: 5500,
    image: "/images/newin_silver_nightdress.jpg",
    category: "new-in",
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
  },
  {
    id: "new-4",
    name: "Autumn Floral with Pink Lace Trim Satin Cami Long Pyjama Set",
    price: "৳5,900",
    numPrice: 5900,
    image: "/images/newin_autumn_floral_cami.jpg",
    category: "new-in",
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
  },
  {
    id: "new-5",
    name: "Autumn Floral Satin Kimono Robe with Blush Trim",
    price: "৳6,500",
    numPrice: 6500,
    image: "/images/newin_autumn_floral_set.jpg",
    category: "new-in",
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
  },
  {
    id: "new-6",
    name: "Forest Green Gingham Nightwear Robe",
    price: "৳5,400",
    numPrice: 5400,
    image: "/images/featured_gingham_product.jpg",
    category: "new-in",
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
  },

  // ── BEST SELLERS ──
  {
    id: "best-1",
    name: "Classic Navy Striped Cotton Traditional Pyjama Set",
    price: "৳4,500",
    numPrice: 4500,
    image: "/images/collection_striped_pyjamas.jpg",
    category: "best-sellers",
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: false,
  },
  {
    id: "best-2",
    name: "Luxury Satin Long Sleeve & Trouser Nightwear Set",
    price: "৳5,200",
    numPrice: 5200,
    image: "/images/collection_satin_pyjamas.jpg",
    category: "best-sellers",
    sizes: ["XS", "S", "M", "L"],
    isNew: false,
  },
  {
    id: "best-3",
    name: "Vintage Botanical Floral Cotton Nightdress",
    price: "৳4,200",
    numPrice: 4200,
    image: "/images/collection_nightdresses.jpg",
    category: "best-sellers",
    sizes: ["S", "M", "L", "XL"],
    isNew: false,
  },
  {
    id: "best-4",
    name: "Silk Touch Emerald Green Dressing Gown",
    price: "৳5,800",
    numPrice: 5800,
    image: "/images/featured_dressing_gowns.jpg",
    category: "best-sellers",
    sizes: ["XS", "S", "M", "L"],
    isNew: false,
  },
  {
    id: "best-5",
    name: "Handcrafted Pure Cotton Breathable Pyjama Set",
    price: "৳4,800",
    numPrice: 4800,
    image: "/images/collection_cotton_pyjamas.jpg",
    category: "best-sellers",
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: false,
  },
  {
    id: "best-6",
    name: "Heritage Checkered Flannel Loungewear Set",
    price: "৳4,900",
    numPrice: 4900,
    image: "/images/featured_gingham_lifestyle.jpg",
    category: "best-sellers",
    sizes: ["S", "M", "L"],
    isNew: false,
  },

  // ── LINEN BLEND ──
  {
    id: "linen-1",
    name: "Relaxed Organic Linen Blend Long Sleeve Pyjama Set",
    price: "৳5,600",
    numPrice: 5600,
    image: "/images/folded_cloths.jpg",
    category: "linen-blend",
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
  },
  {
    id: "linen-2",
    name: "Heritage Botanical Print Linen-Cotton Pyjamas",
    price: "৳5,400",
    numPrice: 5400,
    image: "/images/homepagemodel.jpg",
    category: "linen-blend",
    sizes: ["XS", "S", "M", "L"],
    isNew: false,
  },
  {
    id: "linen-3",
    name: "Breezy Oatmeal Linen Button-Down Nightdress",
    price: "৳4,800",
    numPrice: 4800,
    image: "/images/collection_cotton_pyjamas.jpg",
    category: "linen-blend",
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: false,
  },
  {
    id: "linen-4",
    name: "Washed Terracotta Linen Cami & Shorts Lounge Set",
    price: "৳4,400",
    numPrice: 4400,
    image: "/images/newin_autumn_floral_cami.jpg",
    category: "linen-blend",
    sizes: ["S", "M", "L"],
    isNew: true,
  },
  {
    id: "linen-5",
    name: "Sage Green Linen Blend Lightweight Dressing Gown",
    price: "৳6,200",
    numPrice: 6200,
    image: "/images/featured_dressing_gowns.jpg",
    category: "linen-blend",
    sizes: ["XS", "S", "M", "L"],
    isNew: false,
  },
  {
    id: "linen-6",
    name: "Classic French Blue Striped Linen Sleepwear Set",
    price: "৳5,800",
    numPrice: 5800,
    image: "/images/collection_striped_pyjamas.jpg",
    category: "linen-blend",
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: false,
  },
];

const tabs = [
  {
    id: "new-in",
    label: "New In",
    endLabel: "New In",
    href: "/products?category=new",
  },
  {
    id: "best-sellers",
    label: "Best Sellers",
    endLabel: "Best Sellers",
    href: "/products?category=best-sellers",
  },
  {
    id: "linen-blend",
    label: "Linen Blend Pyjamas & Nightwear",
    endLabel: "Linen Blend",
    href: "/products?category=linen-blend",
  },
] as const;

export default function NewIn() {
  const [activeTab, setActiveTab] = useState<string>("new-in");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Global Wishlist Store
  const wishlistItems = useWishlistStore((s) => s.items);
  const addWishlistItem = useWishlistStore((s) => s.addItem);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];
  const filteredProducts = productsData.filter((p) => p.category === activeTab);

  const toggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isWishlisted = wishlistItems.some((i) => i.productId === product.id);
    if (isWishlisted) {
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

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 10);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);
      return () => {
        el.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, [activeTab]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.75;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Import Serif and Geometric fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Josefin+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        .font-editorial {
          font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
        }
        .font-sans-clean {
          font-family: 'Josefin Sans', sans-serif;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <section className="w-full bg-white py-12 lg:py-16 overflow-hidden">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* ── Header: Category Tabs + Navigation Arrows ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-gray-100/80">
            {/* Tabs */}
            <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative pb-2.5 text-base sm:text-lg md:text-xl font-editorial tracking-tight whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? "text-gray-900 font-medium"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gray-900" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Carousel Arrows */}
            <div className="hidden sm:flex items-center gap-4 text-gray-800">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous products"
                className={`p-1.5 transition-all duration-200 ${
                  canScrollLeft
                    ? "text-gray-900 hover:opacity-60 cursor-pointer"
                    : "text-gray-300 cursor-not-allowed"
                }`}
              >
                <ArrowLeft className="w-6 h-6 stroke-[1.25]" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Next products"
                className={`p-1.5 transition-all duration-200 ${
                  canScrollRight
                    ? "text-gray-900 hover:opacity-60 cursor-pointer"
                    : "text-gray-300 cursor-not-allowed"
                }`}
              >
                <ArrowRight className="w-6 h-6 stroke-[1.25]" />
              </button>
            </div>
          </div>

          {/* ── Product Carousel ── */}
          <div
            ref={scrollContainerRef}
            className="flex items-start gap-4 sm:gap-5 lg:gap-6 overflow-x-auto hide-scrollbar pt-6 pb-4 scroll-smooth snap-x snap-mandatory"
          >
            {filteredProducts.map((product) => {
              const isWishlisted = wishlistItems.some(
                (i) => i.productId === product.id
              );

              return (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[260px] sm:w-[290px] md:w-[320px] lg:w-[335px] snap-start group"
                >
                  {/* Card Container */}
                  <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden bg-[#faf8f5] mb-3.5 select-none shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                    <Link
                      href={`/products/${product.id}`}
                      className="block w-full h-full relative"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 260px, (max-width: 768px) 290px, (max-width: 1024px) 320px, 335px"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </Link>

                    {/* NEW Tag Badge (Top Left) */}
                    {product.isNew && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="font-sans-clean inline-block bg-white/95 backdrop-blur-[2px] text-gray-900 text-[9px] sm:text-[10px] tracking-[0.2em] font-semibold px-2 py-0.5 rounded-[2px] shadow-sm uppercase">
                          New
                        </span>
                      </div>
                    )}

                    {/* Wishlist Heart Button (Bottom Right) */}
                    <button
                      onClick={(e) => toggleWishlist(product, e)}
                      aria-label="Add to wishlist"
                      className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-white/60 backdrop-blur-sm sm:bg-transparent hover:bg-white text-gray-800 hover:text-red-500 transition-all duration-200 cursor-pointer"
                    >
                      <Heart
                        className={`w-5 h-5 transition-transform duration-200 active:scale-125 stroke-[1.3] ${
                          isWishlisted
                            ? "fill-red-500 text-red-500"
                            : "text-gray-800"
                        }`}
                      />
                    </button>

                    {/* Size Selector Quick View on Hover (Bottom Right Overlay) */}
                    <div className="absolute bottom-3 left-3 right-12 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 z-10">
                      {product.sizes.slice(0, 4).map((size) => (
                        <span
                          key={size}
                          className="font-sans-clean text-[10px] font-medium bg-white/95 hover:bg-black hover:text-white text-gray-800 px-1.5 py-0.5 rounded-[2px] shadow-sm transition-colors cursor-pointer"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1">
                    <Link
                      href={`/products/${product.id}`}
                      className="font-editorial text-[14px] sm:text-[15px] leading-snug text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 block"
                    >
                      {product.name}
                    </Link>
                    <p className="font-editorial text-[13px] sm:text-[14px] text-gray-800">
                      {product.price}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* ── View All End Card (matches active tab) ── */}
            <div className="flex-shrink-0 w-[200px] sm:w-[240px] aspect-[3/4] flex flex-col items-center justify-center p-6 text-center snap-start self-start">
              <h3 className="font-editorial text-2xl sm:text-3xl text-gray-900 mb-3">
                {currentTab.endLabel}
              </h3>
              <Link
                href={currentTab.href}
                className="font-editorial text-sm sm:text-base text-gray-800 underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
