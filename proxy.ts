import { auth } from "@/lib/auth-edge";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (req.auth.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect account/order routes
  if (pathname.startsWith("/account") || pathname.startsWith("/orders") || pathname.startsWith("/checkout")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/orders/:path*", "/checkout/:path*"],
};

