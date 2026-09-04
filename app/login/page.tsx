"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Eye, EyeOff, Phone } from "lucide-react";

/* ─── Social provider brand SVGs ──────────────────────────────────────────── */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078V12.07h3.047V9.428c0-3.007 1.792-4.67 4.533-4.67 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden>
      <path
        fill="#25D366"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  );
}

/* ─── Phone / OTP modal ────────────────────────────────────────────────────── */

function PhoneModal({ onClose }: { onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: integrate SMS provider (Twilio) — for now show success state
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl p-8 shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* WhatsApp green top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
          style={{ background: "linear-gradient(90deg,#25D366,#128C7E)" }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(37,211,102,0.15)" }}
          >
            <WhatsAppIcon />
          </div>
          <div>
            <h2 className="text-white font-semibold text-base">
              Continue with Phone
            </h2>
            <p className="text-white/40 text-xs">
              We&apos;ll send a verification code
            </p>
          </div>
        </div>

        {!sent ? (
          <form onSubmit={handleSend} className="space-y-4">
            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "rgba(255,255,255,0.4)" }}
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(37,211,102,0.6)";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(37,211,102,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.12)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
              style={{
                background: loading
                  ? "rgba(37,211,102,0.5)"
                  : "linear-gradient(135deg,#25D366,#128C7E)",
                boxShadow: loading ? "none" : "0 4px 16px rgba(37,211,102,0.3)",
              }}
            >
              {loading ? "Sending…" : "Send Code"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: verify OTP with backend
              onClose();
            }}
            className="space-y-4"
          >
            <p className="text-white/60 text-sm text-center">
              Code sent to <span className="text-white font-medium">{phone}</span>
            </p>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit code"
              className="w-full text-center tracking-[0.5em] py-3 rounded-xl text-base text-white placeholder-white/20 outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(37,211,102,0.6)";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(37,211,102,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.12)";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: "linear-gradient(135deg,#25D366,#128C7E)",
                boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
              }}
            >
              Verify & Sign In
            </button>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="w-full text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              ← Change number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Main login page ─────────────────────────────────────────────────────── */

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [showPhone, setShowPhone] = useState(false);

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
    setLoading("credentials");

    const res = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    setLoading(null);
    if (res?.error) {
      setError("Invalid password or account does not exist");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleOAuthSignIn = (provider: "google" | "facebook") => {
    setLoading(provider);
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <>
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50%  { transform: translateY(-30px) rotate(5deg); opacity: 0.15; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-6px); }
          40%,80% { transform: translateX(6px); }
        }
        .anim-fade-up  { animation: fadeSlideUp 0.45s cubic-bezier(.22,1,.36,1) both; }
        .anim-fade-in  { animation: fadeSlideIn 0.4s cubic-bezier(.22,1,.36,1) both; }
        .anim-shake    { animation: shake 0.4s ease both; }
        .social-btn {
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }
        .social-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .social-btn:active:not(:disabled) {
          transform: translateY(0px) scale(0.98);
        }
      `}</style>

      {showPhone && <PhoneModal onClose={() => setShowPhone(false)} />}

      {/* ── Full-page animated background ── */}
      <div
        className="min-h-screen flex flex-col relative overflow-hidden"
        style={{
          background:
            "linear-gradient(-45deg,#0f0c29,#1a103a,#24243e,#0d1b2a,#12002e,#1a0533)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 18s ease infinite",
        }}
      >
        {/* Ambient glow orbs */}
        <div
          className="absolute top-[-10%] left-[-5%] w-72 h-72 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(99,56,255,0.25) 0%,transparent 70%)",
            animation: "floatUp 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(56,189,248,0.18) 0%,transparent 70%)",
            animation: "floatUp 11s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute top-[40%] right-[10%] w-48 h-48 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(236,72,153,0.14) 0%,transparent 70%)",
            animation: "floatUp 9s ease-in-out infinite 4s",
          }}
        />

        {/* ── Header / Logo ── */}
        <div className="w-full flex justify-center pt-10 sm:pt-14 pb-4 relative z-10">
          <Link
            href="/"
            className="flex flex-col items-center leading-none select-none group"
            style={{ textDecoration: "none" }}
          >
            <svg
              className="w-7 h-7 mb-1 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 16"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 8px rgba(160,120,255,0.6))" }}
            >
              <path d="M2 14 L6 4 L12 10 L18 4 L22 14 Z" />
              <line x1="2" y1="14" x2="22" y2="14" />
            </svg>
            <span
              className="text-[2.5rem] sm:text-[3rem] leading-none tracking-tight font-light"
              style={{
                fontFamily: "'Great Vibes', cursive",
                color: "white",
                filter: "drop-shadow(0 0 16px rgba(160,120,255,0.5))",
              }}
            >
              Ecom
            </span>
            <svg className="w-20 h-2 mt-0.5" viewBox="0 0 100 8" fill="none">
              <path
                d="M2 5 Q 50 1, 98 4"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>

        {/* ── Center Glass Card ── */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
          <div
            className="w-full max-w-[400px] rounded-3xl p-8 sm:p-10"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {step === "email" ? (
              <div className="anim-fade-up">
                {/* Title */}
                <div className="mb-7">
                  <h1 className="text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Sign in to your account
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="anim-shake rounded-xl px-4 py-2.5 mb-5 text-xs"
                    style={{
                      background: "rgba(239,68,68,0.12)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#fca5a5",
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* ── Social login buttons ── */}
                <div className="space-y-3 mb-6">
                  {/* Google */}
                  <button
                    id="btn-google-signin"
                    onClick={() => handleOAuthSignIn("google")}
                    disabled={!!loading}
                    className="social-btn w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "rgba(255,255,255,0.95)",
                      color: "#1f2937",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading)
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 6px 20px rgba(66,133,244,0.35)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 2px 12px rgba(0,0,0,0.25)";
                    }}
                  >
                    {loading === "google" ? (
                      <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    ) : (
                      <GoogleIcon />
                    )}
                    <span>Continue with Google</span>
                  </button>

                  {/* Facebook */}
                  <button
                    id="btn-facebook-signin"
                    onClick={() => handleOAuthSignIn("facebook")}
                    disabled={!!loading}
                    className="social-btn w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg,#1877F2,#0c5fcf)",
                      boxShadow: "0 2px 12px rgba(24,119,242,0.3)",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading)
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 6px 20px rgba(24,119,242,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 2px 12px rgba(24,119,242,0.3)";
                    }}
                  >
                    {loading === "facebook" ? (
                      <span className="w-5 h-5 border-2 border-blue-300 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FacebookIcon />
                    )}
                    <span>Continue with Facebook</span>
                  </button>

                  {/* Phone / WhatsApp-styled */}
                  <button
                    id="btn-phone-signin"
                    onClick={() => setShowPhone(true)}
                    disabled={!!loading}
                    className="social-btn w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg,#25D366,#128C7E)",
                      boxShadow: "0 2px 12px rgba(37,211,102,0.25)",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading)
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 6px 20px rgba(37,211,102,0.45)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 2px 12px rgba(37,211,102,0.25)";
                    }}
                  >
                    <WhatsAppIcon />
                    <span>Continue with Phone</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className="w-full border-t"
                      style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span
                      className="px-3"
                      style={{
                        background: "transparent",
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      or continue with email
                    </span>
                  </div>
                </div>

                {/* Email form */}
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      id="email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full pl-4 pr-11 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(160,120,255,0.6)";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(160,120,255,0.12)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.12)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "white";
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(255,255,255,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "rgba(255,255,255,0.4)";
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "transparent";
                      }}
                      aria-label="Continue with email"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-center text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="underline underline-offset-2 transition-colors"
                      style={{ color: "rgba(160,120,255,0.8)" }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color =
                          "rgba(160,120,255,1)")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color =
                          "rgba(160,120,255,0.8)")
                      }
                    >
                      Sign up
                    </Link>
                  </p>
                </form>

                {/* Terms */}
                <p
                  className="text-[11px] text-center mt-6 leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  By continuing, you agree to our{" "}
                  <Link
                    href="/terms-of-service"
                    className="underline underline-offset-2 hover:text-white/50 transition-colors"
                  >
                    Terms of service
                  </Link>
                </p>
              </div>
            ) : (
              /* ── Step 2: Password ── */
              <div className="anim-fade-in">
                {/* Back + Title */}
                <div className="mb-7">
                  <button
                    onClick={() => {
                      setStep("email");
                      setError("");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs mb-4 transition-colors"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(255,255,255,0.8)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(255,255,255,0.4)")
                    }
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <h1 className="text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
                    Enter password
                  </h1>
                  <p
                    className="text-sm mt-1 break-all"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Signing in as{" "}
                    <span style={{ color: "rgba(255,255,255,0.8)" }}>
                      {email}
                    </span>
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="anim-shake rounded-xl px-4 py-2.5 mb-5 text-xs"
                    style={{
                      background: "rgba(239,68,68,0.12)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#fca5a5",
                    }}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      id="password-input"
                      type={showPassword ? "text" : "password"}
                      required
                      autoFocus
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-4 pr-11 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(160,120,255,0.6)";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(160,120,255,0.12)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.12)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 transition-colors"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color =
                          "rgba(255,255,255,0.7)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color =
                          "rgba(255,255,255,0.35)")
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <button
                    id="btn-signin-credentials"
                    type="submit"
                    disabled={!!loading}
                    className="social-btn w-full py-3 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background:
                        "linear-gradient(135deg,#6338ff,#a855f7,#6338ff)",
                      backgroundSize: "200% 200%",
                      boxShadow: "0 4px 16px rgba(99,56,255,0.4)",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading)
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 8px 24px rgba(99,56,255,0.6)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 4px 16px rgba(99,56,255,0.4)";
                    }}
                  >
                    {loading === "credentials" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-purple-300 border-t-white rounded-full animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </form>

                <div
                  className="mt-5 flex items-center justify-between text-xs"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  <Link
                    href="/register"
                    className="hover:text-white/70 transition-colors"
                  >
                    Create account
                  </Link>
                  <Link
                    href="/terms-of-service"
                    className="hover:text-white/70 transition-colors"
                  >
                    Terms of service
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="w-full flex justify-center pb-8 relative z-10">
          <Link
            href="/privacy-policy"
            className="text-xs transition-colors"
            style={{ color: "rgba(255,255,255,0.25)" }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color =
                "rgba(255,255,255,0.6)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color =
                "rgba(255,255,255,0.25)")
            }
          >
            Privacy policy
          </Link>
        </div>
      </div>
    </>
  );
}
