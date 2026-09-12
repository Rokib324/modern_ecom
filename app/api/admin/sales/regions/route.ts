import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { requireAdmin, errorResponse } from "@/lib/api-helpers";

interface DivisionConfig {
  name: string;
  code: string;
  badgeBg: string;
  badgeText: string;
  baseSales: number;
  baseOrders: number;
  trend: "up" | "down";
  trendRate: string;
}

const BD_DIVISIONS: DivisionConfig[] = [
  {
    name: "Dhaka",
    code: "DH",
    badgeBg: "bg-blue-100 dark:bg-blue-900/40",
    badgeText: "text-blue-700 dark:text-blue-300",
    baseSales: 14850,
    baseOrders: 160,
    trend: "up",
    trendRate: "+2.8%",
  },
  {
    name: "Chittagong",
    code: "CTG",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/40",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    baseSales: 8640,
    baseOrders: 92,
    trend: "up",
    trendRate: "+1.9%",
  },
  {
    name: "Sylhet",
    code: "SYL",
    badgeBg: "bg-purple-100 dark:bg-purple-900/40",
    badgeText: "text-purple-700 dark:text-purple-300",
    baseSales: 5420,
    baseOrders: 58,
    trend: "up",
    trendRate: "+3.4%",
  },
  {
    name: "Rajshahi",
    code: "RAJ",
    badgeBg: "bg-amber-100 dark:bg-amber-900/40",
    badgeText: "text-amber-700 dark:text-amber-300",
    baseSales: 3680,
    baseOrders: 40,
    trend: "down",
    trendRate: "-0.8%",
  },
  {
    name: "Khulna",
    code: "KHU",
    badgeBg: "bg-cyan-100 dark:bg-cyan-900/40",
    badgeText: "text-cyan-700 dark:text-cyan-300",
    baseSales: 2950,
    baseOrders: 32,
    trend: "up",
    trendRate: "+1.2%",
  },
  {
    name: "Barishal",
    code: "BAR",
    badgeBg: "bg-rose-100 dark:bg-rose-900/40",
    badgeText: "text-rose-700 dark:text-rose-300",
    baseSales: 1720,
    baseOrders: 19,
    trend: "down",
    trendRate: "-1.5%",
  },
  {
    name: "Rangpur",
    code: "RNG",
    badgeBg: "bg-indigo-100 dark:bg-indigo-900/40",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    baseSales: 1350,
    baseOrders: 15,
    trend: "up",
    trendRate: "+0.9%",
  },
  {
    name: "Mymensingh",
    code: "MYM",
    badgeBg: "bg-teal-100 dark:bg-teal-900/40",
    badgeText: "text-teal-700 dark:text-teal-300",
    baseSales: 980,
    baseOrders: 11,
    trend: "up",
    trendRate: "+1.4%",
  },
];

const BD_DISTRICTS = [
  { name: "Dhaka", division: "Dhaka", code: "DHK", baseSales: 11200, baseOrders: 122, trend: "up" as const, trendRate: "+3.1%" },
  { name: "Chittagong", division: "Chittagong", code: "CTG", baseSales: 6450, baseOrders: 68, trend: "up" as const, trendRate: "+2.2%" },
  { name: "Gazipur", division: "Dhaka", code: "GZP", baseSales: 4120, baseOrders: 44, trend: "up" as const, trendRate: "+1.6%" },
  { name: "Sylhet", division: "Sylhet", code: "SYL", baseSales: 3950, baseOrders: 41, trend: "up" as const, trendRate: "+3.8%" },
  { name: "Narayanganj", division: "Dhaka", code: "NRG", baseSales: 2840, baseOrders: 31, trend: "down" as const, trendRate: "-0.6%" },
  { name: "Bogura", division: "Rajshahi", code: "BGR", baseSales: 2150, baseOrders: 23, trend: "up" as const, trendRate: "+1.4%" },
  { name: "Comilla", division: "Chittagong", code: "CML", baseSales: 1890, baseOrders: 20, trend: "up" as const, trendRate: "+2.0%" },
  { name: "Khulna", division: "Khulna", code: "KLN", baseSales: 1680, baseOrders: 18, trend: "down" as const, trendRate: "-1.1%" },
  { name: "Cox's Bazar", division: "Chittagong", code: "CXB", baseSales: 1420, baseOrders: 15, trend: "up" as const, trendRate: "+4.2%" },
  { name: "Rajshahi", division: "Rajshahi", code: "RAJ", baseSales: 1250, baseOrders: 14, trend: "down" as const, trendRate: "-0.9%" },
];

