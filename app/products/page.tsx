"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Heart, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";

/* ─────────────────────────────────────────────
   PRODUCT DATA — shared across all categories
   ───────────────────────────────────────────── */
interface CatalogProduct {
  id: string;
  name: string;
  price: string;
  numPrice: number;
  image: string;
  category: "new" | "best-sellers" | "linen-blend";
  isNew?: boolean;
  isBestSeller?: boolean;
}

const ALL_PRODUCTS: CatalogProduct[] = [
  // ── NEW IN ──────────────────────────────────────
  {
    id: "new-1",
    name: "Ivory Cami Short Pyjama Set with Blue Lace Trim Satin",
    price: "৳5,800",
    numPrice: 5800,
    image: "/images/newin_ivory_cami.jpg",
    category: "new",
    isNew: true,
  },
  {
    id: "new-2",
    name: "Ivory Satin Dressing Gown with Blue Lace Trim",
    price: "৳6,200",
    numPrice: 6200,
    image: "/images/newin_ivory_gown.jpg",
    category: "new",
    isNew: true,
  },
  {
    id: "new-3",
    name: "Silver Grey with Pink Lace Trim Satin Cap Sleeve Nightdress",
    price: "৳5,500",
    numPrice: 5500,
    image: "/images/newin_silver_nightdress.jpg",
    category: "new",
    isNew: true,
  },
  {
    id: "new-4",
    name: "Autumn Floral with Pink Lace Trim Satin Cami Long Pyjama Set",
    price: "৳5,900",
    numPrice: 5900,
    image: "/images/newin_autumn_floral_cami.jpg",
    category: "new",
    isNew: true,
  },
  {
    id: "new-5",
    name: "Autumn Floral Satin Kimono Robe with Blush Trim",
    price: "৳6,500",
    numPrice: 6500,
    image: "/images/newin_autumn_floral_set.jpg",
    category: "new",
    isNew: true,
  },
  {
    id: "new-6",
    name: "Forest Green Gingham Nightwear Robe",
    price: "৳5,400",
    numPrice: 5400,
    image: "/images/featured_gingham_product.jpg",
    category: "new",
    isNew: true,
  },

  // ── BEST SELLERS ─────────────────────────────────
  {
    id: "best-1",
    name: "Classic Navy Striped Cotton Traditional Pyjama Set",
    price: "৳4,500",
    numPrice: 4500,
    image: "/images/collection_striped_pyjamas.jpg",
    category: "best-sellers",
    isBestSeller: true,
  },
  {
    id: "best-2",
    name: "Luxury Satin Long Sleeve & Trouser Nightwear Set",
    price: "৳5,200",
    numPrice: 5200,
    image: "/images/collection_satin_pyjamas.jpg",
    category: "best-sellers",
    isBestSeller: true,
  },
  {
    id: "best-3",
    name: "Vintage Botanical Floral Cotton Nightdress",
    price: "৳4,200",
    numPrice: 4200,
    image: "/images/collection_nightdresses.jpg",
    category: "best-sellers",
    isBestSeller: true,
  },
  {
    id: "best-4",
    name: "Silk Touch Emerald Green Dressing Gown",
    price: "৳5,800",
    numPrice: 5800,
    image: "/images/featured_dressing_gowns.jpg",
    category: "best-sellers",
    isBestSeller: true,
  },
  {
    id: "best-5",
    name: "Heritage Cotton Woven Pyjama Set",
    price: "৳4,800",
    numPrice: 4800,
    image: "/images/collection_cotton_pyjamas.jpg",
    category: "best-sellers",
    isBestSeller: true,
  },
  {
    id: "best-6",
    name: "Autumn Gingham Lifestyle Nightwear Set",
    price: "৳4,900",
    numPrice: 4900,
    image: "/images/featured_gingham_lifestyle.jpg",
    category: "best-sellers",
    isBestSeller: true,
  },

  // ── LINEN BLEND ──────────────────────────────────
  {
    id: "linen-1",
    name: "Relaxed Organic Linen Blend Long Sleeve Pyjama Set",
    price: "৳5,600",
    numPrice: 5600,
    image: "/images/folded_cloths.jpg",
    category: "linen-blend",
    isNew: true,
  },
  {
    id: "linen-2",
    name: "Heritage Botanical Print Linen-Cotton Pyjamas",
    price: "৳5,400",
    numPrice: 5400,
    image: "/images/homepagemodel.jpg",
    category: "linen-blend",
  },
  {
    id: "linen-3",
    name: "Sage Green Linen Blend Lightweight Dressing Gown",
    price: "৳6,200",
    numPrice: 6200,
    image: "/images/featured_dressing_gowns.jpg",
    category: "linen-blend",
  },
  {
    id: "linen-4",
    name: "Ivory Linen Blend Wide-Leg Pyjama Trouser Set",
    price: "৳5,800",
    numPrice: 5800,
    image: "/images/newin_ivory_gown.jpg",
    category: "linen-blend",
  },
  {
    id: "linen-5",
    name: "Floral Embroidered Linen Blend Nightdress",
    price: "৳5,200",
    numPrice: 5200,
    image: "/images/featured_new_in.jpg",
    category: "linen-blend",
  },
  {
    id: "linen-6",
    name: "Natural Stripe Linen-Cotton Blend Pyjama Set",
    price: "৳5,400",
    numPrice: 5400,
    image: "/images/collection_cotton_pyjamas.jpg",
    category: "linen-blend",
  },
];

