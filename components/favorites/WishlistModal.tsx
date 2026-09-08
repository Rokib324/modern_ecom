"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWishlistStore } from "@/store/wishlistStore";
import FavoritesPage from "./page";

export default function WishlistModal() {
  const pathname = usePathname();
  const isWishlistOpen = useWishlistStore((s) => s.isWishlistOpen);
  const closeWishlist = useWishlistStore((s) => s.closeWishlist);

  // Automatically close wishlist modal whenever user navigates or redirects to any page
  useEffect(() => {
    if (isWishlistOpen) {
      closeWishlist();
    }
  }, [pathname]);

  if (!isWishlistOpen || pathname === "/wishlist") return null;

  return <FavoritesPage onClose={closeWishlist} isModal={true} />;
}

