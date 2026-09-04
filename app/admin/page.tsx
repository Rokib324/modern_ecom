"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  PlusCircle,
} from "lucide-react";
import { formatBDT } from "@/lib/utils";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  lowStockProducts: number;
  statusCounts: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  recentOrders: Array<{
    _id: string;
    orderId: string;
    user?: { name: string; email: string };
    totalPrice: number;
    status: string;
    createdAt: string;
    isPaid: boolean;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        } else {
          setError(json.error || "Failed to load dashboard metrics");
        }
      } catch (err) {
        console.error(err);
        setError("Network error loading dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Products",
      value: stats ? stats.totalProducts.toString() : "—",
      subtext: stats?.lowStockProducts ? `${stats.lowStockProducts} low stock` : "All active",
      icon: Package,
      color: "bg-blue-500",
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: stats ? stats.totalOrders.toString() : "—",
      subtext: stats ? `${stats.statusCounts.pending} pending` : "Tracking live",
      icon: ShoppingBag,
      color: "bg-emerald-500",
      href: "/admin/orders",
    },
    {
      label: "Total Customers",
      value: stats ? stats.totalUsers.toString() : "—",
      subtext: "Registered users",
      icon: Users,
      color: "bg-purple-500",
      href: "/admin/users",
    },
    {
      label: "Total Revenue",
      value: stats ? formatBDT(stats.totalRevenue) : "—",
      subtext: "Paid orders",
      icon: TrendingUp,
      color: "bg-amber-500",
      href: "/admin/orders",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Live store analytics & operations overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-[#2c1810] text-white hover:bg-[#3d2317] px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            New Product
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Storefront
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map(({ label, value, subtext, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
            </div>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
              <span className="text-xs text-gray-400">{subtext}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Orders Status Summary Bar */}
      {stats && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Order Pipeline</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-medium mb-1">
                <Clock className="w-3.5 h-3.5" /> Pending
              </div>
              <p className="text-2xl font-bold text-amber-900">{stats.statusCounts.pending}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-700 text-xs font-medium mb-1">
                <Package className="w-3.5 h-3.5" /> Processing
              </div>
              <p className="text-2xl font-bold text-blue-900">{stats.statusCounts.processing}</p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-medium mb-1">
                <Truck className="w-3.5 h-3.5" /> Shipped
              </div>
              <p className="text-2xl font-bold text-indigo-900">{stats.statusCounts.shipped}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
              </div>
              <p className="text-2xl font-bold text-emerald-900">{stats.statusCounts.delivered}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 text-xs font-medium mb-1">
                <AlertCircle className="w-3.5 h-3.5" /> Cancelled
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.statusCounts.cancelled}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Operations & Tools</h2>
          <div className="space-y-2.5">
            <Link
              href="/admin/products"
              className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 text-sm font-medium text-gray-800"
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-blue-500" />
                Product Catalog
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 text-sm font-medium text-gray-800"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-emerald-500" />
                Manage Orders & Tracking
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 text-sm font-medium text-gray-800"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-purple-500" />
                Customer Accounts
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Recent Store Orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-[#8c5238] hover:underline">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse p-3 border border-gray-100 rounded-xl">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : stats && stats.recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-gray-900">{order.orderId}</span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          order.status === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "shipped"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.status}
                      </span>
                      {order.isPaid && (
                        <span className="text-[10px] font-medium bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                          Paid
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.user?.name || "Customer"} · {new Date(order.createdAt).toLocaleDateString("en-BD")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatBDT(order.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              No orders placed yet. Orders will appear here in real-time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
