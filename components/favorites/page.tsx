"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWishlistStore, WishlistItem } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import {
  User,
  X,
  Share2,
  MoreVertical,
  ShoppingBag,
  Trash2,
  Check,
  Heart,
} from "lucide-react";

interface FavoritesPageProps {
  onClose?: () => void;
  isModal?: boolean;
}

export default function FavoritesPage({
  onClose,
  isModal = true,
}: FavoritesPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const closeWishlist = useWishlistStore((s) => s.closeWishlist);
  const addItemToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeWishlist();
      if (!isModal) router.push("/");
    }
  };

  const handleContinueShopping = () => {
    handleClose();
    router.push("/products");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    addItemToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      stock: 10,
      slug: item.slug || item.productId,
    });
    openCart();
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={
        isModal
          ? "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-[2px] animate-fade-in"
          : "min-h-screen flex items-center justify-center p-3 sm:p-6 bg-gray-100"
      }
      onClick={(e) => {
        if (e.target === e.currentTarget && isModal) handleClose();
      }}
    >
      {/* ── Modal Dialog Container ── */}
      <div
        className="relative w-full max-w-[840px] bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col min-h-[500px] sm:min-h-[560px] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Dark Charcoal Header Bar ── */}
        <div className="bg-[#383d49] text-white px-5 sm:px-6 py-2 flex items-center justify-end gap-5 select-none">
          {/* User status */}
          <div className="flex items-center gap-1.5 text-xs text-gray-200">
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-3 h-3 text-gray-200" />
            </div>
            <span className="text-[12px] font-normal tracking-wide">
              {session?.user?.name || session?.user?.email ? (
                <span className="text-gray-100">
                  {session.user.name || session.user.email}
                </span>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  Guest Shopper
                </Link>
              )}
            </span>
          </div>

          {/* Close X Button */}
          <button
            onClick={handleClose}
            aria-label="Close wishlist"
            className="text-gray-300 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Inner Modal Content ── */}
        <div className="p-6 sm:p-10 flex-1 flex flex-col justify-between">
          {/* Header row inside modal */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] sm:text-[19px] font-medium text-gray-800 tracking-wide">
                My Wishlist {items.length > 0 && `(${items.length})`}
              </h2>

              <div className="flex items-center gap-2 relative">
                {/* Share Button */}
                <button
                  onClick={handleShare}
                  title="Share Wishlist"
                  className="border border-gray-200 hover:border-gray-400 p-1.5 rounded text-gray-600 hover:text-gray-900 transition-colors relative"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  {copied && (
                    <span className="absolute -bottom-8 right-0 bg-[#383d49] text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>

                {/* More vertical menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    title="More options"
                    className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors rounded"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 shadow-xl rounded-md py-1 z-30 text-xs text-gray-700">
                      <button
                        onClick={() => {
                          handleShare();
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        Copy Wishlist Link
                      </button>
                      {items.length > 0 && (
                        <button
                          onClick={() => {
                            clearWishlist();
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          Clear All Items
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Thin divider line */}
            <div className="border-b border-gray-100 mt-3 sm:mt-4 mb-6 sm:mb-8" />
          </div>

          {/* ── Body: Empty Wishlist vs Populated List ── */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-6 sm:py-12 px-2">
              <h3 className="text-[17px] sm:text-[19px] font-bold text-[#2d3748] mb-3 sm:mb-4 tracking-tight">
                Love It? Add To My Wishlist
              </h3>

              <p className="text-[12px] sm:text-[13.5px] text-gray-500 max-w-[540px] leading-relaxed mb-7 sm:mb-8 font-normal">
                My Wishlist allows you to keep track of all of your favorites
                and shopping activity whether you&apos;re on your computer,
                phone, or tablet. You won&apos;t have to waste time searching all
                over again for that item you loved on your phone the other day -
                it&apos;s all here in one place!
              </p>

              <button
                onClick={handleContinueShopping}
                className="bg-[#383d49] hover:bg-[#2a2e37] text-white text-xs sm:text-[13px] font-medium tracking-wider px-7 py-3 rounded transition-colors shadow-sm cursor-pointer"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto max-h-[380px] pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="group relative border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow flex flex-col justify-between bg-white"
                  >
                    <Link
                      href={`/products/${item.slug || item.productId}`}
                      onClick={handleClose}
                      className="relative aspect-square w-full rounded overflow-hidden mb-3 bg-gray-50 block cursor-pointer"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeItem(item.productId);
                        }}
                        title="Remove item"
                        className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white text-gray-600 hover:text-red-600 rounded-full shadow-sm transition-colors cursor-pointer z-10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </Link>

                    <div>
                      <Link
                        href={`/products/${item.slug || item.productId}`}
                        onClick={handleClose}
                        className="text-xs font-medium text-gray-800 line-clamp-1 mb-1 hover:text-[#f2b8a0] transition-colors block"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs font-semibold text-gray-900 mb-3">
                        £{item.price.toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-[#383d49] hover:bg-[#2a2e37] text-white text-[11px] font-medium py-2 rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom spacer / action if items exist */}
          {items.length > 0 && (
            <div className="pt-6 border-t border-gray-100 mt-4 flex items-center justify-between">
              <button
                onClick={handleContinueShopping}
                className="text-xs text-gray-600 hover:text-black font-medium underline underline-offset-2"
              >
                Continue shopping
              </button>
              <button
                onClick={clearWishlist}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}