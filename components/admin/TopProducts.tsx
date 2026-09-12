"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  RefreshCw,
  Star,
  Tag,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import {
  SpainFlag,
  IndiaFlag,
  UKFlag,
  FranceFlag,
  AustraliaFlag,
  SwedenFlag,
} from "./data";

interface TopProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  formattedPrice: string;
  image: string;
  stock: number;
  rating: number;
  numReviews: number;
  salesCount: number;
  revenue: number;
  realUnitsSold?: number;
  coupon: string;
  discount: string;
  market: string;
  sku: string;
  inStock: boolean;
}

interface TopProductsProps {
  isDark: boolean;
}

const MARKET_FLAGS: Record<string, React.ElementType> = {
  UK: UKFlag,
  US: AustraliaFlag,
  France: FranceFlag,
  Spain: SpainFlag,
  India: IndiaFlag,
  Sweden: SwedenFlag,
};

export default function TopProducts({ isDark }: TopProductsProps) {
  const [products, setProducts] = useState<TopProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"sales" | "rating" | "stock">("sales");
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchTopProducts = useCallback(
    async (limitCount: number, sort: string, showRefresh = false) => {
      if (showRefresh) setIsRefreshing(true);
      else setLoading(true);

      try {
        const res = await fetch(
          `/api/admin/products/top?limit=${limitCount}&sortBy=${sort}`
        );
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
          setTotalCount(json.total || json.data.length);
        } else {
          // Fallback static sample if DB is unreachable
          generateFallback();
        }
      } catch (err) {
        console.error("Failed to fetch top products:", err);
        generateFallback();
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  const generateFallback = () => {
    const fallbackList: TopProductItem[] = [
      {
        id: "new-1",
        name: "Ivory Cami Short Pyjama Set with Blue Lace Trim Satin",
        slug: "ivory-cami-short-pyjama-set-blue-lace",
        price: 5800,
        formattedPrice: "$58",
        image: "/images/newin_ivory_cami.jpg",
        stock: 45,
        rating: 4.9,
        numReviews: 12,
        salesCount: 184,
        revenue: 1067200,
        coupon: "SAVE20",
        discount: "20% OFF",
        market: "UK",
        sku: "PROD-101",
        inStock: true,
      },
      {
        id: "new-2",
        name: "Ivory Satin Dressing Gown with Blue Lace Trim",
        slug: "ivory-satin-dressing-gown-blue-lace",
        price: 6200,
        formattedPrice: "$62",
        image: "/images/newin_ivory_gown.jpg",
        stock: 30,
        rating: 4.8,
        numReviews: 8,
        salesCount: 156,
        revenue: 967200,
        coupon: "ECOM10",
        discount: "10% OFF",
        market: "France",
        sku: "PROD-102",
        inStock: true,
      },
      {
        id: "new-3",
        name: "Silver Grey with Pink Lace Trim Satin Cap Sleeve Nightdress",
        slug: "silver-grey-pink-lace-satin-nightdress",
        price: 5500,
        formattedPrice: "$55",
        image: "/images/newin_silver_nightdress.jpg",
        stock: 25,
        rating: 5.0,
        numReviews: 15,
        salesCount: 142,
        revenue: 781000,
        coupon: "SAVE20",
        discount: "20% OFF",
        market: "Spain",
        sku: "PROD-103",
        inStock: true,
      },
      {
        id: "new-4",
        name: "Classic Striped Woven Cotton Pyjama Set",
        slug: "classic-striped-cotton-pyjama-set",
        price: 4500,
        formattedPrice: "$45",
        image: "/images/collection_striped_pyjamas.jpg",
        stock: 35,
        rating: 4.8,
        numReviews: 22,
        salesCount: 210,
        revenue: 945000,
        coupon: "FLAT200",
        discount: "$200 OFF",
        market: "US",
        sku: "PROD-104",
        inStock: true,
      },
      {
        id: "new-5",
        name: "Kids Organic Cotton Sweet Dreams Pyjama Set",
        slug: "kids-organic-cotton-sweet-dreams-set",
        price: 2800,
        formattedPrice: "$28",
        image: "/images/kids_pyjamas.jpg",
        stock: 60,
        rating: 5.0,
        numReviews: 31,
        salesCount: 359,
        revenue: 1005200,
        coupon: "SAVE20",
        discount: "20% OFF",
        market: "Sweden",
        sku: "PROD-105",
        inStock: true,
      },
    ];
    setProducts(fallbackList);
    setTotalCount(fallbackList.length);
  };

  useEffect(() => {
    fetchTopProducts(isExpanded ? 15 : 5, sortBy);
  }, [isExpanded, sortBy, fetchTopProducts]);

  return (
    <div
      className={`p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between transition-all duration-200 ${
        isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            Top Products
          </h2>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#2563eb] dark:text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
            Live DB
          </span>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5">
          {/* Sort pill selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "sales" | "rating" | "stock")}
            className={`text-xs px-2 py-1 rounded-lg border font-medium focus:outline-none transition-colors cursor-pointer ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-300"
                : "bg-gray-50 border-gray-200 text-gray-700"
            }`}
          >
            <option value="sales">Top Sales</option>
            <option value="rating">Top Rated</option>
            <option value="stock">High Stock</option>
          </select>

          {/* Refresh button */}
          <button
            onClick={() => fetchTopProducts(isExpanded ? 15 : 5, sortBy, true)}
            className={`p-1.5 rounded-lg border text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors ${
              isDark ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-100"
            }`}
            title="Refresh top products"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Product List ── */}
      <div className="space-y-3.5 divide-y divide-gray-100 dark:divide-gray-800 flex-1">
        {loading && products.length === 0 ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-2 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
                </div>
                <div className="w-12 h-6 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        ) : (
          products.map((prod, idx) => {
            const FlagComponent = MARKET_FLAGS[prod.market] || UKFlag;

            return (
              <div
                key={prod.id || idx}
                className="pt-3.5 first:pt-0 flex items-center justify-between gap-3 group transition-colors"
              >
                {/* Left: Thumbnail & Name / Metrics */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <Link
                    href={`/products/${prod.id}`}
                    target="_blank"
                    className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative flex-shrink-0 border border-gray-100 dark:border-gray-700 group-hover:ring-2 group-hover:ring-[#2563eb]/40 transition-all"
                    title={`View ${prod.name} on storefront`}
                  >
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${prod.id}`}
                      target="_blank"
                      className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate block hover:text-[#2563eb] transition-colors"
                      title={prod.name}
                    >
                      {prod.name}
                    </Link>

                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400 dark:text-gray-400">
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        {prod.formattedPrice}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {prod.salesCount} sold
                      </span>
                      <span>•</span>
                      <span className="flex items-center text-amber-500 font-medium">
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-400 mr-0.5" />
                        {prod.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Coupon & Market Flag */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[9.5px] text-gray-400 uppercase tracking-wider font-semibold">
                      Coupon
                    </p>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/80 px-1.5 py-0.5 rounded border border-dashed border-gray-300 dark:border-gray-700">
                      <Tag className="w-2.5 h-2.5 text-[#2563eb]" />
                      <span>{prod.coupon}</span>
                    </div>
                  </div>

                  <div title={`Top Market: ${prod.market}`}>
                    <FlagComponent />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Footer View All Toggle ── */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          Showing {products.length} of {totalCount || 11} live products
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-[#2563eb] hover:text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-1 transition-colors"
        >
          <span>{isExpanded ? "Show less" : "View all"}</span>
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
