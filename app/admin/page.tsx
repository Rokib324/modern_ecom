import { Metadata } from "next";
import Link from "next/link";
import { Package, ShoppingBag, Users, TrendingUp, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const stats = [
  { label: "Total Products", value: "—", icon: Package, color: "bg-blue-500", href: "/admin/products" },
  { label: "Total Orders", value: "—", icon: ShoppingBag, color: "bg-green-500", href: "/admin/orders" },
  { label: "Total Users", value: "—", icon: Users, color: "bg-purple-500", href: "/admin/users" },
  { label: "Revenue", value: "—", icon: TrendingUp, color: "bg-orange-500", href: "/admin/orders" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm font-medium text-gray-700 hover:text-indigo-700"
            >
              <Package className="w-5 h-5 text-indigo-500" />
              Add New Product
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm font-medium text-gray-700 hover:text-indigo-700"
            >
              <ShoppingBag className="w-5 h-5 text-indigo-500" />
              Manage Orders
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm font-medium text-gray-700 hover:text-indigo-700"
            >
              <Users className="w-5 h-5 text-indigo-500" />
              Manage Users
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-sm text-gray-500">Connect to your API to load recent orders and activities.</p>
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
