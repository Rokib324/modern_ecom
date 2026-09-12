"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSearchStore } from "@/store/searchStore";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

const announcements = [
  "We Donate 20% of the Profits From our Kids Collection to our Chosen Charity!",
  "Free Shipping on Orders Over $75 — Shop Now",
  "New Arrivals Every Week — Explore the Latest Drops",
];

export interface MegaMenuItem {
  label: string;
  href: string;
}

export interface MegaMenuSection {
  title?: string;
  items: MegaMenuItem[];
}

export interface MegaMenuColumn {
  sections: MegaMenuSection[];
}

export interface MegaMenuConfig {
  label: string;
  href: string;
  bannerPosition: "left" | "right";
  bannerImage: string;
  bannerTitle?: string;
  bannerBtnText: string;
  bannerBtnHref: string;
  cardMaxWidth: string;
  columns: MegaMenuColumn[];
}

export const megaMenuData: MegaMenuConfig[] = [
  {
    label: "New In",
    href: "/products?category=new",
    bannerPosition: "left",
    bannerImage: "/images/nav/new_in.jpg",
    bannerTitle: "Newest Releases",
    bannerBtnText: "New In",
    bannerBtnHref: "/products?category=new",
    cardMaxWidth: "max-w-4xl",
    columns: [
      {
        sections: [
          {
            items: [{ label: "New In", href: "/products?category=new" }],
          },
        ],
      },
      {
        sections: [
          {
            items: [
              {
                label: "Matching Pyjamas",
                href: "/products?category=new&collection=matching-pyjamas",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "Womens",
    href: "/products?category=womens",
    bannerPosition: "right",
    bannerImage: "/images/nav/womens.jpg",
    bannerBtnText: "SHOP NOW",
    bannerBtnHref: "/products?category=womens",
    cardMaxWidth: "max-w-6xl",
    columns: [
      {
        sections: [
          {
            title: "Shop",
            items: [
              { label: "SALE", href: "/products?category=womens&sale=true" },
              { label: "New In", href: "/products?category=womens&filter=new" },
              {
                label: "Best Sellers",
                href: "/products?category=womens&filter=bestsellers",
              },
              {
                label: "Shop All Pyjama Sets",
                href: "/products?category=womens&type=pyjama-sets",
              },
              { label: "E-Gift Card", href: "/gift-cards" },
            ],
          },
          {
            title: "Shop by Style",
            items: [
              {
                label: "Traditional Long Pyjamas",
                href: "/products?category=womens&style=traditional-long",
              },
              {
                label: "Short Pyjamas",
                href: "/products?category=womens&style=short",
              },
              {
                label: "Oversized Pyjamas",
                href: "/products?category=womens&style=oversized",
              },
              {
                label: "Capri Pyjamas",
                href: "/products?category=womens&style=capri",
              },
              {
                label: "Dressing Gowns & Robes",
                href: "/products?category=womens&style=robes",
              },
              {
                label: "Nightdresses & Shirts",
                href: "/products?category=womens&style=nightdresses",
              },
              {
                label: "Separates",
                href: "/products?category=womens&style=separates",
              },
            ],
          },
        ],
      },
      {
        sections: [
          {
            title: "Shop by Fabric",
            items: [
              {
                label: "Cotton",
                href: "/products?category=womens&fabric=cotton",
              },
              {
                label: "Brushed Cotton",
                href: "/products?category=womens&fabric=brushed-cotton",
              },
              {
                label: "Cotton Voile",
                href: "/products?category=womens&fabric=cotton-voile",
              },
              {
                label: "Cotton Gauze",
                href: "/products?category=womens&fabric=cotton-gauze",
              },
              {
                label: "Satin",
                href: "/products?category=womens&fabric=satin",
              },
              {
                label: "Linen Blend",
                href: "/products?category=womens&fabric=linen-blend",
              },
            ],
          },
        ],
      },
      {
        sections: [
          {
            title: "Shop by Collection",
            items: [
              {
                label: "Animal & Feather Print Nightwear",
                href: "/products?category=womens&collection=animal-feather",
              },
              {
                label: "Striped Nightwear",
                href: "/products?category=womens&collection=striped",
              },
              {
                label: "Gingham & Checked Nightwear",
                href: "/products?category=womens&collection=gingham-checked",
              },
              {
                label: "Floral Nightwear",
                href: "/products?category=womens&collection=floral",
              },
              {
                label: "Matching Family Pyjamas",
                href: "/products?category=womens&collection=matching-family",
              },
              {
                label: "Bridal Party Pyjamas",
                href: "/products?category=womens&collection=bridal",
              },
              {
                label: "Maternity Pyjamas",
                href: "/products?category=womens&collection=maternity",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "Mens",
    href: "/products?category=mens",
    bannerPosition: "left",
    bannerImage: "/images/nav/mens.jpg",
    bannerTitle: "Shop Mens",
    bannerBtnText: "New In",
    bannerBtnHref: "/products?category=mens&filter=new",
    cardMaxWidth: "max-w-4xl",
    columns: [
      {
        sections: [
          {
            items: [
              {
                label: "Mens Pyjamas",
                href: "/products?category=mens&type=pyjamas",
              },
              { label: "Mens Robes", href: "/products?category=mens&type=robes" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            items: [
              {
                label: "Matching Family Pyjamas",
                href: "/products?category=mens&collection=matching-family",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "Kids",
    href: "/products?category=kids",
    bannerPosition: "right",
    bannerImage: "/images/nav/kids.jpg",
    bannerTitle: "Kids Collection",
    bannerBtnText: "New In",
    bannerBtnHref: "/products?category=kids&filter=new",
    cardMaxWidth: "max-w-4xl",
    columns: [
      {
        sections: [
          {
            items: [
              {
                label: "Kids Pyjamas",
                href: "/products?category=kids&type=pyjamas",
              },
              {
                label: "Tween Pyjamas & Nightwear",
                href: "/products?category=kids&type=tweens",
              },
            ],
          },
        ],
      },
      {
        sections: [
          {
            items: [
              {
                label: "Matching Family Pyjamas",
                href: "/products?category=kids&collection=matching-family",
              },
              {
                label: "All Kids & Tweens",
                href: "/products?category=kids&filter=all",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "Home & Accessories",
    href: "/products?category=home",
    bannerPosition: "right",
    bannerImage: "/images/nav/home.jpg",
    bannerTitle: "Shop Accessories",
    bannerBtnText: "Discover",
    bannerBtnHref: "/products?category=home",
    cardMaxWidth: "max-w-4xl",
    columns: [
      {
        sections: [
          {
            title: "Accessories",
            items: [
              {
                label: "Make-up Bags",
                href: "/products?category=home&sub=make-up-bags",
              },
              {
                label: "Eye Masks",
                href: "/products?category=home&sub=eye-masks",
              },
              {
                label: "Shower Caps",
                href: "/products?category=home&sub=shower-caps",
              },
              {
                label: "Scrunchies",
                href: "/products?category=home&sub=scrunchies",
              },
              {
                label: "Scarves",
                href: "/products?category=home&sub=scarves",
              },
            ],
          },
        ],
      },
      {
        sections: [
          {
            title: "Homeware",
            items: [
              {
                label: "Duvet Sets",
                href: "/products?category=home&sub=duvet-sets",
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/register";

  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems);
  const openCart = useCartStore((s) => s.openCart);
  const openWishlist = useWishlistStore((s) => s.openWishlist);
  const totalWishlistItems = useWishlistStore((s) => s.totalItems);
  const openSearch = useSearchStore((s) => s.openSearch);

  const [menuOpen, setMenuOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(135);

  const headerRef = useRef<HTMLElement>(null);
  const navbarWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Measure and update header height for backdrop positioning
  const updateHeaderHeight = useCallback(() => {
    if (navbarWrapperRef.current) {
      const rect = navbarWrapperRef.current.getBoundingClientRect();
      setHeaderHeight(rect.height);
    }
  }, []);

  useEffect(() => {
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, [updateHeaderHeight]);

  useEffect(() => {
    if (isAuthPage) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        headerRef.current &&
        !headerRef.current.contains(target) &&
        dropdownCardRef.current &&
        !dropdownCardRef.current.contains(target)
      ) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setMenuOpen(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthPage]);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMenuOpen(false);
  }, [pathname]);

  if (isAuthPage) return null;

  // Solid white state condition (solid when scrolled, hovered, mobile open, or mega-menu open)
  const isSolid =
    !isHome ||
    isScrolled ||
    isHovered ||
    menuOpen ||
    activeDropdown !== null;

  const prevAnnouncement = () =>
    setAnnouncementIndex((i) =>
      i === 0 ? announcements.length - 1 : i - 1
    );
  const nextAnnouncement = () =>
    setAnnouncementIndex((i) => (i + 1) % announcements.length);

  const toggleDropdown = (label: string) => {
    setActiveDropdown((prev) => (prev === label ? null : label));
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setMenuOpen(false);
  };

  const activeMenuConfig = megaMenuData.find(
    (item) => item.label === activeDropdown
  );

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500;1,600;1,700&family=Great+Vibes&family=Josefin+Sans:wght@300;400;500;600&display=swap');
        .font-logo { font-family: 'Great Vibes', cursive; }
        .font-nav  { font-family: 'Josefin Sans', sans-serif; }
        .font-banner-serif { font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; }
      `}</style>

      {/* ── Fixed Navbar Wrapper ── */}
      <div
        ref={navbarWrapperRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      >
        {/* ── Announcement Bar ── */}
        <div className="font-nav bg-[#f2b8a0] text-[#3b2a25] text-xs sm:text-sm tracking-wide shadow-sm select-none">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 py-2.5 relative">
            <button
              onClick={prevAnnouncement}
              aria-label="Previous announcement"
              className="absolute left-4 p-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-center px-8 sm:px-0 font-medium">
              {announcements[announcementIndex]}
            </span>
            <button
              onClick={nextAnnouncement}
              aria-label="Next announcement"
              className="absolute right-4 p-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Main Navbar Header ── */}
        <header
          ref={headerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`transition-colors duration-300 ease-in-out ${
            isSolid ? "bg-white shadow-md" : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="flex items-center justify-between h-[88px] lg:h-[96px]">

              {/* ── Logo ── */}
              <Link
                href="/"
                onClick={closeAll}
                className="font-logo flex flex-col items-center leading-none select-none py-1 group/logo"
                style={{ textDecoration: "none" }}
              >
                {/* Crown SVG */}
                <svg
                  className={`w-5 h-5 mb-0.5 transition-all duration-300 group-hover/logo:scale-110 ${
                    isSolid ? "text-gray-800" : "text-white drop-shadow"
                  }`}
                  viewBox="0 0 24 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 14 L6 4 L12 10 L18 4 L22 14 Z" />
                  <line x1="2" y1="14" x2="22" y2="14" />
                </svg>
                <span
                  className={`text-[2.25rem] lg:text-[2.5rem] leading-none transition-colors duration-300 ${
                    isSolid ? "text-gray-900" : "text-white drop-shadow-md"
                  }`}
                >
                  Veronne
                </span>
              </Link>

              {/* ── Desktop Nav Links ── */}
              <nav className="font-nav hidden lg:flex items-center gap-1.5 xl:gap-2.5">
                {megaMenuData.map(({ label }) => {
                  const isOpen = activeDropdown === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleDropdown(label)}
                      className={`group/navlink relative flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-normal tracking-wide transition-colors duration-200 cursor-pointer ${
                        isSolid
                          ? isOpen
                            ? "text-gray-950 font-medium"
                            : "text-gray-700 hover:text-gray-950"
                          : isOpen
                            ? "text-white font-medium"
                            : "text-white/95 hover:text-white drop-shadow-sm"
                      }`}
                    >
                      <span className="relative inline-block">
                        {label}
                        {/* Active underline matching reference screenshot */}
                        {isOpen && (
                          <span
                            className={`absolute -bottom-1 left-0 right-0 h-[2px] transition-all duration-200 ${
                              isSolid ? "bg-gray-900" : "bg-white"
                            }`}
                          />
                        )}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        } ${isSolid ? "text-gray-600" : "text-white/80"}`}
                      />
                    </button>
                  );
                })}
              </nav>

              {/* ── Action Icons ── */}
              <div className="flex items-center gap-0.5 sm:gap-1">
                {/* Search */}
                <button
                  onClick={() => {
                    closeAll();
                    openSearch();
                  }}
                  className={`p-2.5 rounded-full transition-colors duration-300 cursor-pointer ${
                    isSolid
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                      : "text-white/95 hover:text-white hover:bg-white/10 drop-shadow-sm"
                  }`}
                  aria-label="Open search"
                >
                  <Search className="w-[19px] h-[19px]" />
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => {
                    closeAll();
                    openWishlist();
                  }}
                  className={`relative p-2.5 rounded-full transition-colors duration-300 cursor-pointer ${
                    isSolid
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                      : "text-white/95 hover:text-white hover:bg-white/10 drop-shadow-sm"
                  }`}
                  aria-label="Open wishlist"
                >
                  <Heart className="w-[19px] h-[19px]" />
                  {mounted && totalWishlistItems() > 0 && (
                    <span className="font-nav absolute top-1 right-0.5 bg-[#f2b8a0] text-[#3b2a25] text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center leading-none shadow-sm">
                      {totalWishlistItems()}
                    </span>
                  )}
                </button>

                {/* Account */}
                {session ? (
                  <div className="relative group">
                    <button
                      className={`p-2.5 rounded-full transition-colors duration-300 cursor-pointer ${
                        isSolid
                          ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                          : "text-white/95 hover:text-white hover:bg-white/10 drop-shadow-sm"
                      }`}
                      aria-label="Account"
                    >
                      <User className="w-[19px] h-[19px]" />
                    </button>
                    <div className="font-nav absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 shadow-xl rounded-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-gray-800">
                      <p className="px-4 py-2 text-[11px] tracking-wider uppercase text-gray-400 border-b border-gray-100">
                        {session.user.email}
                      </p>
                      <Link
                        href="/account"
                        onClick={closeAll}
                        className="block px-4 py-2.5 text-[11px] tracking-wider uppercase text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/orders"
                        onClick={closeAll}
                        className="block px-4 py-2.5 text-[11px] tracking-wider uppercase text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        My Orders
                      </Link>
                      {session.user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={closeAll}
                          className="block px-4 py-2.5 text-[11px] tracking-wider uppercase text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        >
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          closeAll();
                          signOut();
                        }}
                        className="font-nav w-full text-left px-4 py-2.5 text-[11px] tracking-wider uppercase text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeAll}
                    className={`p-2.5 rounded-full transition-colors duration-300 ${
                      isSolid
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                        : "text-white/95 hover:text-white hover:bg-white/10 drop-shadow-sm"
                    }`}
                    aria-label="Sign in"
                  >
                    <User className="w-[19px] h-[19px]" />
                  </Link>
                )}

                {/* Cart */}
                <button
                  onClick={() => {
                    closeAll();
                    openCart();
                  }}
                  className={`relative p-2.5 rounded-full transition-colors duration-300 cursor-pointer ${
                    isSolid
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                      : "text-white/95 hover:text-white hover:bg-white/10 drop-shadow-sm"
                  }`}
                  aria-label="Open cart"
                >
                  <ShoppingBag className="w-[19px] h-[19px]" />
                  {mounted && totalItems() > 0 && (
                    <span className="font-nav absolute top-1 right-0.5 bg-[#f2b8a0] text-[#3b2a25] text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center leading-none shadow-sm">
                      {totalItems()}
                    </span>
                  )}
                </button>

                {/* Mobile hamburger */}
                <button
                  className={`lg:hidden p-2.5 rounded-full transition-colors duration-300 ml-1 cursor-pointer ${
                    isSolid
                      ? "text-gray-600 hover:text-gray-900"
                      : "text-white/95 hover:text-white drop-shadow-sm"
                  }`}
                  onClick={() => {
                    setActiveDropdown(null);
                    setMenuOpen(!menuOpen);
                  }}
                  aria-label="Toggle menu"
                >
                  {menuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Mobile Drawer ── */}
          {menuOpen && (
            <div className="font-nav lg:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto text-gray-800 shadow-2xl">
              {megaMenuData.map(({ label, href, columns }) => (
                <div key={label} className="border-b border-gray-50">
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-xs tracking-widest uppercase text-gray-800 font-medium cursor-pointer hover:bg-gray-50/80 transition-colors"
                    onClick={() =>
                      setMobileDropdown(
                        mobileDropdown === label ? null : label
                      )
                    }
                  >
                    <span>{label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileDropdown === label ? "rotate-180 text-gray-900" : "text-gray-400"
                      }`}
                    />
                  </button>
                  {mobileDropdown === label && (
                    <div className="bg-gray-50/70 px-5 py-3 space-y-4">
                      {columns.map((col, cIdx) => (
                        <div key={cIdx} className="space-y-3">
                          {col.sections.map((section, sIdx) => (
                            <div key={sIdx} className="space-y-1.5">
                              {section.title && (
                                <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 pt-1">
                                  {section.title}
                                </p>
                              )}
                              {section.items.map((item) => (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  className="block py-1.5 text-xs text-gray-600 hover:text-gray-950 transition-colors"
                                  onClick={closeAll}
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                      <div className="pt-2 border-t border-gray-200/50">
                        <Link
                          href={href}
                          onClick={closeAll}
                          className="inline-block text-xs font-semibold text-[#b86d4e] uppercase tracking-wider"
                        >
                          View All {label} &rarr;
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile auth */}
              <div className="px-5 py-4 border-t border-gray-100">
                {session ? (
                  <div className="space-y-3">
                    <p className="text-[11px] tracking-widest uppercase text-gray-400">
                      {session.user.email}
                    </p>
                    <Link
                      href="/account"
                      className="block text-xs tracking-widest uppercase text-gray-700"
                      onClick={closeAll}
                    >
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      className="block text-xs tracking-widest uppercase text-gray-700"
                      onClick={closeAll}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        closeAll();
                        signOut();
                      }}
                      className="block text-xs tracking-widest uppercase text-red-500 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block text-xs tracking-widest uppercase text-gray-700 font-medium"
                    onClick={closeAll}
                  >
                    Sign In / Register
                  </Link>
                )}
              </div>
            </div>
          )}
        </header>

        {/* ── Desktop Mega-Menu Drops ── */}
        {activeMenuConfig && (
          <div
            ref={dropdownCardRef}
            className="hidden lg:flex justify-center w-full px-4 pt-0 transition-all duration-300 pointer-events-none"
          >
            <div
              className={`pointer-events-auto bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-row w-full ${activeMenuConfig.cardMaxWidth} transition-all duration-200 animate-in fade-in-0 slide-in-from-top-1`}
              style={{ maxHeight: "calc(100vh - 160px)" }}
            >
              {/* Banner on Left (if configured) */}
              {activeMenuConfig.bannerPosition === "left" && (
                <div className="relative w-[340px] xl:w-[400px] shrink-0 overflow-hidden group/banner select-none bg-gray-100 flex items-stretch border-r border-gray-200">
                  <img
                    src={activeMenuConfig.bannerImage}
                    alt={activeMenuConfig.label}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/banner:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent pointer-events-none" />
                  <div className="absolute bottom-7 left-7 right-7 flex flex-col items-start z-10">
                    {activeMenuConfig.bannerTitle && (
                      <h3 className="font-banner-serif text-[26px] lg:text-[30px] text-white tracking-wide drop-shadow-md mb-3.5 font-normal leading-tight">
                        {activeMenuConfig.bannerTitle}
                      </h3>
                    )}
                    <Link
                      href={activeMenuConfig.bannerBtnHref}
                      onClick={closeAll}
                      className="inline-block bg-[#f2b8a0] hover:bg-[#e8a78e] active:scale-95 text-[#3b2a25] text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-[2px] transition-all shadow-md"
                    >
                      {activeMenuConfig.bannerBtnText}
                    </Link>
                  </div>
                </div>
              )}

              {/* Columns Section */}
              <div className="flex-1 flex flex-row divide-x divide-gray-200 bg-white">
                {activeMenuConfig.columns.map((col, colIdx) => {
                  const hasTitles = col.sections.some((s) => !!s.title);
                  return (
                    <div
                      key={colIdx}
                      className="flex-1 px-7 py-7 flex flex-col justify-start overflow-y-auto"
                    >
                      {col.sections.map((section, secIdx) => (
                        <div key={secIdx} className={secIdx > 0 ? "mt-5" : ""}>
                          {section.title && (
                            <h4 className="font-nav text-[14px] font-medium text-gray-900 mb-2.5 tracking-normal">
                              {section.title}
                            </h4>
                          )}
                          <ul className="space-y-1">
                            {section.items.map((item) => (
                              <li key={item.label}>
                                <Link
                                  href={item.href}
                                  onClick={closeAll}
                                  className={`font-nav transition-colors block leading-snug ${
                                    hasTitles
                                      ? "text-[13px] text-gray-600 hover:text-gray-950 py-0.5"
                                      : "text-[14px] text-gray-800 hover:text-black py-1 font-normal"
                                  }`}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* Banner on Right (if configured) */}
              {activeMenuConfig.bannerPosition === "right" && (
                <div className="relative w-[340px] xl:w-[400px] shrink-0 overflow-hidden group/banner select-none bg-gray-100 flex items-stretch border-l border-gray-200">
                  <img
                    src={activeMenuConfig.bannerImage}
                    alt={activeMenuConfig.label}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/banner:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent pointer-events-none" />
                  <div className="absolute bottom-7 left-7 right-7 flex flex-col items-start z-10">
                    {activeMenuConfig.bannerTitle && (
                      <h3 className="font-banner-serif text-[26px] lg:text-[30px] text-white tracking-wide drop-shadow-md mb-3.5 font-normal leading-tight">
                        {activeMenuConfig.bannerTitle}
                      </h3>
                    )}
                    <Link
                      href={activeMenuConfig.bannerBtnHref}
                      onClick={closeAll}
                      className="inline-block bg-[#f2b8a0] hover:bg-[#e8a78e] active:scale-95 text-[#3b2a25] text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-[2px] transition-all shadow-md"
                    >
                      {activeMenuConfig.bannerBtnText}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Dimmed Backdrop for Desktop Mega Dropdown ── */}
      {activeDropdown && (
        <div
          className="hidden lg:block fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 animate-in fade-in-0"
          style={{ top: `${headerHeight}px` }}
          onClick={() => setActiveDropdown(null)}
          aria-hidden="true"
        />
      )}

      {/* ── Spacer for non-home pages so content is not behind fixed navbar ── */}
      {!isHome && <div className="h-[125px] sm:h-[135px]" />}
    </>
  );
}
