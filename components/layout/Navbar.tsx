"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
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
import { useState } from "react";

const announcements = [
  "We Donate 20% of the Profits From our Kids Collection to our Chosen Charity!",
  "Free Shipping on Orders Over $75 — Shop Now",
  "New Arrivals Every Week — Explore the Latest Drops",
];

const navLinks = [
  {
    label: "New In",
    href: "/products?category=new",
    dropdown: ["New Arrivals", "Best Sellers", "Staff Picks"],
  },
  {
    label: "Womens",
    href: "/products?category=womens",
    dropdown: ["Tops", "Bottoms", "Dresses", "Outerwear"],
  },
  {
    label: "Mens",
    href: "/products?category=mens",
    dropdown: ["T-Shirts", "Trousers", "Jackets", "Accessories"],
  },
  {
    label: "Kids",
    href: "/products?category=kids",
    dropdown: ["Girls", "Boys", "Baby", "School"],
  },
  {
    label: "Home & Accessories",
    href: "/products?category=home",
    dropdown: ["Homewares", "Bags", "Jewellery", "Gifts"],
  },
];

export default function Navbar() {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems);
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  const prevAnnouncement = () =>
    setAnnouncementIndex((i) =>
      i === 0 ? announcements.length - 1 : i - 1
    );
  const nextAnnouncement = () =>
    setAnnouncementIndex((i) => (i + 1) % announcements.length);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Josefin+Sans:wght@300;400;500;600&display=swap');
        .font-logo { font-family: 'Great Vibes', cursive; }
        .font-nav  { font-family: 'Josefin Sans', sans-serif; }
      `}</style>

      {/* ── Announcement Bar ── */}
      <div className="font-nav bg-[#f2b8a0] text-[#3b2a25] text-xs sm:text-sm tracking-wide">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 py-2.5 relative">
          <button
            onClick={prevAnnouncement}
            aria-label="Previous announcement"
            className="absolute left-4 p-0.5 opacity-60 hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-center px-8 sm:px-0">
            {announcements[announcementIndex]}
          </span>
          <button
            onClick={nextAnnouncement}
            aria-label="Next announcement"
            className="absolute right-4 p-0.5 opacity-60 hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="font-logo flex flex-col items-center leading-none select-none"
              style={{ textDecoration: "none" }}
            >
              {/* Crown */}
              <svg
                className="w-5 h-5 mb-0.5 text-gray-700"
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
              <span className="text-[2rem] text-gray-800 leading-none">
                Ecom
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <nav
              className="font-nav hidden lg:flex items-center gap-1"
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {navLinks.map(({ label, href, dropdown }) => (
                <div
                  key={label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(label)}
                >
                  <Link
                    href={href}
                    className="flex items-center gap-0.5 px-3 py-2 text-[13px] font-medium tracking-wider uppercase text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {label}
                    <ChevronDown
                      className={`w-3 h-3 mt-0.5 transition-transform duration-200 ${
                        activeDropdown === label ? "rotate-180" : ""
                      }`}
                    />
                  </Link>

                  {/* Dropdown */}
                  {activeDropdown === label && (
                    <div className="absolute top-full left-0 mt-0 w-44 bg-white border border-gray-100 shadow-lg rounded-b-lg py-1 z-50 animate-fade-in">
                      {dropdown.map((item) => (
                        <Link
                          key={item}
                          href={`${href}&sub=${item
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="font-nav block px-4 py-2.5 text-xs tracking-wider uppercase text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* ── Action Icons ── */}
            <div className="flex items-center gap-0.5">
              {/* Search */}
              <Link
                href="/search"
                className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px]" />
              </Link>

              {/* Account */}
              {session ? (
                <div className="relative group">
                  <button
                    className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label="Account"
                  >
                    <User className="w-[18px] h-[18px]" />
                  </button>
                  <div className="font-nav absolute right-0 top-full mt-0 w-48 bg-white border border-gray-100 shadow-lg rounded-b-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <p className="px-4 py-2 text-[11px] tracking-wider uppercase text-gray-400 border-b border-gray-100">
                      {session.user.email}
                    </p>
                    <Link
                      href="/account"
                      className="block px-4 py-2.5 text-[11px] tracking-wider uppercase text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2.5 text-[11px] tracking-wider uppercase text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      My Orders
                    </Link>
                    {session.user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2.5 text-[11px] tracking-wider uppercase text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="font-nav w-full text-left px-4 py-2.5 text-[11px] tracking-wider uppercase text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Sign in"
                >
                  <User className="w-[18px] h-[18px]" />
                </Link>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {totalItems() > 0 && (
                  <span className="font-nav absolute top-1 right-0.5 bg-[#f2b8a0] text-[#3b2a25] text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {totalItems()}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 transition-colors ml-1"
                onClick={() => setMenuOpen(!menuOpen)}
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

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="font-nav lg:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
            {navLinks.map(({ label, href, dropdown }) => (
              <div key={label} className="border-b border-gray-50">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-xs tracking-widest uppercase text-gray-700 font-medium"
                  onClick={() =>
                    setMobileDropdown(
                      mobileDropdown === label ? null : label
                    )
                  }
                >
                  {label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileDropdown === label ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileDropdown === label && (
                  <div className="bg-gray-50 pb-2">
                    {dropdown.map((item) => (
                      <Link
                        key={item}
                        href={`${href}&sub=${item
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="block px-8 py-2.5 text-[11px] tracking-widest uppercase text-gray-500 hover:text-gray-900"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item}
                      </Link>
                    ))}
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
                    onClick={() => setMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    className="block text-xs tracking-widest uppercase text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="block text-xs tracking-widest uppercase text-red-500"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block text-xs tracking-widest uppercase text-gray-700 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
