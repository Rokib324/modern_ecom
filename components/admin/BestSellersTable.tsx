"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { BEST_SELLERS } from "./data";

interface BestSellersTableProps {
  isDark: boolean;
}

export default function BestSellersTable({ isDark }: BestSellersTableProps) {
  return (
    <div
      className={`p-4 sm:p-6 rounded-2xl border shadow-sm ${
        isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
          Best Shop Sellers
        </h2>
        <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 font-medium">
          View all <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
        <table className="w-full min-w-[460px] text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider font-semibold">
              <th className="pb-3">Shop</th>
              <th className="pb-3">Categories</th>
              <th className="pb-3">Total</th>
              <th className="pb-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {BEST_SELLERS.map((seller) => (
              <tr key={seller.name} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                <td className="py-3 pr-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0">
                      <Image
                        src={seller.avatar}
                        alt={seller.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 truncate underline underline-offset-2 cursor-pointer">
                        {seller.name}
                      </p>
                      <p className="text-[10px] text-gray-400">{seller.purchases}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 text-gray-500 dark:text-gray-400">
                  {seller.categories}
                </td>
                <td className="py-3 px-2 font-bold text-gray-800 dark:text-gray-200">
                  {seller.total}
                </td>
                <td className="py-3 pl-2 text-right">
                  <div className="inline-block w-8 h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <div className={`w-full h-full ${seller.barColor}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
