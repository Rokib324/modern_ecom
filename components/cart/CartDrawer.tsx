"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useSearchStore } from "@/store/searchStore";
import {
  X,
  Package,
  Plus,
  Minus,
  ShoppingBag,
  Search,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 5000.0;

interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category?: { name: string; slug: string } | string;
}

const POPULAR_SEARCHES = [
  "Pyjama Sets",
  "Nightdresses",
  "Satin Pyjamas",
  "Floral Prints",
  "Kids Sleepwear",
  "Cotton Pyjamas",
];

const QUICK_CATEGORIES = [
  { label: "New In", href: "/products?category=new" },
  { label: "Womens", href: "/products?category=womens" },
  { label: "Mens", href: "/products?category=mens" },
  { label: "Kids", href: "/products?category=kids" },
  { label: "Home & Accessories", href: "/products?category=home" },
];

const FALLBACK_PRODUCTS: SearchProduct[] = [
  {
    _id: "demo-1",
    name: "Silver Grey with Pink Lace Trim Satin Cap Sleeve Nightdress",
    slug: "silver-grey-pink-lace-trim-nightdress",
    price: 48.0,
    images: ["/images/newin_silver_nightdress.jpg"],
    category: { name: "Womens", slug: "womens" },
  },
  {
    _id: "demo-2",
    name: "Autumn Floral Long Sleeve Pyjama Set",
    slug: "autumn-floral-pyjama-set",
    price: 52.0,
    images: ["/images/newin_autumn_floral_set.jpg"],
    category: { name: "Womens", slug: "womens" },
  },
  {
    _id: "demo-3",
    name: "Ivory Floral Print Dressing Gown",
    slug: "ivory-floral-dressing-gown",
    price: 58.0,
    images: ["/images/newin_ivory_gown.jpg"],
    category: { name: "Womens", slug: "womens" },
  },
  {
    _id: "demo-4",
    name: "Classic Cotton Striped Pyjama Set",
    slug: "classic-cotton-striped-pyjamas",
    price: 45.0,
    images: ["/images/collection_striped_pyjamas.jpg"],
    category: { name: "Womens", slug: "womens" },
  },
  {
    _id: "demo-5",
    name: "Kids Animal & Floral Soft Cotton Pyjamas",
    slug: "kids-cotton-pyjamas",
    price: 34.0,
    images: ["/images/kids_pyjamas.jpg"],
    category: { name: "Kids", slug: "kids" },
  },
  {
    _id: "demo-6",
    name: "Mens Premium Cotton Nightwear Set",
    slug: "mens-cotton-nightwear",
    price: 49.0,
    images: ["/images/mens_nightwear.jpg"],
    category: { name: "Mens", slug: "mens" },
  },
];

