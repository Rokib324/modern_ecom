"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const openCart = useCartStore((s) => s.openCart);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    // Seed sample product if cart is empty on first load so user immediately sees design
    if (useCartStore.getState().items.length === 0) {
      addItem({
        productId: "demo-1",
        name: "Silver Grey with Pink Lace Trim Satin Cap Sleeve Nightdress",
        price: 48.0,
        image: "/images/newin_silver_nightdress.jpg",
        quantity: 1,
        stock: 10,
        slug: "silver-grey-pink-lace-trim-nightdress",
      });
    }
    openCart();
    // Redirect cleanly to home page while drawer stays open
    router.replace("/");
  }, [openCart, addItem, router]);

  return null;
}
