import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { requireAdmin, errorResponse } from "@/lib/api-helpers";

// GET /api/admin/stats — dashboard overview metrics
export async function GET() {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    await connectDB();

    const [
      totalOrders,
      totalUsers,
      totalProducts,
      lowStockProducts,
      revenueResult,
      ordersByStatus,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true, stock: { $lte: 5 } }),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Order.find()
        .populate("user", "name email image")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    const statusCounts: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    ordersByStatus.forEach((item) => {
      if (item._id) {
        statusCounts[item._id] = item.count;
      }
    });

    // 6-month revenue aggregation
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        lowStockProducts,
        statusCounts,
        recentOrders,
        monthlySales,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return errorResponse("Failed to fetch admin stats", 500);
  }
}
