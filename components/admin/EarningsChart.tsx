"use client";

import React from "react";
import { MoreHorizontal, TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { EARNINGS_DATA } from "./data";

interface EarningsChartProps {
  isDark: boolean;
}

export default function EarningsChart({ isDark }: EarningsChartProps) {
  return (
    <div
      className={`p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
        isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
            Earnings
          </h2>
          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Chart Legend with Figures */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
              Revenue
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-bold text-gray-900 dark:text-white">
                $37,802
              </span>
              <span className="text-[11px] font-semibold text-[#22c55e] flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> 0.56%
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-[#93c5fd]" />
              Profit
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-bold text-gray-900 dark:text-white">
                $28,305
              </span>
              <span className="text-[11px] font-semibold text-[#22c55e] flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> 0.56%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Bar Chart */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={EARNINGS_DATA} barGap={4}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#64748b" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#111827" : "#ffffff",
                borderColor: isDark ? "#374151" : "#e2e8f0",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill="#93c5fd" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
