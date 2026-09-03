import { Metadata } from "next";
import ProductDetails from "../ProductDetails";

export const metadata: Metadata = {
  title: "Product Details — Ecom",
  description: "View luxury nightwear and pyjamas at Ecom.",
};

export default function ProductDetailPage() {
  return <ProductDetails />;
}