function CartDrawer() {
  const router = useRouter();

  // Cart store selectors
  const items = useCartStore((s) => s.items);
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalItemsCount = useCartStore((s) => s.totalItems());
  const totalPriceVal = useCartStore((s) => s.totalPrice());
  const addItemToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  // Search store selectors
  const isSearchOpen = useSearchStore((s) => s.isSearchOpen);
  const closeSearch = useSearchStore((s) => s.closeSearch);
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const clearQuery = useSearchStore((s) => s.clearQuery);

  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Search state
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isOpen = isCartOpen || isSearchOpen;
  const isSearchMode = isSearchOpen;

  const handleClose = useCallback(() => {
    if (isCartOpen) closeCart();
    if (isSearchOpen) closeSearch();
  }, [isCartOpen, isSearchOpen, closeCart, closeSearch]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll smoothly without forced reflow or layout jumps
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (isSearchMode) {
        const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
        return () => clearTimeout(timer);
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isSearchMode]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Live search debounced fetch
  const fetchProducts = useCallback(async (searchTerm: string) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await fetch(
        `/api/products?search=${encodeURIComponent(term)}&limit=6`
      );
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setSearchResults(data.data);
      } else {
        const matches = FALLBACK_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.slug.toLowerCase().includes(term) ||
            (typeof p.category === "object" &&
              p.category?.name.toLowerCase().includes(term))
        );
        setSearchResults(matches);
      }
    } catch {
      const matches = FALLBACK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.slug.toLowerCase().includes(term)
      );
      setSearchResults(matches);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSearchMode) return;
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchProducts(query);
      } else {
        setSearchResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isSearchMode, fetchProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      closeSearch();
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectPopularSearch = (term: string) => {
    setQuery(term);
    fetchProducts(term);
  };

  const handleAddSearchProductToCart = (
    e: React.MouseEvent,
    product: SearchProduct
  ) => {
    e.preventDefault();
    e.stopPropagation();
    addItemToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/images/newin_silver_nightdress.jpg",
      quantity: 1,
      stock: 10,
      slug: product.slug || product._id,
    });
    closeSearch();
    openCart();
  };

  if (!isMounted) return null;

  const currentTotal = totalPriceVal;
  const subtotal = currentTotal + (giftWrapping ? 150 : 0);
  const discountedSubtotal = discountApplied ? subtotal * 0.9 : subtotal;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountCode.trim()) {
      setDiscountApplied(true);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[99999] h-[100dvh] w-screen overflow-hidden transition-all duration-300 ${
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
      aria-hidden={!isOpen}
    >
      {/* ── High-performance Backdrop (No heavy blur filter) ── */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 h-full w-full bg-black/40 transition-opacity duration-300 ease-out will-change-[opacity] ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ── GPU-accelerated Slide-in Drawer ── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={isSearchMode ? "Search drawer" : "Shopping Cart"}
        className={`fixed top-0 right-0 bottom-0 z-10 w-full sm:w-[480px] md:w-[520px] lg:w-[560px] h-[100dvh] bg-white shadow-2xl flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isSearchMode ? (
          /* ══════════════════════════════════════════
             SEARCH DRAWER MODE
             ══════════════════════════════════════════ */
          <>
            {/* Top Close Button Row */}
            <div className="flex-shrink-0 px-6 sm:px-8 pt-5 pb-2 flex items-center justify-end">
              <button
                onClick={closeSearch}
                aria-label="Close search"
                className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-700 hover:text-black transition-colors"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Search Input Field */}
            <div className="flex-shrink-0 px-6 sm:px-8 pb-4">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center gap-3 border-b-2 border-gray-900 pb-2.5">
                  <Search className="w-5 h-5 text-gray-500 flex-shrink-0 stroke-[1.75]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 text-base sm:text-[17px] focus:outline-none font-sans"
                  />
                  {searchLoading ? (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" />
                  ) : query ? (
                    <button
                      type="button"
                      onClick={clearQuery}
                      className="text-gray-400 hover:text-gray-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
              </form>
            </div>

            {/* Middle Scrollable Search Results / Suggestions */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-4 space-y-6">
              {query.trim() ? (
                /* Live Search Results */
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                      {searchLoading
                        ? "Searching..."
                        : searchResults.length > 0
                        ? `Results (${searchResults.length})`
                        : "No results found"}
                    </p>
                    {searchResults.length > 0 && (
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs text-gray-700 hover:text-black underline underline-offset-2 flex items-center gap-1 font-medium"
                      >
                        View all <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="space-y-3.5 divide-y divide-gray-100">
                      {searchResults.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => {
                            closeSearch();
                            router.push(
                              `/products/${product.slug || product._id}`
                            );
                          }}
                          className="pt-3.5 first:pt-0 flex gap-4 items-center group cursor-pointer hover:bg-gray-50/80 p-2 rounded-lg transition-colors"
                        >
                          <div className="relative w-16 h-18 sm:w-18 sm:h-20 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                            <Image
                              src={
                                product.images?.[0] ||
                                "/images/newin_silver_nightdress.jpg"
                              }
                              alt={product.name}
                              fill
                              sizes="80px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-[#f2b8a0] transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              ৳{product.price.toLocaleString("en-BD")}
                            </p>
                          </div>
                          <button
                            onClick={(e) =>
                              handleAddSearchProductToCart(e, product)
                            }
                            title="Add to cart"
                            className="p-2 rounded-full bg-gray-100 hover:bg-[#f2b8a0] text-gray-700 hover:text-[#3b2a25] transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !searchLoading && (
                      <div className="py-12 text-center text-gray-500 space-y-3">
                        <p className="text-sm">
                          No products found matching &ldquo;
                          <span className="font-semibold text-gray-800">
                            {query}
                          </span>
                          &rdquo;
                        </p>
                        <p className="text-xs text-gray-400">
                          Try checking for spelling errors or try different
                          keywords
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                /* Suggested / Popular Searches */
                <div className="space-y-6">
                  {/* Popular Searches */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#f2b8a0]" />
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSelectPopularSearch(term)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-full transition-colors font-medium"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Categories */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
                      Browse Categories
                    </h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {QUICK_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.label}
                          href={cat.href}
                          onClick={closeSearch}
                          className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-300 hover:bg-gray-50/50 transition-all text-xs font-medium text-gray-700"
                        >
                          <span>{cat.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fixed Footer Search Button */}
            <div className="flex-shrink-0 border-t border-gray-100 px-6 sm:px-8 py-4 bg-white">
              <button
                onClick={handleSearchSubmit}
                disabled={!query.trim()}
                className="w-full bg-[#383d49] hover:bg-[#2c323e] disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs sm:text-sm font-semibold tracking-wider py-3 rounded transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search Products
              </button>
            </div>
          </>
        ) : (
          /* ══════════════════════════════════════════
             CART DRAWER MODE
             ══════════════════════════════════════════ */
          <>
            {/* Drawer Header */}
            <header className="flex-shrink-0 px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-white z-20">
              <h2 className="font-editorial text-2xl sm:text-[25px] text-gray-900 font-normal tracking-tight flex items-baseline gap-1.5">
                <span>Your cart</span>
                <sup className="text-xs font-sans-ui font-medium text-gray-700 top-[-0.6em]">
                  {totalItemsCount}
                </sup>
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close cart drawer"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 hover:text-black transition-colors"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </header>

            {/* Middle Scrollable Cart Items Container */}
            <main className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Free Shipping Progress Notification */}
              <div className="bg-[#f7f7f7] rounded-[3px] p-3.5 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs sm:text-[13px] text-gray-800 font-sans-ui">
                  <Package className="w-4 h-4 stroke-[1.5]" />
                  <span>
                    {amountToFreeShipping > 0 ? (
                      <>
                        Only{" "}
                        <strong className="font-semibold text-gray-900">
                          ৳{amountToFreeShipping.toLocaleString("en-BD")}
                        </strong>{" "}
                        away from free shipping!
                      </>
                    ) : (
                      <strong className="font-semibold text-green-700">
                        🎉 You unlocked FREE standard shipping!
                      </strong>
                    )}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all duration-300 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              {items.length === 0 ? (
                <div className="py-20 text-center text-gray-500 space-y-4">
                  <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 stroke-[1.2]" />
                  <p className="font-editorial text-lg text-gray-800">
                    Your cart is empty
                  </p>
                  <button
                    onClick={closeCart}
                    className="font-sans-ui inline-block bg-[#f2b8a0] text-[#3b2a25] text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-[2px]"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5 divide-y divide-gray-100">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="pt-4 first:pt-0 flex gap-4 items-start"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-22 h-26 sm:w-24 sm:h-28 flex-shrink-0 bg-[#faf8f5] rounded-[3px] overflow-hidden">
                        <Image
                          src={
                            item.image || "/images/newin_silver_nightdress.jpg"
                          }
                          alt={item.name}
                          fill
                          sizes="100px"
                          className="object-cover object-center"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-1">
                        <div>
                          <h3 className="font-editorial text-[14px] sm:text-[15px] text-gray-900 leading-snug font-normal">
                            {item.name}
                          </h3>
                          <p className="font-sans-ui text-xs text-gray-500 mt-1">
                            Grey / M / 12
                          </p>
                        </div>

                        {/* Quantity & Price */}
                        <div className="pt-2 flex items-center justify-between">
                          <div className="flex items-center border border-gray-200 rounded-[2px] overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-sans-ui text-xs px-2.5 font-medium text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <p className="font-editorial text-sm sm:text-base text-gray-900 font-normal">
                            ৳{(item.price * item.quantity).toLocaleString("en-BD")}
                          </p>
                        </div>

                        {/* Remove link */}
                        <div className="pt-1 text-right">
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="font-sans-ui text-[11px] sm:text-xs text-gray-800 underline underline-offset-2 hover:opacity-60 transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>

            {/* Fixed Footer Actions */}
            <footer className="flex-shrink-0 border-t border-gray-100 px-6 py-4 bg-white space-y-3.5 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] z-20">
              {/* Discount Code Form */}
              <form onSubmit={handleApplyDiscount} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="font-sans-ui flex-1 border border-gray-300 rounded-[3px] px-3.5 py-1.5 text-xs sm:text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                />
                <button
                  type="submit"
                  className="font-sans-ui border border-[#f2b8a0] hover:bg-[#f2b8a0] text-[#3b2a25] px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-[3px] transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Gift Wrapping Row */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-editorial text-base text-gray-900 font-normal">
                    Gift Wrapping
                  </span>
                  <span className="bg-[#e09121] text-white text-[10px] font-sans-ui font-bold px-2 py-0.5 rounded-[3px]">
                    from ৳150
                  </span>
                </div>
                <button
                  onClick={() => setGiftWrapping(!giftWrapping)}
                  aria-label="Add gift wrapping"
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    giftWrapping
                      ? "bg-[#3b2a25] text-white"
                      : "bg-[#fde9df] text-[#3b2a25] hover:bg-[#f2b8a0]"
                  }`}
                >
                  <Plus
                    className={`w-3.5 h-3.5 stroke-[2] transition-transform ${
                      giftWrapping ? "rotate-45" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Subtotal Row */}
              <div className="flex items-center justify-between pt-0.5">
                <span className="font-sans-ui text-sm sm:text-base text-gray-800 font-normal">
                  Subtotal
                </span>
                <span className="font-sans-ui text-sm sm:text-base text-gray-900 font-semibold">
                  ৳{discountedSubtotal.toLocaleString("en-BD")} BDT
                </span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="font-sans-ui block text-center w-full bg-[#f2b8a0] hover:bg-[#ebb098] text-[#3b2a25] text-sm tracking-wide font-medium py-3 rounded-[3px] shadow-sm hover:shadow transition-all duration-200 active:translate-y-0"
              >
                Checkout
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

export default memo(CartDrawer);
