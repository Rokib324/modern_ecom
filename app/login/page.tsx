"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setStep("password");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Invalid password or account does not exist");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between items-center px-4 py-8 sm:py-12">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Josefin+Sans:wght@300;400;500;600&display=swap');
        .font-logo { font-family: 'Great Vibes', cursive; }
        .font-nav  { font-family: 'Josefin Sans', sans-serif; }
      `}</style>

      {/* ── Top Header / Logo ── */}
      <div className="w-full flex justify-center pt-2 sm:pt-4">
        <Link
          href="/"
          className="font-logo flex flex-col items-center leading-none select-none group"
          style={{ textDecoration: "none" }}
        >
          {/* Crown */}
          <svg
            className="w-7 h-7 mb-1 text-[#2d3748] transition-transform duration-300 group-hover:scale-105"
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
          <span className="text-[2.75rem] sm:text-[3.25rem] text-[#1a202c] leading-none tracking-tight">
            Ecom
          </span>
          {/* Subtle signature underline brush stroke */}
          <svg
            className="w-24 h-2 text-[#2d3748] mt-0.5"
            viewBox="0 0 100 8"
            fill="none"
          >
            <path
              d="M2 5 Q 50 1, 98 4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </div>

      {/* ── Center Card ── */}
      <div className="w-full max-w-[370px] my-auto py-8">
        {step === "email" ? (
          <div>
            {/* Title & Subtitle */}
            <div className="mb-6">
              <h1 className="text-[22px] sm:text-[24px] font-bold text-gray-900 tracking-tight">
                Sign in
              </h1>
              <p className="text-[13px] text-gray-500 mt-1 font-normal">
                Sign in or create an account
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3.5 py-2.5 rounded-xl mb-4">
                {error}
              </div>
            )}

            {/* Purple "Continue with shop" button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-[#5a31f4] hover:bg-[#4d25e8] active:bg-[#421ec9] text-white font-medium py-3 px-4 rounded-xl text-sm transition-all duration-200 shadow-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Redirecting..." : "Continue with shop"}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-400">
                <span className="bg-white px-3 font-normal">or</span>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full pl-4 pr-11 py-3 border border-gray-300 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Continue with email"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Terms of service footnote */}
            <p className="text-[11px] text-gray-500 text-center mt-5 leading-relaxed">
              By continuing, you agree to our{" "}
              <Link
                href="/terms-of-service"
                className="underline underline-offset-2 hover:text-gray-900 transition-colors"
              >
                Terms of service
              </Link>
            </p>
          </div>
        ) : (
          <div>
            {/* Step 2: Password */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setStep("email");
                  setError("");
                }}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-3 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <h1 className="text-[22px] sm:text-[24px] font-bold text-gray-900 tracking-tight">
                Enter your password
              </h1>
              <p className="text-[13px] text-gray-500 mt-1 font-normal break-all">
                Signing in as <span className="font-medium text-gray-800">{email}</span>
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3.5 py-2.5 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-4 pr-11 py-3 border border-gray-300 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a202c] hover:bg-black text-white font-medium py-3 px-4 rounded-xl text-sm transition-all duration-200 shadow-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
              <Link
                href="/register"
                className="hover:text-gray-900 hover:underline transition-colors"
              >
                Create an account
              </Link>
              <Link
                href="/terms-of-service"
                className="hover:text-gray-900 hover:underline transition-colors"
              >
                Terms of service
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Privacy Policy Link ── */}
      <div className="w-full flex justify-center pb-2">
        <Link
          href="/privacy-policy"
          className="text-xs text-gray-600 hover:text-black hover:underline font-medium transition-colors"
        >
          Privacy policy
        </Link>
      </div>
    </div>
  );
}
