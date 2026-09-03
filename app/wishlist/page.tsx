import FavoritesPage from "@/components/favorites/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage your favorite items",
};

export default function WishlistRoutePage() {
  return <FavoritesPage isModal={false} />;
}
