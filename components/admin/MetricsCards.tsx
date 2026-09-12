"use client";

import React from "react";
import { ShoppingBag, DollarSign, FileText, Users, TrendingUp, TrendingDown } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import {
  SALES_SPARKLINE,
  INCOME_SPARKLINE,
  ORDERS_PAID_SPARKLINE,
  VISITOR_SPARKLINE,
} from "./data";

interface MetricsCardsProps {
  isDark: boolean;
}

export default function MetricsCards({ isDark }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Total Sales */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${
          isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#22c55e] flex items-center justify-center text-white shadow-sm shadow-green-500/20 flex-shrink-0">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 ml-3 sm:ml-4">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-400">Total Sales</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
              34,945
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#22c55e]">
            <TrendingUp className="w-3.5 h-3.5" />
            1.56%
          </div>
        </div>

        {/* Sparkline chart */}
        <div className="h-10 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SALES_SPARKLINE}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#greenGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Total Income */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${
          isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#f97316] flex items-center justify-center text-white shadow-sm shadow-orange-500/20 flex-shrink-0">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 ml-3 sm:ml-4">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-400">Total Income</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
              $37,802
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#ef4444]">
            <TrendingDown className="w-3.5 h-3.5" />
            1.56%
          </div>
        </div>

        {/* Sparkline chart */}
        <div className="h-10 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={INCOME_SPARKLINE}>
              <defs>
                <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#f97316"
                strokeWidth={2.5}
                fill="url(#orangeGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Orders Paid */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${
          isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#cbd5e1] dark:bg-gray-700 flex items-center justify-center text-white dark:text-gray-300 shadow-sm flex-shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 ml-3 sm:ml-4">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-400">Orders Paid</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
              34,945
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-400">
            <TrendingUp className="w-3.5 h-3.5" />
            0.00%
          </div>
        </div>

        {/* Sparkline chart */}
        <div className="h-10 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ORDERS_PAID_SPARKLINE}>
              <defs>
                <linearGradient id="grayGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#94a3b8"
                strokeWidth={2.5}
                fill="url(#grayGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Total Visitor */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${
          isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#2563eb] flex items-center justify-center text-white shadow-sm shadow-blue-500/20 flex-shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 ml-3 sm:ml-4">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-400">Total Visitor</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
              34,945
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#22c55e]">
            <TrendingUp className="w-3.5 h-3.5" />
            1.56%
          </div>
        </div>

        {/* Sparkline chart */}
        <div className="h-10 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={VISITOR_SPARKLINE}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#2563eb"
                strokeWidth={2.5}
                fill="url(#blueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
