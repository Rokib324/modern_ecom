"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import { RECENT_ORDER_DATA } from "./data";

interface RecentOrdersChartProps {
  isDark: boolean;
}

export default function RecentOrdersChart({ isDark }: RecentOrdersChartProps) {
  return (
    <div
      className={`p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
        isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
          Recent Order
        </h2>
        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={RECENT_ORDER_DATA}>
            <defs>
              <linearGradient id="orderFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
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
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#orderFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