export async function GET(request: NextRequest) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError && process.env.NODE_ENV !== "development") {
      return authError;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "division"; // "division" | "district"
    const mode = searchParams.get("mode") || "all"; // "all" | "real"

    if (type === "district") {
      // Aggregate real orders by shippingAddress.district
      const realDistrictAgg = await Order.aggregate([
        {
          $group: {
            _id: { $toLower: { $ifNull: ["$shippingAddress.district", ""] } },
            sales: { $sum: "$totalPrice" },
            orders: { $sum: 1 },
          },
        },
      ]);

      const realMap = new Map<string, { sales: number; orders: number }>();
      for (const item of realDistrictAgg) {
        if (item._id) {
          realMap.set(String(item._id).trim().toLowerCase(), {
            sales: item.sales || 0,
            orders: item.orders || 0,
          });
        }
      }

      const results = BD_DISTRICTS.map((d) => {
        const real = realMap.get(d.name.toLowerCase()) || { sales: 0, orders: 0 };
        const sales = mode === "real" ? real.sales : d.baseSales + real.sales;
        const orders = mode === "real" ? real.orders : d.baseOrders + real.orders;

        return {
          name: d.name,
          division: d.division,
          code: d.code,
          sales,
          orders,
          trend: d.trend,
          trendRate: d.trendRate,
          realSales: real.sales,
          realOrders: real.orders,
        };
      });

      results.sort((a, b) => b.sales - a.sales);
      const totalSales = results.reduce((acc, r) => acc + r.sales, 0);
      const totalOrders = results.reduce((acc, r) => acc + r.orders, 0);

      const enriched = results.map((r) => ({
        ...r,
        formattedSales: `$${r.sales.toLocaleString()}`,
        share: totalSales > 0 ? Math.round((r.sales / totalSales) * 1000) / 10 : 0,
      }));

      return NextResponse.json({
        success: true,
        type: "district",
        data: enriched,
        totalSales,
        formattedTotal: `$${totalSales.toLocaleString()}`,
        totalOrders,
        growthRate: "+1.9%",
      });
    }

    // Default: By Division
    const realDivisionAgg = await Order.aggregate([
      {
        $group: {
          _id: { $toLower: { $ifNull: ["$shippingAddress.division", ""] } },
          sales: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
    ]);

    const realMap = new Map<string, { sales: number; orders: number }>();
    for (const item of realDivisionAgg) {
      if (item._id) {
        realMap.set(String(item._id).trim().toLowerCase(), {
          sales: item.sales || 0,
          orders: item.orders || 0,
        });
      }
    }

    const results = BD_DIVISIONS.map((d) => {
      const real = realMap.get(d.name.toLowerCase()) || { sales: 0, orders: 0 };
      const sales = mode === "real" ? real.sales : d.baseSales + real.sales;
      const orders = mode === "real" ? real.orders : d.baseOrders + real.orders;

      return {
        name: d.name,
        code: d.code,
        badgeBg: d.badgeBg,
        badgeText: d.badgeText,
        sales,
        orders,
        trend: d.trend,
        trendRate: d.trendRate,
        realSales: real.sales,
        realOrders: real.orders,
      };
    });

    results.sort((a, b) => b.sales - a.sales);
    const totalSales = results.reduce((acc, r) => acc + r.sales, 0);
    const totalOrders = results.reduce((acc, r) => acc + r.orders, 0);

    const enriched = results.map((r) => ({
      ...r,
      formattedSales: `$${r.sales.toLocaleString()}`,
      share: totalSales > 0 ? Math.round((r.sales / totalSales) * 1000) / 10 : 0,
    }));

    return NextResponse.json({
      success: true,
      type: "division",
      data: enriched,
      totalSales,
      formattedTotal: `$${totalSales.toLocaleString()}`,
      totalOrders,
      growthRate: "+2.1%",
    });
  } catch (error) {
    console.error("Sales by region API error:", error);
    return errorResponse("Failed to fetch regional sales", 500);
  }
}
