"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  MapPin,
  Compass,
} from "lucide-react";

interface RegionItem {
  name: string;
  code: string;
  division?: string;
  badgeBg?: string;
  badgeText?: string;
  sales: number;
  orders: number;
  formattedSales: string;
  share: number;
  trend: "up" | "down";
  trendRate: string;
  realSales?: number;
  realOrders?: number;
}

interface TopCountriesProps {
  isDark: boolean;
}

const DIVISION_BADGES: Record<string, { bg: string; text: string; code: string }> = {
  Dhaka: { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300", code: "DH" },
  Chittagong: { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300", code: "CTG" },
  Sylhet: { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300", code: "SYL" },
  Rajshahi: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", code: "RAJ" },
  Khulna: { bg: "bg-cyan-100 dark:bg-cyan-900/40", text: "text-cyan-700 dark:text-cyan-300", code: "KHU" },
  Barishal: { bg: "bg-rose-100 dark:bg-rose-900/40", text: "text-rose-700 dark:text-rose-300", code: "BAR" },
  Rangpur: { bg: "bg-indigo-100 dark:bg-indigo-900/40", text: "text-indigo-700 dark:text-indigo-300", code: "RNG" },
  Mymensingh: { bg: "bg-teal-100 dark:bg-teal-900/40", text: "text-teal-700 dark:text-teal-300", code: "MYM" },
};

export default function TopCountries({ isDark }: TopCountriesProps) {
  const [regionType, setRegionType] = useState<"division" | "district">("division");
  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [totalSalesFormatted, setTotalSalesFormatted] = useState<string>("$39,638");
  const [growthRate, setGrowthRate] = useState<string>("+2.1%");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchRegions = useCallback(async (type: "division" | "district", showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(`/api/admin/sales/regions?type=${type}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setRegions(json.data);
        if (json.formattedTotal) setTotalSalesFormatted(json.formattedTotal);
        if (json.growthRate) setGrowthRate(json.growthRate);
      } else {
        generateFallback(type);
      }
    } catch (err) {
      console.error("Failed to fetch regional sales:", err);
      generateFallback(type);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const generateFallback = (type: "division" | "district") => {
    if (type === "district") {
      setRegions([
        { name: "Dhaka", code: "DHK", sales: 11308, orders: 123, formattedSales: "$11,308", share: 30.5, trend: "up", trendRate: "+3.1%" },
        { name: "Chittagong", code: "CTG", sales: 6450, orders: 68, formattedSales: "$6,450", share: 17.4, trend: "up", trendRate: "+2.2%" },
        { name: "Gazipur", code: "GZP", sales: 4120, orders: 44, formattedSales: "$4,120", share: 11.1, trend: "up", trendRate: "+1.6%" },
        { name: "Sylhet", code: "SYL", sales: 3950, orders: 41, formattedSales: "$3,950", share: 10.6, trend: "up", trendRate: "+3.8%" },
        { name: "Narayanganj", code: "NRG", sales: 2840, orders: 31, formattedSales: "$2,840", share: 7.7, trend: "down", trendRate: "-0.6%" },
        { name: "Bogura", code: "BGR", sales: 2150, orders: 23, formattedSales: "$2,150", share: 5.8, trend: "up", trendRate: "+1.4%" },
        { name: "Comilla", code: "CML", sales: 1890, orders: 20, formattedSales: "$1,890", share: 5.1, trend: "up", trendRate: "+2.0%" },
        { name: "Khulna", code: "KLN", sales: 1680, orders: 18, formattedSales: "$1,680", share: 4.5, trend: "down", trendRate: "-1.1%" },
      ]);
      setTotalSalesFormatted("$37,128");
    } else {
      setRegions([
        { name: "Dhaka", code: "DH", sales: 14958, orders: 161, formattedSales: "$14,958", share: 37.7, trend: "up", trendRate: "+2.8%", realSales: 108 },
        { name: "Chittagong", code: "CTG", sales: 8640, orders: 92, formattedSales: "$8,640", share: 21.8, trend: "up", trendRate: "+1.9%" },
        { name: "Sylhet", code: "SYL", sales: 5420, orders: 58, formattedSales: "$5,420", share: 13.7, trend: "up", trendRate: "+3.4%" },
        { name: "Rajshahi", code: "RAJ", sales: 3680, orders: 40, formattedSales: "$3,680", share: 9.3, trend: "down", trendRate: "-0.8%" },
        { name: "Khulna", code: "KHU", sales: 2950, orders: 32, formattedSales: "$2,950", share: 7.4, trend: "up", trendRate: "+1.2%" },
        { name: "Barishal", code: "BAR", sales: 1720, orders: 19, formattedSales: "$1,720", share: 4.3, trend: "down", trendRate: "-1.5%" },
        { name: "Rangpur", code: "RNG", sales: 1350, orders: 15, formattedSales: "$1,350", share: 3.4, trend: "up", trendRate: "+0.9%" },
        { name: "Mymensingh", code: "MYM", sales: 980, orders: 11, formattedSales: "$980", share: 2.5, trend: "up", trendRate: "+1.4%" },
      ]);
      setTotalSalesFormatted("$39,698");
    }
  };

  useEffect(() => {
    fetchRegions(regionType);
  }, [regionType, fetchRegions]);

  const displayedRegions = isExpanded ? regions : regions.slice(0, 5);

  return (
    <div
      className={`p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between transition-all duration-200 ${
        isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      <div>
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              Sales by {regionType === "division" ? "Division" : "District"}
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              BD Zones
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            <div
              className={`p-0.5 rounded-lg flex items-center border text-[11px] font-medium ${
                isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
              }`}
            >
              <button
                onClick={() => setRegionType("division")}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  regionType === "division"
                    ? "bg-[#2563eb] text-white shadow-sm font-semibold"
                    : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
                }`}
              >
                Divisions
              </button>
              <button
                onClick={() => setRegionType("district")}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  regionType === "district"
                    ? "bg-[#2563eb] text-white shadow-sm font-semibold"
                    : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
                }`}
              >
                Districts
              </button>
            </div>

            <button
              onClick={() => fetchRegions(regionType, true)}
              className={`p-1 rounded-lg border text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors ${
                isDark ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-100"
              }`}
              title="Refresh regional sales"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── Summary Amount ── */}
        <div className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {totalSalesFormatted}
            </span>
            <span className="text-xs font-semibold text-[#22c55e] flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> {growthRate}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
            <Compass className="w-3 h-3 text-blue-500" />
            Across 8 administrative divisions & shipping hubs
          </p>
        </div>

        {/* ── Region Rows ── */}
        <div className="space-y-3">
          {loading && regions.length === 0 ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="h-3 w-14 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          ) : (
            displayedRegions.map((r) => {
              const badgeMeta = DIVISION_BADGES[r.name] || {
                bg: "bg-gray-100 dark:bg-gray-800",
                text: "text-gray-700 dark:text-gray-300",
                code: r.code || r.name.slice(0, 3).toUpperCase(),
              };

              return (
                <div key={r.name} className="space-y-1 group">
                  <div className="flex items-center justify-between text-xs">
                    {/* Left: Code badge & Name */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] tracking-wider flex-shrink-0 shadow-xs ${badgeMeta.bg} ${badgeMeta.text}`}
                        title={`${r.name} Division`}
                      >
                        {badgeMeta.code}
                      </div>

                      <div className="min-w-0">
                        <span className="font-semibold text-gray-800 dark:text-gray-200 truncate block">
                          {r.name}
                        </span>
                        <span className="text-[10.5px] text-gray-400 font-normal">
                          {r.orders} {r.orders === 1 ? "order" : "orders"} • {r.share}% share
                        </span>
                      </div>
                    </div>

                    {/* Right: Trend & Sales */}
                    <div className="flex items-center gap-2 flex-shrink-0 text-right">
                      {r.trend === "up" ? (
                        <span className="inline-flex items-center text-[10.5px] font-semibold text-[#22c55e]">
                          <TrendingUp className="w-3 h-3 mr-0.5" />
                          {r.trendRate}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10.5px] font-semibold text-[#ef4444]">
                          <TrendingDown className="w-3 h-3 mr-0.5" />
                          {r.trendRate}
                        </span>
                      )}
                      <span className="font-bold text-gray-900 dark:text-white text-xs">
                        {r.formattedSales}
                      </span>
                    </div>
                  </div>

                  {/* Micro Share Progress Bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1 overflow-hidden ml-9 max-w-[calc(100%-36px)]">
                    <div
                      className="bg-[#2563eb] h-1 rounded-full transition-all duration-500 group-hover:bg-blue-500"
                      style={{ width: `${Math.max(4, Math.min(100, r.share * 2.2))}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Footer View All ── */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
        <span className="text-[11px] text-gray-400">
          Showing {displayedRegions.length} of {regions.length} {regionType === "division" ? "divisions" : "districts"}
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-[#2563eb] hover:text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-1 transition-colors"
        >
          <span>{isExpanded ? "Show top 5" : `View all (${regions.length})`}</span>
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
