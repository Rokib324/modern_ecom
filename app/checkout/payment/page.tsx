"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { ChevronRight, ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

/* ─── Breadcrumb ─────────────────────────────────────────────────────────── */
function Breadcrumb() {
  const steps = ["information", "payment", "review"] as const;
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 flex-wrap">
      <Link href="/cart" className="hover:text-gray-800 transition-colors">Cart</Link>
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span
            className={
              s === "payment"
                ? "text-gray-900 font-semibold capitalize"
                : i < 1
                ? "text-gray-600 capitalize"
                : "text-gray-400 capitalize"
            }
          >
            {s}
          </span>
        </span>
      ))}
    </nav>
  );
}

/* ─── Checkout data type ─────────────────────────────────────────────────── */
interface CheckoutData {
  form: { fullName: string; email: string; phone: string; division: string; district: string; upazila: string; street: string };
  items: { product: string; name: string; image: string; price: number; quantity: number }[];
  shippingAddress: { fullName: string; phone: string; email: string; street: string; district: string; division: string; upazila: string; country: string };
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  discount: number;
}

/* ─── Payment method card ────────────────────────────────────────────────── */
function PaymentCard({
  method,
  selected,
  onClick,
  logo,
  title,
  subtitle,
  brandColor,
  gradient,
}: {
  method: "bkash" | "nagad";
  selected: boolean;
  onClick: () => void;
  logo: React.ReactNode;
  title: string;
  subtitle: string;
  brandColor: string;
  gradient: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none"
      style={{
        border: selected ? `2px solid ${brandColor}` : "2px solid rgba(0,0,0,0.08)",
        boxShadow: selected
          ? `0 4px 20px ${brandColor}35`
          : "0 2px 8px rgba(0,0,0,0.05)",
        transform: selected ? "translateY(-1px)" : "none",
      }}
      aria-pressed={selected}
      aria-label={`Pay with ${title}`}
    >
      {/* Top colored bar */}
      <div className="h-1.5" style={{ background: gradient }} />

      <div className="p-5 bg-white flex items-center gap-4">
        {/* Radio circle */}
        <div
          className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
          style={{
            borderColor: selected ? brandColor : "#d1d5db",
            background: selected ? brandColor : "white",
          }}
        >
          {selected && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>

        {/* Logo */}
        <div className="w-14 h-10 flex items-center justify-center rounded-lg flex-shrink-0 overflow-hidden"
          style={{ background: `${brandColor}18` }}>
          {logo}
        </div>

        {/* Text */}
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>

        {selected && (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: brandColor }} />
        )}
      </div>

      {/* Expanded details when selected */}
      {selected && (
        <div
          className="px-5 pb-5 pt-1"
          style={{ background: `${brandColor}06` }}
        >
          <p className="text-xs text-gray-600 leading-relaxed">
            {method === "bkash"
              ? "You'll be redirected to the bKash payment page to complete your purchase securely. Pay from your bKash app or bKash account."
              : "You'll be redirected to the Nagad payment page. Pay instantly with your Nagad account or Nagad app."}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: brandColor }} />
            <span>256-bit encrypted payment · No card details stored</span>
          </div>
        </div>
      )}
    </button>
  );
}

/* ─── bKash logo ─────────────────────────────────────────────────────────── */
function BkashLogo() {
  return (
    <div className="text-center font-black text-[#E2136E] text-base tracking-tight leading-none">
      <span style={{ fontFamily: "sans-serif" }}>b</span>
      <span className="text-xs" style={{ fontFamily: "sans-serif" }}>Kash</span>
    </div>
  );
}

/* ─── Nagad logo ─────────────────────────────────────────────────────────── */
function NagadLogo() {
  return (
    <div className="text-center font-black text-[#F05A28] text-base leading-none" style={{ fontFamily: "sans-serif" }}>
      Nagad
    </div>
  );
}

