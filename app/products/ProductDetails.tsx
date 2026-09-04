"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import {
  Heart,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Check,
  Truck,
  RotateCcw,
  Ruler,
  X,
  Sparkles,
} from "lucide-react";

interface ProductData {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  description: string;
  images: string[];
  category: string;
  sizes: string[];
  inStock: boolean;
  completeLook?: {
    id: string;
    name: string;
    price: number;
    priceFormatted: string;
    image: string;
    category: string;
  };
}

const CATALOG: Record<string, ProductData> = {
  "new-1": {
    id: "new-1",
    name: "Ivory Cami Short Pyjama Set with Blue Lace Trim Satin",
    price: 5800,
    priceFormatted: "৳5,800",
    description:
      "Our best-loved cami and shorts set returns in a dreamy ivory hue, accented with contrasting ice-blue scalloped lace trims. Cut from liquid-drape recycled satin with delicate adjustable straps and a comfortable elasticated waistband.",
    images: [
      "/images/newin_ivory_cami.jpg",
      "/images/newin_ivory_gown.jpg",
      "/images/newin_silver_nightdress.jpg",
      "/images/folded_cloths.jpg",
      "/images/collection_satin_pyjamas.jpg",
    ],
    category: "Womens",
    sizes: ["XS (6-8)", "S (8-10)", "M (12)", "L (14)", "XL (16)"],
    inStock: true,
    completeLook: {
      id: "new-2",
      name: "Ivory Satin Dressing Gown with Blue Lace Trim",
      price: 6200,
      priceFormatted: "৳6,200",
      image: "/images/newin_ivory_gown.jpg",
      category: "Womens",
    },
  },
  "new-2": {
    id: "new-2",
    name: "Ivory Satin Dressing Gown with Blue Lace Trim",
    price: 6200,
    priceFormatted: "৳6,200",
    description:
      "Wrap yourself in pure elegance with our kimono-style satin dressing gown. Beautifully framed by delicate blue eyelash lace at the cuffs and hem.",
    images: [
      "/images/newin_ivory_gown.jpg",
      "/images/newin_ivory_cami.jpg",
      "/images/featured_dressing_gowns.jpg",
      "/images/newin_silver_nightdress.jpg",
    ],
    category: "Womens",
    sizes: ["S (8-10)", "M (12)", "L (14)", "XL (16)"],
    inStock: true,
    completeLook: {
      id: "new-1",
      name: "Ivory Cami Short Pyjama Set with Blue Lace Trim",
      price: 5800,
      priceFormatted: "৳5,800",
      image: "/images/newin_ivory_cami.jpg",
      category: "Womens",
    },
  },
  "new-3": {
    id: "new-3",
    name: "Silver Grey with Pink Lace Trim Satin Cap Sleeve Nightdress",
    price: 5500,
    priceFormatted: "৳5,500",
    description:
      "Soft shimmering silver-grey satin nightdress featuring delicate pastel pink scalloped lace trim and comfortable cap sleeves.",
    images: [
      "/images/newin_silver_nightdress.jpg",
      "/images/newin_autumn_floral_cami.jpg",
      "/images/collection_nightdresses.jpg",
      "/images/newin_ivory_gown.jpg",
    ],
    category: "Womens",
    sizes: ["XS (6-8)", "S (8-10)", "M (12)", "L (14)", "XL (16)"],
    inStock: true,
    completeLook: {
      id: "new-2",
      name: "Ivory Satin Dressing Gown with Blue Lace Trim",
      price: 6200,
      priceFormatted: "৳6,200",
      image: "/images/newin_ivory_gown.jpg",
      category: "Womens",
    },
  },
  "best-1": {
    id: "best-1",
    name: "Classic Navy Striped Cotton Traditional Pyjama Set",
    price: 4500,
    priceFormatted: "৳4,500",
    description:
      "Crisp, breathable 100% woven cotton pyjama set featuring our signature tailored notch collar, contrast piped cuffs, and mother-of-pearl buttons.",
    images: [
      "/images/collection_striped_pyjamas.jpg",
      "/images/collection_cotton_pyjamas.jpg",
      "/images/folded_cloths.jpg",
      "/images/featured_gingham_lifestyle.jpg",
    ],
    category: "Womens",
    sizes: ["XS (6-8)", "S (8-10)", "M (12)", "L (14)", "XL (16)"],
    inStock: true,
    completeLook: {
      id: "new-3",
      name: "Silver Grey with Pink Lace Trim Satin Nightdress",
      price: 5500,
      priceFormatted: "৳5,500",
      image: "/images/newin_silver_nightdress.jpg",
      category: "Womens",
    },
  },
};

