"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import FavoritesPage from "./page";

export default function WishlistModal() {
  const isWishlistOpen = useWishlistStore((s) => s.isWishlistOpen);
  const closeWishlist = useWishlistStore((s) => s.closeWishlist);

  if (!isWishlistOpen) return null;

  return <FavoritesPage onClose={closeWishlist} isModal={true} />;
}
