"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { TOP_PRODUCTS } from "./data";

interface TopProductsProps {
  isDark: boolean;
}

export default function TopProducts({ isDark }: TopProductsProps) {
  return (
    <div
      className={`p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
        isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
          Top Products
        </h2>
        <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 font-medium">
          View all <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3.5 divide-y divide-gray-100 dark:divide-gray-800">
        {TOP_PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="pt-3.5 first:pt-0 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative flex-shrink-0">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate hover:text-[#2563eb] cursor-pointer">
                  {prod.name}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{prod.items}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                <p className="text-[10px] text-gray-400">Coupon Code</p>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  {prod.coupon}
                </p>
              </div>
              <prod.Flag />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
