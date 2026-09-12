"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Ticket,
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Users,
  Percent,
  RefreshCw,
  Sparkles,
  X,
  Calendar,
  AlertTriangle,
} from "lucide-react";

interface CouponItem {
  _id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number | null;
  startDate: string;
  expiryDate?: string | null;
  usageLimit?: number | null;
  usedCount: number;
  userLimit: number;
  isActive: boolean;
  createdAt: string;
}

interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  totalRedemptions: number;
  totalDiscountGiven: number;
}

interface CouponManagementProps {
  isDark: boolean;
}

export default function CouponManagement({ isDark }: CouponManagementProps) {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [stats, setStats] = useState<CouponStats>({
    totalCoupons: 0,
    activeCoupons: 0,
    totalRedemptions: 0,
    totalDiscountGiven: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "expired">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "percentage" | "fixed">("all");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<CouponItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: "" as number | string,
    startDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    usageLimit: "" as number | string,
    userLimit: 1,
    isActive: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch Coupons from API
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);

      const res = await fetch(`/api/admin/coupons?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, typeFilter]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Copy code helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Toggle active status switch
  const handleToggleStatus = async (coupon: CouponItem) => {
    const nextStatus = !coupon.isActive;
    // Optimistic update
    setCoupons((prev) =>
      prev.map((c) => (c._id === coupon._id ? { ...c, isActive: nextStatus } : c))
    );

    try {
      const res = await fetch(`/api/admin/coupons/${coupon._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on error
        setCoupons((prev) =>
          prev.map((c) => (c._id === coupon._id ? { ...c, isActive: coupon.isActive } : c))
        );
      } else {
        // Update stats
        setStats((prev) => ({
          ...prev,
          activeCoupons: nextStatus ? prev.activeCoupons + 1 : Math.max(0, prev.activeCoupons - 1),
        }));
      }
    } catch {
      setCoupons((prev) =>
        prev.map((c) => (c._id === coupon._id ? { ...c, isActive: coupon.isActive } : c))
      );
    }
  };

  // Generate random promo code helper
  const generateRandomCode = () => {
    const prefixes = ["PROMO", "SAVE", "FLASH", "DEAL", "ECOM", "SUPER", "VIP"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(10 + Math.random() * 90);
    setFormData((prev) => ({ ...prev, code: `${prefix}${num}` }));
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 15,
      minOrderAmount: 500,
      maxDiscountAmount: 300,
      startDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      usageLimit: 100,
      userLimit: 1,
      isActive: true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (coupon: CouponItem) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount !== null && coupon.maxDiscountAmount !== undefined ? coupon.maxDiscountAmount : "",
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split("T")[0] : "",
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split("T")[0] : "",
      usageLimit: coupon.usageLimit !== null && coupon.usageLimit !== undefined ? coupon.usageLimit : "",
      userLimit: coupon.userLimit || 1,
      isActive: coupon.isActive,
    });
    setFormError(null);
    setModalOpen(true);
  };

  // Save Coupon (Create or Update)
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.code.trim()) {
      setFormError("Coupon code is required");
      return;
    }
    if (formData.discountValue <= 0) {
      setFormError("Discount value must be greater than 0");
      return;
    }
    if (formData.discountType === "percentage" && formData.discountValue > 100) {
      setFormError("Percentage discount cannot exceed 100%");
      return;
    }

    setFormSubmitting(true);
    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim() || undefined,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        maxDiscountAmount:
          formData.maxDiscountAmount !== "" && formData.discountType === "percentage"
            ? Number(formData.maxDiscountAmount)
            : null,
        startDate: formData.startDate || undefined,
        expiryDate: formData.expiryDate ? formData.expiryDate : null,
        usageLimit: formData.usageLimit !== "" ? Number(formData.usageLimit) : null,
        userLimit: Number(formData.userLimit) || 1,
        isActive: formData.isActive,
      };

      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon._id}`
        : "/api/admin/coupons";
      const method = editingCoupon ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        setFormError(data.error || "Failed to save coupon");
      } else {
        setModalOpen(false);
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Coupon
  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return;
    try {
      const res = await fetch(`/api/admin/coupons/${couponToDelete._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.filter((c) => c._id !== couponToDelete._id));
        setStats((prev) => ({
          ...prev,
          totalCoupons: Math.max(0, prev.totalCoupons - 1),
          activeCoupons: couponToDelete.isActive
            ? Math.max(0, prev.activeCoupons - 1)
            : prev.activeCoupons,
        }));
        setDeleteModalOpen(false);
        setCouponToDelete(null);
      }
    } catch (err) {
      console.error("Failed to delete coupon:", err);
    }
  };

  // Helper to determine status display
  const getCouponStatus = (coupon: CouponItem) => {
    const now = new Date();
    if (!coupon.isActive) {
      return { label: "Inactive", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
    }
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return { label: "Scheduled", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" };
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
      return { label: "Expired", color: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300" };
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { label: "Limit Reached", color: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" };
    }
    return { label: "Active", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" };
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Top Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-[#2563eb] flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            Coupons & Discounts
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create, manage, and track promotional vouchers and customer discount rules.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchCoupons}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Refresh coupons"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* ── 2. Summary Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Coupons */}
        <div
          className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${
            isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Coupons</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.totalCoupons}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        {/* Active Coupons */}
        <div
          className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${
            isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Active Now</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.activeCoupons}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Total Redemptions */}
        <div
          className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${
            isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Times Redeemed</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {stats.totalRedemptions}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Savings */}
        <div
          className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${
            isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Discounts Given</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              ৳{stats.totalDiscountGiven.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── 3. Filters & Search Toolbar ── */}
      <div
        className={`p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between ${
          isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-colors ${
              isDark
                ? "bg-gray-800/80 border-gray-700 text-white placeholder-gray-500 focus:border-[#2563eb]"
                : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#2563eb]"
            }`}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-medium">
            {(["all", "active", "inactive", "expired"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  statusFilter === tab
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Discount Type Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | "percentage" | "fixed")}
            className={`px-3 py-2 text-xs rounded-xl border outline-none font-medium cursor-pointer ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-200"
                : "bg-gray-50 border-gray-200 text-gray-700"
            }`}
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (৳)</option>
          </select>
        </div>
      </div>

      {/* ── 4. Main Data Table ── */}
      <div
        className={`rounded-2xl border shadow-sm overflow-hidden ${
          isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3.5 px-5">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Min. Spend</th>
                <th className="py-3.5 px-4">Validity</th>
                <th className="py-3.5 px-4">Usage</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2563eb]" />
                    <p className="text-xs">Loading coupons...</p>
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Ticket className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      No coupons found
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try adjusting your filters or click &ldquo;Create Coupon&rdquo; to add a new one.
                    </p>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => {
                  const statusInfo = getCouponStatus(coupon);
                  const isPercentage = coupon.discountType === "percentage";
                  const percentUsed = coupon.usageLimit
                    ? Math.min(100, Math.round((coupon.usedCount / coupon.usageLimit) * 100))
                    : null;

                  return (
                    <tr
                      key={coupon._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      {/* Code & Description */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold tracking-wider text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            title="Copy code"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {coupon.description && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 max-w-[240px] truncate">
                            {coupon.description}
                          </p>
                        )}
                      </td>

                      {/* Discount Value */}
                      <td className="py-3.5 px-4 font-medium">
                        <div className="flex items-center gap-1.5">
                          {isPercentage ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                              <Percent className="w-3 h-3" />
                              {coupon.discountValue}% OFF
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                              ৳{coupon.discountValue} OFF
                            </span>
                          )}
                        </div>
                        {isPercentage && coupon.maxDiscountAmount && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Max: ৳{coupon.maxDiscountAmount}
                          </p>
                        )}
                      </td>

                      {/* Min Order */}
                      <td className="py-3.5 px-4">
                        {coupon.minOrderAmount > 0 ? (
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            ৳{coupon.minOrderAmount.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">No minimum</span>
                        )}
                      </td>

                      {/* Validity Period */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="text-gray-700 dark:text-gray-300">
                            {coupon.expiryDate ? (
                              new Date(coupon.expiryDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            ) : (
                              <span className="text-gray-400">No expiration</span>
                            )}
                          </p>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                      </td>

                      {/* Usage */}
                      <td className="py-3.5 px-4">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px] text-gray-500">
                            <span>{coupon.usedCount} used</span>
                            <span>{coupon.usageLimit ? `/ ${coupon.usageLimit}` : "∞"}</span>
                          </div>
                          {percentUsed !== null && (
                            <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  percentUsed >= 90
                                    ? "bg-red-500"
                                    : percentUsed >= 60
                                    ? "bg-amber-500"
                                    : "bg-blue-500"
                                }`}
                                style={{ width: `${percentUsed}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(coupon)}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            coupon.isActive ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
                          }`}
                          role="switch"
                          aria-checked={coupon.isActive}
                          title={coupon.isActive ? "Deactivate coupon" : "Activate coupon"}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              coupon.isActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(coupon)}
                            className="p-1.5 text-gray-500 hover:text-[#2563eb] hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Edit coupon"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setCouponToDelete(coupon);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Delete coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. Create / Edit Coupon Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className={`w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${
              isDark ? "bg-[#1f2937] border-gray-800 text-white" : "bg-white border-gray-100 text-gray-900"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#2563eb]" />
                <h3 className="font-bold text-base">
                  {editingCoupon ? `Edit Coupon "${editingCoupon.code}"` : "Create New Coupon"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveCoupon} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Code & Generator */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Coupon Code *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUMMER25"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                      }))
                    }
                    className={`flex-1 px-3.5 py-2.5 rounded-xl border outline-none font-bold uppercase tracking-wider ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white focus:border-[#2563eb]"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#2563eb]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5 transition-colors text-xs font-medium"
                    title="Generate code"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Auto</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Description / Campaign Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. 20% discount on order subtotal above ৳1,000"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white focus:border-[#2563eb]"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#2563eb]"
                  }`}
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Discount Type *
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, discountType: "percentage" }))}
                      className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
                        formData.discountType === "percentage"
                          ? "bg-white dark:bg-gray-700 text-[#2563eb] dark:text-blue-300 shadow-xs"
                          : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, discountType: "fixed" }))}
                      className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
                        formData.discountType === "fixed"
                          ? "bg-white dark:bg-gray-700 text-[#2563eb] dark:text-blue-300 shadow-xs"
                          : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      Fixed (৳)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    {formData.discountType === "percentage" ? "Percentage Value (%) *" : "Discount Value (৳) *"}
                  </label>
                  <input
                    type="number"
                    required
                    min={0.01}
                    max={formData.discountType === "percentage" ? 100 : 100000}
                    step="any"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-semibold ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white focus:border-[#2563eb]"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#2563eb]"
                    }`}
                  />
                </div>
              </div>

              {/* Minimum Order Amount & Max Discount (for %) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Min. Order Subtotal (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0 (No minimum)"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, minOrderAmount: parseFloat(e.target.value) || 0 }))
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white focus:border-[#2563eb]"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#2563eb]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Max Discount Cap (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    disabled={formData.discountType !== "percentage"}
                    placeholder={formData.discountType === "percentage" ? "No cap (optional)" : "N/A for fixed"}
                    value={formData.maxDiscountAmount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxDiscountAmount: e.target.value === "" ? "" : parseFloat(e.target.value) || 0,
                      }))
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none disabled:opacity-40 disabled:cursor-not-allowed ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white focus:border-[#2563eb]"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#2563eb]"
                    }`}
                  />
                </div>
              </div>

              {/* Validity Dates: Start Date & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white focus:border-[#2563eb]"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#2563eb]"
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Expiry Date
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, expiryDate: "" }))}
                      className="text-[11px] text-[#2563eb] hover:underline"
                    >
                      Clear (Never)
                    </button>
                  </div>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white focus:border-[#2563eb]"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#2563eb]"
                    }`}
                  />
                </div>
              </div>

              {/* Limits: Overall Usage & Per Customer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Total Usage Limit (Total Redemptions)
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="Leave empty for unlimited"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        usageLimit: e.target.value === "" ? "" : parseInt(e.target.value) || 1,
                      }))
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white focus:border-[#2563eb]"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#2563eb]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Per User Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.userLimit}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, userLimit: parseInt(e.target.value) || 1 }))
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white focus:border-[#2563eb]"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#2563eb]"
                    }`}
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <p className="font-semibold text-sm">Coupon Active Status</p>
                  <p className="text-xs text-gray-500">Allow customers to immediately apply this coupon</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.isActive ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                  role="switch"
                  aria-checked={formData.isActive}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      formData.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {formSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {editingCoupon ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 6. Delete Confirmation Dialog ── */}
      {deleteModalOpen && couponToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className={`w-full max-w-md rounded-2xl shadow-2xl border p-6 text-center ${
              isDark ? "bg-[#1f2937] border-gray-800 text-white" : "bg-white border-gray-100 text-gray-900"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold">Delete Coupon &ldquo;{couponToDelete.code}&rdquo;?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Are you sure you want to permanently delete this coupon? Customers will no longer be able to use it.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
