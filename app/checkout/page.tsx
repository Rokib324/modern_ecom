"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { ChevronRight, ChevronDown, Tag, ShieldCheck, Truck } from "lucide-react";

/* ─── Bangladesh divisions & districts ─────────────────────────────────────── */
const BD_DIVISIONS: Record<string, string[]> = {
  Dhaka: [
    "Dhaka", "Gazipur", "Narayanganj", "Narsingdi", "Munshiganj",
    "Manikganj", "Tangail", "Kishoreganj", "Netrokona", "Faridpur",
    "Gopalganj", "Madaripur", "Rajbari", "Shariatpur",
  ],
  Chittagong: [
    "Chittagong", "Cox's Bazar", "Comilla", "Noakhali", "Feni",
    "Lakshmipur", "Chandpur", "Brahmanbaria", "Khagrachhari", "Rangamati", "Bandarban",
  ],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rajshahi: [
    "Rajshahi", "Natore", "Naogaon", "Chapai Nawabganj",
    "Bogura", "Joypurhat", "Sirajganj", "Pabna",
  ],
  Khulna: [
    "Khulna", "Bagerhat", "Satkhira", "Jessore", "Narail",
    "Magura", "Jhenaidah", "Kushtia", "Chuadanga", "Meherpur",
  ],
  Barishal: [
    "Barishal", "Bhola", "Patuakhali", "Pirojpur", "Jhalokati", "Barguna",
  ],
  Rangpur: [
    "Rangpur", "Dinajpur", "Gaibandha", "Lalmonirhat",
    "Nilphamari", "Kurigram", "Thakurgaon", "Panchagarh",
  ],
  Mymensingh: ["Mymensingh", "Sherpur", "Jamalpur", "Netrokona"],
};

const DIVISIONS = Object.keys(BD_DIVISIONS);

/* ─── Shipping cost ──────────────────────────────────────────────────────── */
function getShippingCost(division: string): number {
  if (division === "Dhaka") return 60;
  if (division === "") return 0;
  return 120;
}

