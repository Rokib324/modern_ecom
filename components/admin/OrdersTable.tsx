"use client";

import React from "react";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { ORDERS_LIST } from "./data";

interface OrdersTableProps {
  isDark: boolean;
}

export default function OrdersTable({ isDark }: OrdersTableProps) {
  return (
    <div
      className={`p-4 sm:p-6 rounded-2xl border shadow-sm ${
        isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Orders</h2>
        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
        <table className="w-full min-w-[320px] text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider font-semibold">
              <th className="pb-2.5">Product</th>
              <th className="pb-2.5">Price</th>
              <th className="pb-2.5 text-right">Del</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {ORDERS_LIST.map((ord) => (
              <tr key={ord.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                <td className="py-3 pr-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 relative flex-shrink-0">
                      <Image
                        src={ord.image}
                        alt={ord.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[130px] underline underline-offset-2 cursor-pointer">
                      {ord.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-gray-400 whitespace-nowrap">{ord.date}</td>
                <td className="py-3 pl-2 text-right font-semibold text-gray-700 dark:text-gray-300">
                  {ord.delivery}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