const RECOMMENDED_PRODUCTS = [
  {
    id: "new-1",
    name: "Ivory Cami Short Pyjama Set with Blue Lace Trim Satin",
    price: "৳5,800",
    numPrice: 5800,
    image: "/images/newin_ivory_cami.jpg",
    isNew: true,
  },
  {
    id: "new-2",
    name: "Classic Navy Striped Cotton Traditional Pyjama Set",
    price: "৳4,500",
    numPrice: 4500,
    image: "/images/collection_striped_pyjamas.jpg",
    isNew: false,
  },
  {
    id: "new-3",
    name: "Vintage Botanical Floral Cotton Nightdress",
    price: "৳4,200",
    numPrice: 4200,
    image: "/images/collection_nightdresses.jpg",
    isNew: false,
  },
  {
    id: "new-4",
    name: "Autumn Floral Satin Oversize Pyjama Set",
    price: "৳5,900",
    numPrice: 5900,
    image: "/images/newin_autumn_floral_set.jpg",
    isNew: true,
  },
  {
    id: "new-5",
    name: "Silk Touch Emerald Green Dressing Gown",
    price: "৳5,800",
    numPrice: 5800,
    image: "/images/featured_dressing_gowns.jpg",
    isNew: false,
  },
];

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = (params?.id as string) || "new-1";

  // Resolve Product
  const product: ProductData = useMemo(() => {
    if (CATALOG[productId]) return CATALOG[productId];
    // Fallback template
    return {
      id: productId,
      name:
        productId.includes("nightdress") || productId.includes("gown")
          ? "Silver Grey with Pink Lace Trim Satin Cap Sleeve Nightdress"
          : "Ivory Cami Short Pyjama Set with Blue Lace Trim Satin",
      price: 5800,
      priceFormatted: "৳5,800",
      description:
        "Our best-loved cami and shorts set returns in a dreamy ivory hue, accented with contrasting ice-blue scalloped lace trims. Cut from liquid-drape recycled satin with delicate adjustable straps and a comfortable elasticated waistband.",
      images: [
        "/images/newin_ivory_cami.jpg",
        "/images/newin_ivory_gown.jpg",
        "/images/newin_silver_nightdress.jpg",
        "/images/folded_cloths.jpg",
        "/images/collection_satin_pyjamas.jpg",
      ],
      category: "Womens",
      sizes: ["XS (6-8)", "S (8-10)", "M (12)", "L (14)", "XL (16)"],
      inStock: true,
      completeLook: {
        id: "new-2",
        name: "Ivory Satin Dressing Gown with Blue Lace Trim",
        price: 6200,
        priceFormatted: "৳6,200",
        image: "/images/newin_ivory_gown.jpg",
        category: "Womens",
      },
    };
  }, [productId]);

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("description");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showAllMedia, setShowAllMedia] = useState(false);
  const [hasAdded, setHasAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const buySectionRef = useRef<HTMLDivElement>(null);
  const recCarouselRef = useRef<HTMLDivElement>(null);

  // Cart & Wishlist stores
  const addItemToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const cartItems = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);
  const addWishlistItem = useWishlistStore((s) => s.addItem);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);

  const isWishlisted = wishlistItems.some((i) => i.productId === product.id);

  // Check if this product is already in the cart
  const isItemInCart = cartItems.some(
    (i) => i.productId === `${product.id}-${selectedSize}` || i.productId === product.id
  );

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeWishlistItem(product.id);
    } else {
      addWishlistItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        slug: product.id,
        category: product.category,
      });
    }
  };

  const handleAddToCart = () => {
    addItemToCart({
      productId: `${product.id}-${selectedSize}`,
      name: `${product.name} (${selectedSize})`,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      stock: 10,
      slug: product.id,
    });
    setHasAdded(true);
    openCart();
  };

  const handleAddMore = () => {
    addItemToCart({
      productId: `${product.id}-${selectedSize}`,
      name: `${product.name} (${selectedSize})`,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      stock: 10,
      slug: product.id,
    });
    openCart();
  };

  const handleAddCompleteLookToCart = () => {
    if (!product.completeLook) return;
    addItemToCart({
      productId: product.completeLook.id,
      name: product.completeLook.name,
      price: product.completeLook.price,
      image: product.completeLook.image,
      quantity: 1,
      stock: 10,
      slug: product.completeLook.id,
    });
    openCart();
  };

  // High-performance IntersectionObserver for sticky bar (zero scroll lag)
  useEffect(() => {
    const el = buySectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when the buy section is scrolled past the top
        setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { root: null, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollRecCarousel = (direction: "left" | "right") => {
    if (recCarouselRef.current) {
      const amount = recCarouselRef.current.clientWidth * 0.75;
      recCarouselRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  // Visible media count (initially 2, reveals all on "More media")
  const visibleImages = showAllMedia ? product.images : product.images.slice(0, 2);
  const remainingMediaCount = Math.max(0, product.images.length - 2);

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
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="w-full bg-white text-gray-900 pt-24 sm:pt-28 pb-16 font-sans-clean">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* ── Breadcrumb ── */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 py-3 mb-4">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link
              href="/products"
              className="hover:text-gray-900 transition-colors"
            >
              Womens
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-[240px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          {/* ═════════════════════════════════════════════════
              MAIN PRODUCT SECTION (2 COLUMNS: IMAGES + STICKY INFO)
             ═════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* ── Left Column: Stack of High-Res Product Photos ── */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              {visibleImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="relative w-full aspect-[3/4] bg-[#faf8f5] overflow-hidden rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
                >
                  <Image
                    src={imgSrc}
                    alt={`${product.name} - View ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center"
                  />
                  {idx === 0 && (
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-[2px] text-gray-900 text-[10px] tracking-[0.2em] font-semibold px-2.5 py-1 rounded-[2px] uppercase shadow-sm">
                      New
                    </span>
                  )}
                </div>
              ))}

              {/* ── More Media Button under Images ── */}
              {remainingMediaCount > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowAllMedia(!showAllMedia)}
                    className="w-full py-3.5 px-4 border border-gray-200 hover:border-gray-900 bg-[#faf8f5] hover:bg-white text-gray-900 text-xs sm:text-[13px] uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 rounded-[2px] cursor-pointer shadow-sm active:scale-[0.99]"
                  >
                    {showAllMedia ? (
                      <>
                        <ChevronUp className="w-4 h-4 text-gray-700" />
                        Show Less Media
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-gray-700" />
                        More Media + ({remainingMediaCount} additional views)
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* ── Right Column: Sticky Product Purchase Details ── */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              {/* Brand Header */}
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">
                  Their Nibs
                </p>
                <h1 className="font-editorial-serif text-2xl sm:text-3xl lg:text-[32px] text-gray-900 font-normal leading-tight">
                  {product.name}
                </h1>
                <p className="font-editorial-serif text-xl sm:text-2xl text-gray-900 font-normal pt-1">
                  {product.priceFormatted}
                </p>
              </div>

              {/* Klarna Installment Note */}
              <div className="bg-[#fcf8f5] border border-[#f2b8a0]/40 rounded-[2px] p-3 text-xs text-gray-700 flex items-center justify-between">
                <span>
                  Pay in 3 interest-free payments of{" "}
                  <strong>৳{Math.round(product.price / 3).toLocaleString("en-BD")}</strong> with
                </span>
                <span className="font-semibold bg-[#ffb3c7] text-[#333] px-1.5 py-0.5 rounded text-[11px]">
                  Klarna
                </span>
              </div>

              {/* Size Selector */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-900 font-semibold tracking-wide">
                    Size: <span className="font-normal text-gray-700">{selectedSize}</span>
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-gray-700 hover:text-black underline underline-offset-2 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Size guide
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 px-2 text-xs tracking-wider uppercase font-medium rounded-[2px] border transition-all text-center cursor-pointer ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-gray-200 hover:border-gray-400 text-gray-800 bg-white"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-gray-900 block tracking-wide">
                  Quantity
                </label>
                <div className="inline-flex items-center border border-gray-200 rounded-[2px] bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ── Action Buttons: Single Add to Bag vs (Add More & Checkout) ── */}
              <div ref={buySectionRef} className="pt-2">
                {hasAdded || isItemInCart ? (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-[2px]">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                      <span>Item added to your bag ({selectedSize})</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Button 1: Add More */}
                      <button
                        onClick={handleAddMore}
                        className="w-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 text-xs sm:text-[13px] font-semibold tracking-[0.16em] uppercase py-3.5 px-4 rounded-[2px] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
                      >
                        <Plus className="w-4 h-4" />
                        Add More
                      </button>

                      {/* Button 2: Checkout */}
                      <Link
                        href="/checkout"
                        className="w-full bg-[#f2b8a0] hover:bg-[#ebb098] text-[#3b2a25] text-xs sm:text-[13px] font-semibold tracking-[0.16em] uppercase py-3.5 px-4 rounded-[2px] shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-center active:scale-[0.99]"
                      >
                        <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                        Checkout
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#f2b8a0] hover:bg-[#ebb098] text-[#3b2a25] text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase py-3.5 px-6 rounded-[2px] shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                      Add To Bag
                    </button>

                    <button
                      onClick={handleToggleWishlist}
                      aria-label="Wishlist"
                      className={`w-12 h-12 flex items-center justify-center border rounded-[2px] transition-colors cursor-pointer ${
                        isWishlisted
                          ? "border-red-500 bg-red-50 text-red-500"
                          : "border-gray-200 hover:border-gray-900 text-gray-700 bg-white"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isWishlisted ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>

              {/* Complete The Look Section */}
              {product.completeLook && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-gray-900">
                    Complete The Look
                  </h3>
                  <div className="p-3 bg-[#faf8f5] border border-[#f2b8a0]/30 rounded-[2px] flex items-center gap-3.5">
                    <div className="relative w-14 h-18 bg-white rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={product.completeLook.image}
                        alt={product.completeLook.name}
                        fill
                        sizes="60px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-gray-900 truncate">
                        {product.completeLook.name}
                      </h4>
                      <p className="text-xs text-gray-600 font-editorial-serif mt-0.5">
                        {product.completeLook.priceFormatted}
                      </p>
                    </div>
                    <button
                      onClick={handleAddCompleteLookToCart}
                      className="text-[11px] uppercase tracking-wider font-semibold bg-white hover:bg-black hover:text-white border border-gray-300 text-gray-800 px-3 py-2 rounded-[2px] transition-colors flex-shrink-0 cursor-pointer"
                    >
                      Add To Bag
                    </button>
                  </div>
                </div>
              )}

              {/* Product Info Accordions */}
              <div className="pt-4 border-t border-gray-100 divide-y divide-gray-100">
                {/* Description Accordion */}
                <div>
                  <button
                    onClick={() =>
                      setOpenAccordion(
                        openAccordion === "description" ? null : "description"
                      )
                    }
                    className="w-full py-3.5 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-gray-900 cursor-pointer"
                  >
                    <span>Description</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openAccordion === "description" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openAccordion === "description" && (
                    <div className="pb-4 text-xs sm:text-[13px] text-gray-600 leading-relaxed space-y-2">
                      <p>{product.description}</p>
                      <ul className="list-disc pl-4 space-y-1 text-gray-500 pt-1">
                        <li>Delicate ice-blue scalloped lace trims</li>
                        <li>Fully adjustable spaghetti cami straps</li>
                        <li>High-waist shorts with soft stretch elastic waistband</li>
                        <li>Breathable, feather-light silky drape finish</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Details & Care Accordion */}
                <div>
                  <button
                    onClick={() =>
                      setOpenAccordion(
                        openAccordion === "details" ? null : "details"
                      )
                    }
                    className="w-full py-3.5 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-gray-900 cursor-pointer"
                  >
                    <span>Details &amp; Care</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openAccordion === "details" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openAccordion === "details" && (
                    <div className="pb-4 text-xs sm:text-[13px] text-gray-600 leading-relaxed space-y-1.5">
                      <p>
                        <strong>Material:</strong> 100% Recycled Polyester Liquid Satin
                      </p>
                      <p>
                        <strong>Care:</strong> Machine wash cold at 30°C on delicate cycle. Do not tumble dry. Cool iron on reverse.
                      </p>
                    </div>
                  )}
                </div>

                {/* Delivery & Returns Accordion */}
                <div>
                  <button
                    onClick={() =>
                      setOpenAccordion(
                        openAccordion === "delivery" ? null : "delivery"
                      )
                    }
                    className="w-full py-3.5 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-gray-900 cursor-pointer"
                  >
                    <span>Delivery &amp; Returns</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openAccordion === "delivery" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openAccordion === "delivery" && (
                    <div className="pb-4 text-xs sm:text-[13px] text-gray-600 leading-relaxed space-y-2">
                      <p className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#f2b8a0]" />
                        <strong>Free Bangladesh Standard Delivery</strong> on all orders over ৳5,000.
                      </p>
                      <p className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-[#f2b8a0]" />
                        <strong>30-Day Hassle-Free Returns:</strong> Easy refund or size exchange.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════
              RECOMMENDED FOR YOU CAROUSEL
             ═════════════════════════════════════════════════ */}
          <section className="mt-20 sm:mt-24 pt-12 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="font-editorial-serif text-2xl sm:text-3xl text-gray-900 font-normal">
                Recommended for you
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => scrollRecCarousel("left")}
                  aria-label="Previous recommendations"
                  className="p-2 border border-gray-200 hover:border-gray-900 rounded-full transition-colors cursor-pointer text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollRecCarousel("right")}
                  aria-label="Next recommendations"
                  className="p-2 border border-gray-200 hover:border-gray-900 rounded-full transition-colors cursor-pointer text-gray-800"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={recCarouselRef}
              className="flex items-start gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory"
            >
              {RECOMMENDED_PRODUCTS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/products/${item.id}`)}
                  className="flex-shrink-0 w-[240px] sm:w-[280px] snap-start group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] w-full rounded-[2px] overflow-hidden bg-[#faf8f5] mb-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="280px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.isNew && (
                      <span className="absolute top-3 left-3 bg-white/95 text-gray-900 text-[9px] tracking-[0.2em] font-semibold px-2 py-0.5 rounded-[2px] uppercase">
                        New
                      </span>
                    )}
                  </div>
                  <h3 className="font-editorial-serif text-sm sm:text-[15px] text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="font-editorial-serif text-xs sm:text-sm text-gray-700 mt-0.5">
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ═════════════════════════════════════════════════
              FOUNDER QUOTE EDITORIAL BANNER
             ═════════════════════════════════════════════════ */}
          <section className="my-20 sm:my-28 py-16 sm:py-20 text-center max-w-4xl mx-auto px-4">
            <blockquote className="font-editorial-serif text-2xl sm:text-3xl md:text-4xl text-gray-900 font-normal leading-relaxed italic">
              &ldquo;To put on your pair of pyjamas... like one of all day ones,
              but make you feel special that are made with uplifting fabrics and
              prints.&rdquo;
            </blockquote>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 font-semibold mt-6">
              — Founder &amp; Designer, Their Nibs
            </p>
          </section>

          {/* ═════════════════════════════════════════════════
              FOUNDERS / BRAND STORY HERO BANNER
             ═════════════════════════════════════════════════ */}
          <section className="relative rounded-[2px] overflow-hidden my-12 sm:my-16">
            <div className="relative h-[420px] sm:h-[480px] w-full">
              <Image
                src="/images/designers_duo.jpg"
                alt="Their Nibs Designers Duo"
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 sm:p-12 lg:p-16 text-white max-w-2xl">
                <p className="text-xs tracking-[0.25em] uppercase font-semibold text-[#f2b8a0] mb-2">
                  Our Story &amp; Heritage
                </p>
                <h2 className="font-editorial-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-tight mb-3">
                  Hand-painted prints designed with love in our London studio
                </h2>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-light">
                  Unique hand-crafted nightwear designed to bring comfort, color
                  and joy to everyday living. Every piece celebrates vintage
                  botanicals and bespoke artisan patterns.
                </p>
              </div>
            </div>
          </section>

          {/* ═════════════════════════════════════════════════
              3-COLUMN EDITORIAL HERITAGE CARDS (TEXT OVER IMAGE)
             ═════════════════════════════════════════════════ */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 my-16">
            {/* Card 1 */}
            <div className="group relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-[2px] bg-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <Image
                src="/images/featured_new_in.jpg"
                alt="Handmade Print"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:from-black/90 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-7 text-white z-10 text-center">
                <h3 className="font-editorial-serif text-xl sm:text-2xl text-white font-normal mb-2 drop-shadow-sm">
                  Handmade Prints
                </h3>
                <p className="text-xs text-gray-200 leading-relaxed font-light line-clamp-3">
                  Every unique print starts with hand-drawn sketches and
                  watercolour paintings crafted in our boutique London studio.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-[2px] bg-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <Image
                src="/images/folded_cloths.jpg"
                alt="Recycled Liquid Satin"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:from-black/90 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-7 text-white z-10 text-center">
                <h3 className="font-editorial-serif text-xl sm:text-2xl text-white font-normal mb-2 drop-shadow-sm">
                  Recycled Liquid Satin
                </h3>
                <p className="text-xs text-gray-200 leading-relaxed font-light line-clamp-3">
                  Silky, breathable drape woven from 100% recycled fibers that
                  soften with every wash for sustainable luxury.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-[2px] bg-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <Image
                src="/images/collection_cotton_pyjamas.jpg"
                alt="Ethical Craftsmanship"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:from-black/90 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-7 text-white z-10 text-center">
                <h3 className="font-editorial-serif text-xl sm:text-2xl text-white font-normal mb-2 drop-shadow-sm">
                  Ethical Craftsmanship
                </h3>
                <p className="text-xs text-gray-200 leading-relaxed font-light line-clamp-3">
                  Responsibly crafted with verified partners ensuring high-quality
                  artisan finishes and conscious production standards.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ═════════════════════════════════════════════════
            STICKY FLOATING MINI BOTTOM BAR (ON SCROLL)
           ═════════════════════════════════════════════════ */}
        <div
          className={`fixed bottom-0 inset-x-0 bg-white/98 border-t border-gray-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] z-40 transition-transform duration-300 transform-gpu will-change-transform py-3 px-4 sm:px-8 ${
            showStickyBar ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="max-w-[1480px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-11 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="50px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 hidden sm:block">
                <h4 className="text-xs font-medium text-gray-900 truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-600 font-editorial-serif">
                  {product.priceFormatted}
                </p>
              </div>
            </div>

            {hasAdded || isItemInCart ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleAddMore}
                  className="border border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-[2px] transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap bg-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add More
                </button>
                <Link
                  href="/checkout"
                  className="bg-[#f2b8a0] hover:bg-[#ebb098] text-[#3b2a25] text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" />
                  Checkout
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Size selector */}
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2.5 py-2 bg-white text-gray-800 focus:outline-none focus:border-black font-medium"
                >
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddToCart}
                  className="bg-[#f2b8a0] hover:bg-[#ebb098] text-[#3b2a25] text-xs font-semibold tracking-wider uppercase px-6 py-2.5 rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-[0.98]"
                >
                  <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" />
                  Add To Bag
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════
            SIZE GUIDE MODAL
           ═════════════════════════════════════════════════ */}
        {showSizeGuide && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowSizeGuide(false)}
          >
            <div
              className="bg-white rounded-lg max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-editorial-serif text-xl text-gray-900 font-normal">
                  Women&apos;s Size Guide
                </h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left divide-y divide-gray-200">
                  <thead>
                    <tr className="text-gray-500 uppercase tracking-wider">
                      <th className="py-2.5 pr-3">Size</th>
                      <th className="py-2.5 px-3">UK</th>
                      <th className="py-2.5 px-3">Bust (in)</th>
                      <th className="py-2.5 px-3">Waist (in)</th>
                      <th className="py-2.5 pl-3">Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr>
                      <td className="py-2.5 pr-3 font-semibold">XS</td>
                      <td className="py-2.5 px-3">6 - 8</td>
                      <td className="py-2.5 px-3">32 - 34</td>
                      <td className="py-2.5 px-3">25 - 27</td>
                      <td className="py-2.5 pl-3">35 - 37</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-semibold">S</td>
                      <td className="py-2.5 px-3">8 - 10</td>
                      <td className="py-2.5 px-3">34 - 36</td>
                      <td className="py-2.5 px-3">27 - 29</td>
                      <td className="py-2.5 pl-3">37 - 39</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-semibold">M</td>
                      <td className="py-2.5 px-3">12</td>
                      <td className="py-2.5 px-3">36 - 38</td>
                      <td className="py-2.5 px-3">29 - 31</td>
                      <td className="py-2.5 pl-3">39 - 41</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-semibold">L</td>
                      <td className="py-2.5 px-3">14</td>
                      <td className="py-2.5 px-3">38 - 40</td>
                      <td className="py-2.5 px-3">31 - 33</td>
                      <td className="py-2.5 pl-3">41 - 43</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-semibold">XL</td>
                      <td className="py-2.5 px-3">16</td>
                      <td className="py-2.5 px-3">40 - 42</td>
                      <td className="py-2.5 px-3">33 - 35</td>
                      <td className="py-2.5 pl-3">43 - 45</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-gray-500 italic pt-2">
                Our nightwear is cut for a relaxed, comfortable fit. If you prefer a closer fit, we recommend sizing down.
              </p>

              <button
                onClick={() => setShowSizeGuide(false)}
                className="w-full bg-[#383d49] hover:bg-[#2b303b] text-white text-xs font-semibold uppercase tracking-wider py-2.5 rounded transition-colors cursor-pointer"
              >
                Close Size Guide
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}