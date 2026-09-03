"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const aboutLinks = [
  { label: "About Us", href: "/about" },
  { label: "Size guides", href: "/size-guides" },
  { label: "Behind The Seams", href: "/behind-the-seams" },
  { label: "Contact us", href: "/contact" },
  { label: "Wholesale enquiries", href: "/wholesale" },
];

const helpLinks = [
  { label: "Delivery & returns", href: "/delivery-returns" },
  { label: "Refund policy", href: "/refund-policy" },
  { label: "Terms & conditions", href: "/terms-conditions" },
  { label: "Terms of service", href: "/terms-of-service" },
  { label: "Privacy policy", href: "/privacy-policy" },
];

const EMAIL = "rakib4458@gmail.com";

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <span className="ml-1 opacity-70 inline-flex items-center gap-1">
      Designed and Developed by{" "}
      <button
        onClick={handleCopy}
        title="Click to copy email"
        className="relative inline-flex items-center gap-0.5 underline underline-offset-2 hover:opacity-100 transition-opacity cursor-pointer"
      >
        Rokib
        {copied && (
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#3b2a25] text-white text-[10px] tracking-wide px-2 py-0.5 rounded whitespace-nowrap shadow">
            Copied!
          </span>
        )}
      </button>
    </span>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (isAuthPage) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer
      className="mt-auto"
      style={{
        backgroundColor: "#f2b8a0",
        fontFamily: "'Josefin Sans', sans-serif",
      }}
    >
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600&display=swap');`}</style>

      {/* ── Main Grid ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* ── Column 1: About Us ── */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3b2a25] mb-5">
              About Us
            </h4>
            <ul className="space-y-3">
              {aboutLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[13px] text-[#4a3128] hover:text-[#3b2a25] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 2: Here To Help ── */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3b2a25] mb-5">
              Here To Help
            </h4>
            <ul className="space-y-3">
              {helpLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[13px] text-[#4a3128] hover:text-[#3b2a25] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Join Our Community ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3b2a25] mb-4">
              Join Our Community
            </h4>
            <p className="text-[13px] text-[#4a3128] leading-relaxed mb-5 max-w-xs">
              Sign up to our email newsletter to get access to exclusive offers,
              giveaways and get involved in our antics behind‑the‑scenes!
            </p>

            {/* Email form */}
            {subscribed ? (
              <p className="text-[13px] text-[#3b2a25] font-medium">
                ✓ Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-end gap-3 max-w-sm">
                <div className="flex-1">
                  <label htmlFor="footer-email" className="sr-only">Your email</label>
                  <input
                    id="footer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full bg-transparent border-0 border-b border-[#3b2a25]/60 pb-1.5 text-[13px] text-[#3b2a25] placeholder-[#3b2a25]/50 focus:outline-none focus:border-[#3b2a25] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="text-[11px] tracking-[0.18em] uppercase font-semibold text-[#3b2a25] hover:opacity-70 transition-opacity pb-1.5 flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}

            {/* Social + Trust badges */}
            <div className="flex items-center gap-3 mt-7 flex-wrap">
              {/* Facebook */}
              <a href="#" aria-label="Facebook" className="hover:opacity-80 transition-opacity">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#1877F2" />
                  <path
                    d="M21 10h-2.5C17.67 10 17 10.67 17 11.5V14h4l-.5 3H17v8h-3v-8h-3v-3h3v-2.5C14 9.57 15.57 8 17.5 8H21v2z"
                    fill="white"
                  />
                </svg>
              </a>

              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="hover:opacity-80 transition-opacity">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="url(#ig-grad)" />
                  <defs>
                    <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
                      <stop offset="0%" stopColor="#fdf497" />
                      <stop offset="5%" stopColor="#fdf497" />
                      <stop offset="45%" stopColor="#fd5949" />
                      <stop offset="60%" stopColor="#d6249f" />
                      <stop offset="90%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <rect x="9" y="9" width="14" height="14" rx="4" stroke="white" strokeWidth="1.5" fill="none" />
                  <circle cx="16" cy="16" r="3.5" stroke="white" strokeWidth="1.5" fill="none" />
                  <circle cx="20.5" cy="11.5" r="1" fill="white" />
                </svg>
              </a>

              {/* TikTok */}
              <a href="#" aria-label="TikTok" className="hover:opacity-80 transition-opacity">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#010101" />
                  <path
                    d="M21.5 13.3c-1.1-.1-2-.6-2.7-1.3v5.5a4.2 4.2 0 1 1-4.2-4.2c.1 0 .3 0 .4 0v2.1c-.1 0-.3 0-.4 0a2.1 2.1 0 1 0 2.1 2.1V9h2.1c.2 1.3 1.2 2.3 2.7 2.3v2z"
                    fill="white"
                  />
                </svg>
              </a>

              {/* Buy Women Built badge */}
              <a href="#" aria-label="Buy Women Built" className="hover:opacity-80 transition-opacity">
                <div className="w-10 h-8 rounded overflow-hidden flex flex-col text-[5px] font-bold text-white">
                  <div className="bg-[#f7a800] flex-1 flex items-center justify-center">BUY</div>
                  <div className="bg-[#e63329] flex-1 flex items-center justify-center">WOMEN</div>
                  <div className="bg-[#2a6e35] flex-1 flex items-center justify-center">BUILT</div>
                </div>
              </a>

              {/* Feefo badge */}
              <a href="#" aria-label="Feefo reviews" className="hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-1 bg-white/30 rounded px-2 py-1">
                  <span className="text-[12px] font-semibold text-[#3b2a25]">feefo</span>
                  <span className="text-yellow-500 text-[10px]">★★</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-10 pt-5 border-t border-[#3b2a25]/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Currency selector */}
            <button className="flex items-center gap-1.5 text-[12px] text-[#4a3128] hover:text-[#3b2a25] transition-colors">
              {/* Bangladesh flag */}
              <svg className="w-6 h-3 rounded-sm" viewBox="0 0 900 600" fill="none">
                {/* Bangladesh flag: green field + red disc offset left of center */}
                <rect width="900" height="600" fill="#006A4E" />
                <circle cx="360" cy="300" r="200" fill="#F42A41" />
              </svg>
              Dhaka, Bangladesh (BDT ৳)
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Copyright */}
            <p className="text-[11px] text-[#4a3128] leading-relaxed">
              Copyright © {year}. Ecom. All rights reserved.{" "}
              <Link href="/terms-of-service" className="underline underline-offset-2 hover:text-[#3b2a25]">
                terms of use
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-[#3b2a25]">
                privacy notice
              </Link>
              .
              <CopyEmail />
            </p>
          </div>
        </div>
      </div>

      {/* ── Live Chat Bubble ── */}
      <button
        aria-label="Live chat"
        className="fixed bottom-6 left-6 w-12 h-12 bg-[#3b2a25] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2a1e1a] transition-colors z-40"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H6l-2 2V4h16v10z" />
        </svg>
      </button>
    </footer>
  );
}
