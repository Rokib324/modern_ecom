/**
 * Edge-safe auth configuration for middleware.
 * This file MUST NOT import any Node.js-only modules (mongoose, bcrypt, etc.)
 * It uses only the JWT session strategy which works in Edge Runtime.
 *
 * IMPORTANT: Must use the same `secret` as lib/auth.ts so CSRF tokens match.
 */
import NextAuth from "next-auth";

export const { auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id ?? token.sub;
        token.role = (user as { role?: string }).role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