/* ─── Breadcrumb ──────────────────────────────────────────────────────────── */
function Breadcrumb({ step }: { step: "information" | "payment" | "review" }) {
  const steps = ["information", "payment", "review"] as const;
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 flex-wrap">
      <Link href="/cart" className="hover:text-gray-800 transition-colors">
        Cart
      </Link>
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span
            className={
              s === step
                ? "text-gray-900 font-semibold capitalize"
                : steps.indexOf(step) > i
                ? "text-gray-700 capitalize"
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

/* ─── Order Summary sidebar ───────────────────────────────────────────────── */
function OrderSummary({
  shippingCost,
  discount,
  coupon,
  onCouponChange,
  onApplyCoupon,
}: {
  shippingCost: number;
  discount: number;
  coupon: string;
  onCouponChange: (v: string) => void;
  onApplyCoupon: () => void;
}) {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.totalPrice());
  const discountedSubtotal = subtotal - discount;
  const total = discountedSubtotal + shippingCost;
  const [showItems, setShowItems] = useState(true);

  return (
    <aside className="w-full lg:w-[380px] flex-shrink-0">
      <div
        className="rounded-2xl overflow-hidden sticky top-6"
        style={{
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        {/* Items toggle */}
        <button
          onClick={() => setShowItems(!showItems)}
          className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>Order summary</span>
            <span className="bg-gray-200 text-gray-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {items.reduce((a, i) => a + i.quantity, 0)}
            </span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${showItems ? "rotate-180" : ""}`}
          />
        </button>

        {/* Items list */}
        {showItems && (
          <div className="divide-y divide-gray-100 max-h-[280px] overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3 px-5 py-3.5">
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
        )}

        <div className="px-5 py-4 space-y-3 bg-white">
          {/* Coupon */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={coupon}
                onChange={(e) => onCouponChange(e.target.value)}
                placeholder="Discount code"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <button
              onClick={onApplyCoupon}
              className="px-4 py-2.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Apply
            </button>
          </div>

          {/* Price breakdown */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>৳{subtotal.toLocaleString("bn-BD")}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount (10%)</span>
                <span>-৳{discount.toLocaleString("bn-BD")}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Delivery
              </span>
              <span>
                {shippingCost === 0 ? (
                  <span className="text-gray-400 italic">Select division</span>
                ) : (
                  `৳${shippingCost}`
                )}
              </span>
            </div>
            <div
              className="flex justify-between pt-3 border-t border-gray-100"
              style={{ fontFamily: "inherit" }}
            >
              <span className="font-bold text-gray-900 text-base">Total</span>
              <div className="text-right">
                <span className="text-xs text-gray-400 font-normal mr-1">BDT</span>
                <span className="font-bold text-gray-900 text-base">
                  ৳{total.toLocaleString("bn-BD")}
                </span>
              </div>
            </div>
          </div>

          {/* Trust signals */}
          <div className="flex items-center gap-2 pt-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>Payments secured by bKash & Nagad</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── Main checkout page ─────────────────────────────────────────────────── */
export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.totalPrice());

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    division: "",
    district: "",
    upazila: "",
    street: "",
  });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4">
        <p className="text-gray-600 text-lg font-medium">Your cart is empty</p>
        <Link
          href="/products"
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const shippingCost = getShippingCost(form.division);
  const districts = form.division ? BD_DIVISIONS[form.division] ?? [] : [];

  const handleField = (k: keyof typeof form, v: string) => {
    setForm((prev) => ({
      ...prev,
      [k]: v,
      // Reset district when division changes
      ...(k === "division" ? { district: "" } : {}),
    }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === "ECOM10") {
      setDiscount(Math.round(subtotal * 0.1));
    }
  };

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.fullName.trim()) e.fullName = "Name is required";
    if (!form.email.trim() || !form.email.includes("@"))
      e.email = "Valid email required";
    const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;
    if (!phoneRegex.test(form.phone.replace(/\s/g, "")))
      e.phone = "Valid BD phone required (e.g. 01XXXXXXXXX)";
    if (!form.division) e.division = "Select division";
    if (!form.district) e.district = "Select district";
    if (!form.street.trim()) e.street = "Address is required";
    return e;
  };

  const handleContinue = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      // Scroll to first error
      const firstError = document.querySelector("[data-error]");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Save form data to sessionStorage for payment page
    const checkoutData = {
      form,
      items: items.map((i) => ({
        product: i.productId,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
      })),
      shippingAddress: {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        street: form.street,
        district: form.district,
        division: form.division,
        upazila: form.upazila,
        country: "BD",
      },
      itemsPrice: subtotal,
      shippingPrice: shippingCost,
      totalPrice: subtotal - discount + shippingCost,
      discount,
    };
    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    router.push("/checkout/payment");
  };

  const inputClass = (field: keyof typeof form) =>
    `w-full px-4 py-3 text-sm border rounded-xl transition-all outline-none ${
      errors[field]
        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
    }`;

  const selectClass = (field: keyof typeof form) =>
    `w-full px-4 py-3 text-sm border rounded-xl transition-all outline-none appearance-none bg-white ${
      errors[field]
        ? "border-red-400 bg-red-50"
        : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .checkout-body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Top bar with logo */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-gray-900"
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
          <Breadcrumb step="information" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ── Left Column: Form ── */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Express Payment */}
            <section
              className="bg-white rounded-2xl p-5 sm:p-6 space-y-4"
              style={{ border: "1px solid rgba(0,0,0,0.07)" }}
            >
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold text-center">
                Express checkout
              </p>
              <div className="grid grid-cols-2 gap-3">
                {/* bKash Express Button */}
                <button
                  onClick={() => {
                    const e = validate();
                    if (Object.keys(e).length === 0) {
                      handleContinue();
                      sessionStorage.setItem("expressPayment", "bkash");
                    } else {
                      setErrors(e);
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:brightness-95 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg,#E2136E,#C0005E)",
                    boxShadow: "0 3px 12px rgba(226,19,110,0.35)",
                  }}
                >
                  {/* bKash mini logo */}
                  <svg viewBox="0 0 40 20" className="h-5 w-auto" fill="none">
                    <rect width="40" height="20" rx="4" fill="white" fillOpacity="0.15" />
                    <text
                      x="20"
                      y="14.5"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="800"
                      fill="white"
                      fontFamily="sans-serif"
                    >
                      bKash
                    </text>
                  </svg>
                </button>

                {/* Nagad Express Button */}
                <button
                  onClick={() => {
                    const e = validate();
                    if (Object.keys(e).length === 0) {
                      handleContinue();
                      sessionStorage.setItem("expressPayment", "nagad");
                    } else {
                      setErrors(e);
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:brightness-95 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg,#F05A28,#D94010)",
                    boxShadow: "0 3px 12px rgba(240,90,40,0.35)",
                  }}
                >
                  <svg viewBox="0 0 40 20" className="h-5 w-auto" fill="none">
                    <rect width="40" height="20" rx="4" fill="white" fillOpacity="0.15" />
                    <text
                      x="20"
                      y="14.5"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="800"
                      fill="white"
                      fontFamily="sans-serif"
                    >
                      Nagad
                    </text>
                  </svg>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-gray-400">
                    or fill in your details below
                  </span>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section
              className="bg-white rounded-2xl p-5 sm:p-6 space-y-4"
              style={{ border: "1px solid rgba(0,0,0,0.07)" }}
            >
              <h2 className="font-semibold text-gray-900 text-base">Contact</h2>

              <div data-error={errors.email}>
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => handleField("email", e.target.value)}
                  className={inputClass("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div data-error={errors.phone}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium select-none border-r border-gray-200 pr-3">
                    +880
                  </span>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={form.phone}
                    onChange={(e) => handleField("phone", e.target.value)}
                    className={`${inputClass("phone")} pl-[4.5rem]`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
            </section>

            {/* Shipping Address */}
            <section
              className="bg-white rounded-2xl p-5 sm:p-6 space-y-4"
              style={{ border: "1px solid rgba(0,0,0,0.07)" }}
            >
              <h2 className="font-semibold text-gray-900 text-base">Shipping address</h2>

              {/* Country — fixed to Bangladesh */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                <span className="text-xl">🇧🇩</span>
                <span className="text-sm font-medium text-gray-700">Bangladesh</span>
              </div>

              {/* Full name */}
              <div data-error={errors.fullName}>
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={(e) => handleField("fullName", e.target.value)}
                  className={inputClass("fullName")}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Division + District */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative" data-error={errors.division}>
                  <select
                    value={form.division}
                    onChange={(e) => handleField("division", e.target.value)}
                    className={selectClass("division")}
                  >
                    <option value="">Division</option>
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  {errors.division && (
                    <p className="mt-1 text-xs text-red-500">{errors.division}</p>
                  )}
                </div>

                <div className="relative" data-error={errors.district}>
                  <select
                    value={form.district}
                    onChange={(e) => handleField("district", e.target.value)}
                    className={selectClass("district")}
                    disabled={!form.division}
                  >
                    <option value="">District</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  {errors.district && (
                    <p className="mt-1 text-xs text-red-500">{errors.district}</p>
                  )}
                </div>
              </div>

              {/* Upazila (optional) */}
              <input
                type="text"
                placeholder="Upazila / Thana (optional)"
                value={form.upazila}
                onChange={(e) => handleField("upazila", e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
              />

              {/* Street address */}
              <div data-error={errors.street}>
                <input
                  type="text"
                  placeholder="House / Flat, Road, Area"
                  value={form.street}
                  onChange={(e) => handleField("street", e.target.value)}
                  className={inputClass("street")}
                />
                {errors.street && (
                  <p className="mt-1 text-xs text-red-500">{errors.street}</p>
                )}
              </div>

              {/* Shipping cost notice */}
              {form.division && (
                <div className="flex items-center gap-2 text-sm rounded-lg px-3 py-2.5 bg-blue-50 text-blue-700">
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Delivery to{" "}
                    <strong>{form.division}</strong>:{" "}
                    <strong>৳{shippingCost}</strong>
                    {form.division === "Dhaka"
                      ? " (Inside Dhaka)"
                      : " (Outside Dhaka)"}
                  </span>
                </div>
              )}
            </section>

            {/* Actions */}
            <div className="flex items-center justify-between pb-8">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                Return to cart
              </Link>
              <button
                onClick={handleContinue}
                className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg,#1a1a2e,#16213e)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                }}
              >
                Continue to payment →
              </button>
            </div>
          </div>

          {/* ── Right Sidebar: Order Summary ── */}
          <OrderSummary
            shippingCost={shippingCost}
            discount={discount}
            coupon={coupon}
            onCouponChange={setCoupon}
            onApplyCoupon={handleApplyCoupon}
          />
        </div>
      </div>
    </div>
  );
}
