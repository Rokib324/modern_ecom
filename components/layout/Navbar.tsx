"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, User, Menu, X, Search, Package } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Package className="w-6 h-6" />
            <span>Ecom</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link href="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
            <Link href="/categories" className="hover:text-indigo-600 transition-colors">Categories</Link>
            {session?.user.role === "admin" && (
              <Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin</Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/search" className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
              <Search className="w-5 h-5" />
            </Link>

            <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
              <ShoppingCart className="w-5 h-5" />
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems()}
                </span>
              )}
            </Link>

            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                  <User className="w-5 h-5" />
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                  <p className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">{session.user.email}</p>
                  <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Account</Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-1 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
          <Link href="/" className="block py-2 text-sm text-gray-700 hover:text-indigo-600">Home</Link>
          <Link href="/products" className="block py-2 text-sm text-gray-700 hover:text-indigo-600">Products</Link>
          <Link href="/categories" className="block py-2 text-sm text-gray-700 hover:text-indigo-600">Categories</Link>
          {!session && (
            <Link href="/login" className="block py-2 text-sm text-indigo-600 font-medium">Sign In</Link>
          )}
        </div>
      )}
    </header>
  );
}
