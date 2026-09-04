"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, ShieldCheck } from "lucide-react";

/* ─── bKash success badge ──────────────────────────────────────────────────── */
function BkashBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white"
      style={{ background: "linear-gradient(135deg,#E2136E,#C0005E)" }}
    >
      <span className="font-black">b</span>
      <span>bKash Payment</span>
    </div>
  );
}

/* ─── Nagad success badge ──────────────────────────────────────────────────── */
function NagadBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white"
      style={{ background: "linear-gradient(135deg,#F05A28,#D94010)" }}
    >
      <span>Nagad Payment</span>
    </div>
  );
}

/* ─── Success Content ─────────────────────────────────────────────────────── */
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method") as "bkash" | "nagad" | null;
  const trxId = searchParams.get("trxId");

  const [animIn, setAnimIn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 py-12"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes scaleIn { from { transform:scale(0.5); opacity:0; } to { transform:scale(1); opacity:1; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .scale-in { animation: scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .fade-up { animation: fadeUp 0.5s ease both; }
        @keyframes dash { to { stroke-dashoffset:0; } }
      `}</style>

      <div
        className={`w-full max-w-md bg-white rounded-3xl overflow-hidden transition-all duration-500 ${
          animIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Colored top strip */}
        <div
          className="h-1.5"
          style={{
            background:
              method === "nagad"
                ? "linear-gradient(90deg,#F05A28,#FF8C5A)"
                : "linear-gradient(90deg,#E2136E,#FF4B8B)",
          }}
        />

        <div className="px-8 py-10 text-center space-y-6">
          {/* Animated checkmark */}
          <div className="flex justify-center scale-in">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background:
                  method === "nagad"
                    ? "linear-gradient(135deg,#F05A28,#D94010)"
                    : "linear-gradient(135deg,#E2136E,#C0005E)",
                boxShadow:
                  method === "nagad"
                    ? "0 8px 24px rgba(240,90,40,0.35)"
                    : "0 8px 24px rgba(226,19,110,0.35)",
              }}
            >
              <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Title */}
          <div className="fade-up" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Thank you! Your payment was successful and your order is confirmed.
            </p>
          </div>

          {/* Payment badge */}
          <div className="flex justify-center fade-up" style={{ animationDelay: "0.3s" }}>
            {method === "nagad" ? <NagadBadge /> : <BkashBadge />}
          </div>

          {/* Order details */}
          <div
            className="rounded-2xl p-5 space-y-3 text-left fade-up"
            style={{
              background: "#f9fafb",
              border: "1px solid rgba(0,0,0,0.06)",
              animationDelay: "0.4s",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Order Details
              </span>
            </div>
            <div className="space-y-2.5">
              {orderId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Order ID</span>
                  <span className="text-sm font-semibold text-gray-900 font-mono">
                    {orderId}
                  </span>
                </div>
              )}
              {trxId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Transaction ID</span>
                  <span className="text-sm font-semibold text-gray-900 font-mono text-right break-all ml-4">
                    {trxId}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Payment Method</span>
                <span
                  className="text-sm font-bold capitalize"
                  style={{ color: method === "nagad" ? "#F05A28" : "#E2136E" }}
                >
                  {method ?? "bKash"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Paid & Processing
                </span>
              </div>
            </div>
          </div>

          {/* Delivery note */}
          <div
            className="rounded-xl px-4 py-3 text-sm text-blue-700 bg-blue-50 text-left fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            📦 Your order will be delivered within{" "}
            <strong>3-5 business days</strong>. You&apos;ll receive an SMS
            notification when it&apos;s shipped.
          </div>

          {/* Trust */}
          <div
            className="flex items-center justify-center gap-1.5 text-xs text-gray-400 fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            <span>Payment secured · Order insured</span>
          </div>

          {/* CTAs */}
          <div className="space-y-2.5 fade-up" style={{ animationDelay: "0.7s" }}>
            <Link
              href="/products"
              className="block w-full text-center py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                background:
                  method === "nagad"
                    ? "linear-gradient(135deg,#F05A28,#D94010)"
                    : "linear-gradient(135deg,#E2136E,#C0005E)",
                boxShadow:
                  method === "nagad"
                    ? "0 4px 14px rgba(240,90,40,0.35)"
                    : "0 4px 14px rgba(226,19,110,0.35)",
              }}
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="block w-full text-center py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom branding */}
      <p className="mt-8 text-xs text-gray-400 text-center">
        Powered by{" "}
        <span
          className="font-bold"
          style={{ color: method === "nagad" ? "#F05A28" : "#E2136E" }}
        >
          {method === "nagad" ? "Nagad" : "bKash"}
        </span>{" "}
        · Secure Bangladesh Payments
      </p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
