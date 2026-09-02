import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        await connectDB();

        const user = await User.findOne({ email: parsed.data.email }).select(
          "+password"
        );

        if (!user || !user.password) return null;

        const isValid = await user.comparePassword(parsed.data.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
      }
      // Handle Google sign-in: create/update user in DB
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: token.email }).lean<{
          _id: mongoose.Types.ObjectId;
          role: string;
        }>();
        if (!existingUser) {
          const newUser = await User.create({
            name: String(token.name ?? ""),
            email: String(token.email ?? ""),
            image: token.picture ?? undefined,
            isEmailVerified: true,
          });
          token.id = String(newUser._id);
          token.role = newUser.role;
        } else {
          token.id = String(existingUser._id);
          token.role = existingUser.role;
        }
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