/* ─────────────────────────────────────────────
   TAB DEFINITIONS
   ───────────────────────────────────────────── */
type TabKey = "all" | "new" | "best-sellers" | "linen-blend";

const TABS: { key: TabKey; label: string; heading: string; subheading: string; sublinks: { label: string; href: string }[] }[] = [
  {
    key: "all",
    label: "All",
    heading: "Women's Pyjamas & Nightwear",
    subheading:
      "Explore our latest sleepwear collection, featuring beautifully designed long pyjamas, short pyjamas, and our bestselling oversized pyjamas in dreamy hand-drawn prints.",
    sublinks: [
      { label: "Women's Cotton Pyjamas & Nightwear", href: "/products?category=linen-blend" },
      { label: "Women's Satin Pyjamas & Nightwear", href: "/products?category=best-sellers" },
      { label: "Women's Pyjamas", href: "/products?category=new" },
    ],
  },
  {
    key: "new",
    label: "New In",
    heading: "New In",
    subheading:
      "Explore our latest sleepwear arrivals, featuring beautifully designed long pyjamas, short pyjamas, and our bestselling oversized pyjamas in dreamy hand-drawn prints.",
    sublinks: [
      { label: "Satin Nightwear", href: "/products?category=new" },
      { label: "Pyjama Sets", href: "/products?category=new" },
      { label: "Dressing Gowns", href: "/products?category=new" },
    ],
  },
  {
    key: "best-sellers",
    label: "Best Sellers",
    heading: "Best Sellers",
    subheading:
      "Our most loved styles, worn and adored season after season. Discover the pieces customers return to time and time again.",
    sublinks: [
      { label: "Women's Cotton Pyjamas & Nightwear", href: "/products?category=best-sellers" },
      { label: "Women's Satin Pyjamas & Nightwear", href: "/products?category=best-sellers" },
      { label: "Women's Pyjamas", href: "/products?category=best-sellers" },
    ],
  },
  {
    key: "linen-blend",
    label: "Linen Blend",
    heading: "Linen Blend Pyjamas & Nightwear",
    subheading:
      "Breathable and beautifully relaxed — our linen-blend pyjamas and nightwear are crafted for effortless comfort all year round.",
    sublinks: [
      { label: "Linen Pyjama Sets", href: "/products?category=linen-blend" },
      { label: "Linen Dressing Gowns", href: "/products?category=linen-blend" },
      { label: "Linen Nightdresses", href: "/products?category=linen-blend" },
    ],
  },
];

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

const FILTER_DATA: Record<string, string[]> = {
  Style: ["Pyjama Sets", "Dressing Gowns", "Nightdresses", "Cami Sets", "Robes"],
  Size: ["XS", "S", "M", "L", "XL", "XXL"],
  Fabric: ["Cotton", "Satin", "Linen Blend", "Silk Touch", "Gingham"],
  Colour: ["Ivory", "Navy", "Emerald Green", "Sage Green", "Silver Grey", "Pink"],
  Print: ["Floral", "Botanical", "Striped", "Gingham", "Plain / Solid"],
  Availability: ["In Stock", "New In", "Best Seller"],
};

