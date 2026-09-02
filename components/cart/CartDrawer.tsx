"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { X, Package, Plus, Minus, ShoppingBag } from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 60.0;

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalItems = useCartStore((s) => s.totalItems);
  const totalPrice = useCartStore((s) => s.totalPrice);

  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll smoothly without layout shifts
  useEffect(() => {
    if (isCartOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isMounted) return null;

  const currentTotal = totalPrice();
  const subtotal = currentTotal + (giftWrapping ? 7.95 : 0);
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
      className={`fixed inset-0 z-[99999] h-[100dvh] w-screen overflow-hidden ${
        isCartOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isCartOpen}
    >
      {/* Backdrop (Pure opacity transition, GPU optimized) */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 h-full w-full bg-black/40 transition-opacity duration-300 ease-out ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ── Slide-in Drawer (Hardware-accelerated translate3d) ── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={`fixed top-0 right-0 bottom-0 z-10 w-full sm:w-[460px] md:w-[480px] lg:w-[490px] h-[100dvh] bg-white shadow-2xl flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          willChange: "transform",
          transform: isCartOpen ? "translate3d(0, 0, 0)" : "translate3d(100%, 0, 0)",
        }}
      >
        {/* ── Drawer Header ── */}
        <header className="flex-shrink-0 px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-white z-20">
          <h2 className="font-editorial text-2xl sm:text-[25px] text-gray-900 font-normal tracking-tight flex items-baseline gap-1.5">
            <span>Your cart</span>
            <sup className="text-xs font-sans-ui font-medium text-gray-700 top-[-0.6em]">
              {totalItems()}
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

        {/* ── Middle Scrollable Items Container ── */}
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
                      £{amountToFreeShipping.toFixed(2)}
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
                      src={item.image || "/images/newin_silver_nightdress.jpg"}
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
                        £{(item.price * item.quantity).toFixed(2)}
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

        {/* ── Fixed Footer Actions (Always pinned to bottom) ── */}
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
                from £7.95
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
              £{discountedSubtotal.toFixed(2)} GBP
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

      </aside>
    </div>
  );
}
