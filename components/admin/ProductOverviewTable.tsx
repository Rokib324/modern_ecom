"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { PRODUCT_OVERVIEW } from "./data";

interface ProductOverviewTableProps {
  isDark: boolean;
}

export default function ProductOverviewTable({ isDark }: ProductOverviewTableProps) {
  const [currentPage, setCurrentPage] = useState(2);

  return (
    <div
      className={`p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
        isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
            Product overview
          </h2>
          <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 font-medium">
            View all <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
          <table className="w-full min-w-[540px] text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="pb-3">Name</th>
                <th className="pb-3">Product ID</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Sale</th>
                <th className="pb-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {PRODUCT_OVERVIEW.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 relative flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 truncate underline underline-offset-2 cursor-pointer max-w-[150px]">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-gray-500 dark:text-gray-400 font-mono text-[11px]">
                    {item.productId}
                  </td>
                  <td className="py-3 px-2 font-medium text-gray-800 dark:text-gray-200">
                    {item.price}
                  </td>
                  <td className="py-3 px-2 font-medium text-gray-600 dark:text-gray-300">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`text-[11px] font-medium ${
                        item.sale === "On sale" ? "text-[#22c55e]" : "text-gray-400"
                      }`}
                    >
                      {item.sale}
                    </span>
                  </td>
                  <td className="py-3 pl-2 text-right font-bold text-gray-900 dark:text-white">
                    {item.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination row */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
        <span>Showing 5 entries</span>
        <div className="flex items-center gap-1.5 font-medium">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              currentPage === 1
                ? "bg-[#2563eb] text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              currentPage === 2
                ? "bg-[#2563eb] text-white shadow-sm"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              currentPage === 3
                ? "bg-[#2563eb] text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            3
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
