"use client";

import React from "react";
import { ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import { TOP_COUNTRIES } from "./data";

interface TopCountriesProps {
  isDark: boolean;
}

export default function TopCountries({ isDark }: TopCountriesProps) {
  return (
    <div
      className={`p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
        isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
          Top Countries By Sales
        </h2>
        <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 font-medium">
          View all <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Summary amount */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900 dark:text-white">$37,802</span>
          <span className="text-xs font-semibold text-[#22c55e] flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" /> 1.56%
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5">since last weekend</p>
      </div>

      {/* Countries list */}
      <div className="space-y-3">
        {TOP_COUNTRIES.map((c) => (
          <div key={c.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <c.Flag />
              <span className="font-medium text-gray-700 dark:text-gray-300">{c.name}</span>
            </div>

            <div className="flex items-center gap-2">
              {c.trend === "up" ? (
                <TrendingUp className="w-3.5 h-3.5 text-[#22c55e]" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-[#ef4444]" />
              )}
              <span className="font-bold text-gray-800 dark:text-gray-100">{c.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