const FILTER_PILLS = Object.keys(FILTER_DATA);

/* ─────────────────────────────────────────────
   INNER COMPONENT (reads searchParams)
   ───────────────────────────────────────────── */
function ProductsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Map query param to tab key
  const paramCategory = searchParams.get("category") as TabKey | null;
  const validKeys: TabKey[] = ["all", "new", "best-sellers", "linen-blend"];
  const initialTab: TabKey =
    paramCategory && validKeys.includes(paramCategory) ? paramCategory : "all";

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [sortBy, setSortBy] = useState("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [openFilterPill, setOpenFilterPill] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const filterPillRef = useRef<HTMLDivElement>(null);

  const wishlistItems = useWishlistStore((s) => s.items);
  const addWishlistItem = useWishlistStore((s) => s.addItem);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);

  const sortRef = useRef<HTMLDivElement>(null);

  // Sync URL → tab when user navigates back/forward
  useEffect(() => {
    const cat = searchParams.get("category") as TabKey | null;
    if (cat && validKeys.includes(cat)) {
      setActiveTab(cat);
    } else {
      setActiveTab("all");
    }
  }, [searchParams]);

  // Close sort menu + filter pills on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
      if (filterPillRef.current && !filterPillRef.current.contains(e.target as Node)) {
        setOpenFilterPill(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    const url = key === "all" ? "/products" : `/products?category=${key}`;
    router.push(url, { scroll: false });
  };

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

  const toggleFilterOption = (pill: string, option: string) => {
    setSelectedFilters((prev) => {
      const list = prev[pill] || [];
      const exists = list.includes(option);
      const updated = exists ? list.filter((item) => item !== option) : [...list, option];
      if (updated.length === 0) {
        const copy = { ...prev };
        delete copy[pill];
        return copy;
      }
      return { ...prev, [pill]: updated };
    });
  };

  const clearPillFilter = (pill: string) => {
    setSelectedFilters((prev) => {
      const copy = { ...prev };
      delete copy[pill];
      return copy;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  const activeFilterCount = Object.values(selectedFilters).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  // Filter base by category
  const categoryFiltered =
    activeTab === "all"
      ? ALL_PRODUCTS
      : ALL_PRODUCTS.filter((p) => p.category === activeTab);

  // Apply active pill filters
  const filtered = categoryFiltered.filter((product) => {
    // Style
    if (selectedFilters["Style"]?.length) {
      const match = selectedFilters["Style"].some((style) => {
        if (style === "Pyjama Sets") return /pyjama/i.test(product.name);
        if (style === "Dressing Gowns") return /dressing gown|gown/i.test(product.name);
        if (style === "Nightdresses") return /nightdress/i.test(product.name);
        if (style === "Cami Sets") return /cami/i.test(product.name);
        if (style === "Robes") return /robe/i.test(product.name);
        return false;
      });
      if (!match) return false;
    }

    // Fabric
    if (selectedFilters["Fabric"]?.length) {
      const match = selectedFilters["Fabric"].some((fabric) => {
        if (fabric === "Satin") return /satin/i.test(product.name);
        if (fabric === "Cotton") return /cotton/i.test(product.name);
        if (fabric === "Linen Blend") return /linen/i.test(product.name);
        if (fabric === "Silk Touch") return /silk/i.test(product.name);
        if (fabric === "Gingham") return /gingham/i.test(product.name);
        return false;
      });
      if (!match) return false;
    }

    // Colour
    if (selectedFilters["Colour"]?.length) {
      const match = selectedFilters["Colour"].some((colour) => {
        const keyword = colour.replace(" Green", "");
        return new RegExp(keyword, "i").test(product.name);
      });
      if (!match) return false;
    }

    // Print
    if (selectedFilters["Print"]?.length) {
      const match = selectedFilters["Print"].some((print) => {
        if (print === "Floral") return /floral/i.test(product.name);
        if (print === "Botanical") return /botanical/i.test(product.name);
        if (print === "Striped") return /stripe/i.test(product.name);
        if (print === "Gingham") return /gingham/i.test(product.name);
        if (print === "Plain / Solid") return !/floral|botanical|stripe|gingham/i.test(product.name);
        return false;
      });
      if (!match) return false;
    }

    // Availability
    if (selectedFilters["Availability"]?.length) {
      const match = selectedFilters["Availability"].some((avail) => {
        if (avail === "New In") return !!product.isNew;
        if (avail === "Best Seller") return !!product.isBestSeller;
        if (avail === "In Stock") return true;
        return false;
      });
      if (!match) return false;
    }

    // Size: Available across all items
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.numPrice - b.numPrice;
    if (sortBy === "price-desc") return b.numPrice - a.numPrice;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    return 0;
  });

  const currentTab = TABS.find((t) => t.key === activeTab) ?? TABS[0];
  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Featured";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Josefin+Sans:wght@300;400;500;600&display=swap');
        .font-editorial-serif { font-family: 'Playfair Display', Georgia, serif; }
        .font-sans-clean { font-family: 'Josefin Sans', sans-serif; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-grid-item {
          animation: fadeSlideUp 0.45s ease both;
        }
        .filter-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 9999px;
          padding: 6px 14px;
          background: white;
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 0.15s, background 0.15s;
          font-family: 'Josefin Sans', sans-serif;
          letter-spacing: 0.04em;
        }
        .filter-pill-btn:hover {
          border-color: #111827;
          background: #fafafa;
        }
        .filter-pill-btn.active {
          border-color: #111827;
          background: #111827;
          color: white;
        }
      `}</style>

      <div className="w-full bg-white text-gray-900 font-sans-clean">

        {/* ══════════════════════════════════════════════════
            BEIGE HEADER BANNER — title left, description right
            Subcategory link tags below
           ══════════════════════════════════════════════════ */}
        <div className="w-full pt-24 sm:pt-28">
          <div
            style={{ backgroundColor: "#fbf1ea" }}
            className="w-full"
          >
            <div className="max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-14">
              {/* Top row: Title LEFT — Description RIGHT */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pt-10 pb-6">
                {/* Title */}
                <h1
                  className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-gray-900 leading-tight flex-shrink-0 max-w-xs"
                >
                  {currentTab.heading}
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed max-w-sm md:max-w-md text-left md:text-right font-light">
                  {currentTab.subheading}
                </p>
              </div>

              {/* Sub-category tag links */}
              <div className="flex flex-wrap items-center gap-2 pb-7 pt-1">
                {currentTab.sublinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="inline-block text-[12px] sm:text-[13px] text-gray-800 border border-gray-400 rounded-full px-4 py-1.5 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 leading-tight"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            FILTER BAR — sticky, white background
            Row 1: Hide Filters toggle + Result count | Sort
            Row 2 (conditional): Filter pill dropdowns
           ══════════════════════════════════════════════════ */}
        <div className="sticky top-16 sm:top-20 z-30 bg-white border-b border-gray-200 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
          <div className="max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-14">

            {/* Row 1: Filters toggle + count + Sort */}
            <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
              {/* Left: toggle + count */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className="flex items-center gap-2 text-[12px] text-gray-700 hover:text-gray-900 transition-colors cursor-pointer font-medium"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {showFilters ? "Hide filters" : "Show filters"}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
                  />
                </button>
                <span className="text-[12px] text-gray-500">
                  {sorted.length} Result{sorted.length !== 1 ? "s" : ""}
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[12px] text-gray-500 hover:text-gray-900 underline cursor-pointer"
                  >
                    Clear filters ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Right: Sort */}
              <div ref={sortRef} className="relative">
                <button
                  onClick={() => setShowSortMenu((v) => !v)}
                  className="flex items-center gap-1 text-[12px] text-gray-700 hover:text-gray-900 transition-colors cursor-pointer font-medium"
                >
                  Sort: <span className="font-semibold ml-0.5">{currentSortLabel}</span>
                  <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
                </button>
                {showSortMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px] py-1.5 overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-5 py-2.5 text-[12px] cursor-pointer transition-colors ${
                          sortBy === opt.value
                            ? "bg-gray-900 text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Filter pill dropdowns */}
            {showFilters && (
              <div ref={filterPillRef} className="flex flex-wrap items-center gap-2 py-3">
                {FILTER_PILLS.map((pill) => {
                  const selectedInPill = selectedFilters[pill] || [];
                  const isOpen = openFilterPill === pill;

                  return (
                    <div
                      key={pill}
                      className={`relative flex-shrink-0 ${isOpen ? "z-50" : "z-10"}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFilterPill((prev) => (prev === pill ? null : pill))
                        }
                        className={`filter-pill-btn ${
                          isOpen || selectedInPill.length > 0 ? "active" : ""
                        }`}
                      >
                        <span>{pill}</span>
                        {selectedInPill.length > 0 && (
                          <span
                            className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold leading-none ${
                              isOpen || selectedInPill.length > 0
                                ? "bg-white text-gray-900"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {selectedInPill.length}
                          </span>
                        )}
                        <ChevronDown
                          className={`w-3 h-3 ml-0.5 transition-transform duration-150 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {isOpen && (
                        <div
                          className={`absolute ${
                            pill === "Availability" ? "right-0" : "left-0"
                          } top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 min-w-[210px] p-2 max-h-64 overflow-y-auto`}
                        >
                          <div className="flex flex-col gap-0.5">
                            {FILTER_DATA[pill]?.map((option) => {
                              const isSelected = selectedInPill.includes(option);
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFilterOption(pill, option);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 text-[12px] rounded-lg transition-colors cursor-pointer text-left ${
                                    isSelected
                                      ? "bg-gray-100 font-semibold text-gray-900"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <span>{option}</span>
                                  <span
                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? "bg-gray-900 border-gray-900 text-white"
                                        : "border-gray-300 bg-white"
                                    }`}
                                  >
                                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {selectedInPill.length > 0 && (
                            <div className="pt-2 mt-1.5 border-t border-gray-100 flex items-center justify-between px-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearPillFilter(pill);
                                }}
                                className="text-[11px] text-gray-500 hover:text-gray-900 underline cursor-pointer"
                              >
                                Clear
                              </button>
                              <span className="text-[11px] text-gray-400">
                                {selectedInPill.length} selected
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Product Grid ── */}
        <div className="max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-14 pt-8 pb-24">

          <div
            key={activeTab}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            {sorted.map((product, idx) => {
              const isWishlisted = wishlistItems.some(
                (i) => i.productId === product.id
              );

              return (
                <div
                  key={product.id}
                  className="group animate-grid-item"
                  style={{ animationDelay: `${Math.min(idx * 35, 280)}ms` }}
                >
                  {/* Image */}
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

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.isNew && (
                        <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-[9px] tracking-[0.2em] font-semibold px-2 py-0.5 rounded-[2px] uppercase shadow-sm">
                          New
                        </span>
                      )}
                      {product.isBestSeller && (
                        <span className="bg-[#f2b8a0]/95 backdrop-blur-sm text-[#3b2a25] text-[9px] tracking-[0.2em] font-semibold px-2 py-0.5 rounded-[2px] uppercase shadow-sm">
                          Best Seller
                        </span>
                      )}
                    </div>

                    {/* Wishlist */}
                    <button
                      onClick={(e) => toggleWishlist(product, e)}
                      aria-label="Wishlist"
                      className={`absolute bottom-3 right-3 p-2 rounded-full transition-all shadow-sm cursor-pointer ${
                        isWishlisted
                          ? "bg-white text-red-500"
                          : "bg-white/70 hover:bg-white text-gray-800 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Info */}
                  <Link
                    href={`/products/${product.id}`}
                    className="font-editorial-serif text-sm sm:text-[15px] text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 block leading-snug"
                  >
                    {product.name}
                  </Link>
                  <p className="font-editorial-serif text-xs sm:text-sm text-gray-700 mt-1 font-medium">
                    {product.price}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-editorial-serif text-2xl text-gray-400 mb-2">No items found</p>
              <p className="text-xs text-gray-400 mb-6">
                {activeFilterCount > 0 ? "Try adjusting or clearing your filters" : "Try a different filter"}
              </p>
              <button
                onClick={() => {
                  if (activeFilterCount > 0) {
                    clearAllFilters();
                  } else {
                    handleTabChange("all");
                  }
                }}
                className="text-xs uppercase tracking-wider font-semibold border border-gray-300 hover:border-gray-900 px-6 py-2.5 rounded-[2px] transition-colors cursor-pointer"
              >
                {activeFilterCount > 0 ? "Clear Filters" : "View All"}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────
   PAGE EXPORT — wrapped in Suspense for useSearchParams
   ───────────────────────────────────────────── */
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    }>
      <ProductsPageInner />
    </Suspense>
  );
}