/* ─── Main Payment Page ──────────────────────────────────────────────────── */
export default function PaymentPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<"bkash" | "nagad">("bkash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Read checkout data from sessionStorage
    try {
      const stored = sessionStorage.getItem("checkoutData");
      if (stored) {
        const parsed: CheckoutData = JSON.parse(stored);
        setCheckoutData(parsed);

        // Check for express payment selection
        const express = sessionStorage.getItem("expressPayment");
        if (express === "bkash" || express === "nagad") {
          setSelectedMethod(express);
          sessionStorage.removeItem("expressPayment");
        }
      } else {
        router.replace("/checkout");
      }
    } catch {
      router.replace("/checkout");
    }
  }, [router]);

  // Check for payment errors from callback
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err === "payment_cancelled") setError("Payment was cancelled. Please try again.");
    else if (err === "payment_failed") setError("Payment failed. Please try again.");
    else if (err === "server_error") setError("A server error occurred. Please try again.");
  }, []);

  const handlePay = useCallback(async () => {
    if (!checkoutData) return;
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        selectedMethod === "bkash"
          ? "/api/payment/bkash/create"
          : "/api/payment/nagad/create";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: checkoutData.items,
          shippingAddress: checkoutData.shippingAddress,
          itemsPrice: checkoutData.itemsPrice,
          shippingPrice: checkoutData.shippingPrice,
          totalPrice: checkoutData.totalPrice,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Payment initiation failed");
      }

      // Clear cart on successful payment initiation
      clearCart();
      sessionStorage.removeItem("checkoutData");

      // Redirect to payment gateway
      const redirectUrl =
        selectedMethod === "bkash" ? data.bkashURL : data.nagadURL;
      window.location.href = redirectUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initiate payment"
      );
      setLoading(false);
    }
  }, [checkoutData, selectedMethod, clearCart]);

  if (!isMounted || !checkoutData) return null;

  if (items.length === 0 && !checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No items in cart</p>
      </div>
    );
  }

  const { form, totalPrice, shippingPrice, itemsPrice, discount } = checkoutData;

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .checkout-body { font-family: 'Inter', sans-serif; }
        @keyframes pulse-border { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "'Great Vibes', cursive", fontSize: "2rem" }}
          >
            Ecom
          </Link>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 checkout-body">
        {/* Breadcrumb */}
        <div className="mb-7">
          <Breadcrumb />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ── Left: Payment selection ── */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Contact/address summary card */}
            <div
              className="bg-white rounded-2xl p-5 space-y-3"
              style={{ border: "1px solid rgba(0,0,0,0.07)" }}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900 text-sm">Delivery details</h3>
                <Link
                  href="/checkout"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Change
                </Link>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                <p><span className="font-medium text-gray-900">{form.fullName}</span></p>
                <p>{form.street}, {form.district && `${form.district}, `}{form.division}</p>
                <p>{form.email} · {form.phone}</p>
              </div>
            </div>

            {/* Payment methods */}
            <div
              className="bg-white rounded-2xl p-5 sm:p-6 space-y-4"
              style={{ border: "1px solid rgba(0,0,0,0.07)" }}
            >
              <h2 className="font-semibold text-gray-900 text-base">Payment method</h2>
              <p className="text-xs text-gray-500">
                All transactions are secure and encrypted.
              </p>

              <div className="space-y-3">
                <PaymentCard
                  method="bkash"
                  selected={selectedMethod === "bkash"}
                  onClick={() => setSelectedMethod("bkash")}
                  logo={<BkashLogo />}
                  title="bKash"
                  subtitle="Pay instantly with your bKash account"
                  brandColor="#E2136E"
                  gradient="linear-gradient(90deg,#E2136E,#FF4B8B)"
                />
                <PaymentCard
                  method="nagad"
                  selected={selectedMethod === "nagad"}
                  onClick={() => setSelectedMethod("nagad")}
                  logo={<NagadLogo />}
                  title="Nagad"
                  subtitle="Pay instantly with your Nagad account"
                  brandColor="#F05A28"
                  gradient="linear-gradient(90deg,#F05A28,#FF8C5A)"
                />
              </div>

              {/* Payment button */}
              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background:
                    selectedMethod === "bkash"
                      ? "linear-gradient(135deg,#E2136E,#C0005E)"
                      : "linear-gradient(135deg,#F05A28,#D94010)",
                  boxShadow:
                    selectedMethod === "bkash"
                      ? "0 4px 18px rgba(226,19,110,0.4)"
                      : "0 4px 18px rgba(240,90,40,0.4)",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting to {selectedMethod === "bkash" ? "bKash" : "Nagad"}…
                  </>
                ) : (
                  <>
                    {selectedMethod === "bkash" ? (
                      <span className="font-black text-base tracking-tight">b</span>
                    ) : null}
                    Pay ৳{totalPrice.toLocaleString("bn-BD")} with{" "}
                    {selectedMethod === "bkash" ? "bKash" : "Nagad"}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                By paying, you agree to our{" "}
                <Link href="/terms-of-service" className="underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="underline">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Back link */}
            <div className="flex items-center justify-between pb-8">
              <Link
                href="/checkout"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                Return to information
              </Link>
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <aside className="w-full lg:w-[380px] flex-shrink-0">
            <div
              className="rounded-2xl overflow-hidden sticky top-6 bg-white"
              style={{ border: "1px solid rgba(0,0,0,0.08)" }}
            >
              <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">Order summary</p>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                {checkoutData.items.map((item, i) => (
                  <div key={i} className="flex gap-3 px-5 py-3.5">
                    <div className="relative w-14 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/images/newin_silver_nightdress.jpg"}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm text-gray-800 line-clamp-2 font-medium leading-snug">
                        {item.name}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString("bn-BD")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="px-5 py-4 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{itemsPrice.toLocaleString("bn-BD")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-৳{discount.toLocaleString("bn-BD")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span>৳{shippingPrice}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="font-bold text-gray-900 text-base">Total</span>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 font-normal mr-1">BDT</span>
                    <span className="font-bold text-gray-900 text-base">
                      ৳{totalPrice.toLocaleString("bn-BD")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
