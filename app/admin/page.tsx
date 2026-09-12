"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import MetricsCards from "@/components/admin/MetricsCards";
import RecentOrdersChart from "@/components/admin/RecentOrdersChart";
import TopProducts from "@/components/admin/TopProducts";
import TopCountries from "@/components/admin/TopCountries";
import BestSellersTable from "@/components/admin/BestSellersTable";
import ProductOverviewTable from "@/components/admin/ProductOverviewTable";
import OrdersTable from "@/components/admin/OrdersTable";
import EarningsChart from "@/components/admin/EarningsChart";
import NewComments from "@/components/admin/NewComments";
import SettingsDrawer from "@/components/admin/SettingsDrawer";
import CouponManagement from "@/components/admin/CouponManagement";
import SiteContentManager from "@/components/admin/SiteContentManager";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // Settings State
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [layoutWidth, setLayoutWidth] = useState<"full" | "boxed">("full");
  const [menuStyle, setMenuStyle] = useState<"click" | "hover" | "default">("click");
  const [menuPosition, setMenuPosition] = useState<"fixed" | "scrollable">("fixed");
  const [headerPosition, setHeaderPosition] = useState<"fixed" | "scrollable">("fixed");
  const [loaderEnabled, setLoaderEnabled] = useState(false);

  // UI Interactive States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(tabParam === "coupons" ? "coupons" : "dashboard");
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    category: false,
    attributes: false,
    order: false,
    user: false,
    roles: false,
    location: false,
    pages: false,
  });

  useEffect(() => {
    if (tabParam === "coupons") {
      setActiveMenu("coupons");
    }
  }, [tabParam]);

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isDark = themeMode === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark ? "bg-[#111827] text-gray-100" : "bg-[#f8fafc] text-gray-800"
      }`}
    >
      {/* ── Outer Shell Container ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Desktop + Mobile Drawer) */}
        <AdminSidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          isDark={isDark}
          menuPosition={menuPosition}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          openDropdowns={openDropdowns}
          toggleDropdown={toggleDropdown}
          onOpenSettings={() => setSettingsDrawerOpen(true)}
        />

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header Bar */}
          <AdminHeader
            isDark={isDark}
            setThemeMode={setThemeMode}
            headerPosition={headerPosition}
            setMobileSidebarOpen={setMobileSidebarOpen}
            onOpenSettings={() => setSettingsDrawerOpen(true)}
          />

          {/* Dashboard Content Body */}
          <main className="flex-1 p-3.5 sm:p-6 lg:p-7 space-y-5 sm:space-y-6">
            <div
              className={`mx-auto space-y-6 ${
                layoutWidth === "boxed" ? "max-w-[1340px]" : "w-full"
              }`}
            >
              {activeMenu === "coupons" ? (
                <CouponManagement isDark={isDark} />
              ) : activeMenu === "site-content" ? (
                <SiteContentManager isDark={isDark} />
              ) : (
                <>
                  {/* 1. Top 4 Metrics Cards */}
                  <MetricsCards isDark={isDark} />

                  {/* 2. Middle Row: Recent Order / Top Products / Top Countries */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
                    <div className="md:col-span-2 lg:col-span-5">
                      <RecentOrdersChart isDark={isDark} />
                    </div>
                    <div className="md:col-span-1 lg:col-span-4">
                      <TopProducts isDark={isDark} />
                    </div>
                    <div className="md:col-span-1 lg:col-span-3">
                      <TopCountries isDark={isDark} />
                    </div>
                  </div>

                  {/* 3. Second Row: Best Shop Sellers & Product Overview Tables */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
                    <div className="lg:col-span-5">
                      <BestSellersTable isDark={isDark} />
                    </div>
                    <div className="lg:col-span-7">
                      <ProductOverviewTable isDark={isDark} />
                    </div>
                  </div>

                  {/* 4. Third Row: Orders / Earnings / New Comments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
                    <div className="md:col-span-1 lg:col-span-4">
                      <OrdersTable isDark={isDark} />
                    </div>
                    <div className="md:col-span-2 lg:col-span-5">
                      <EarningsChart isDark={isDark} />
                    </div>
                    <div className="md:col-span-1 lg:col-span-3">
                      <NewComments isDark={isDark} />
                    </div>
                  </div>
                </>
              )}

              {/* Footer */}
              <footer className="pt-6 pb-2 text-center text-xs text-gray-400 dark:text-gray-500">
                Copyright © 2026 Ecom. Design by{" "}
                <span className="text-[#2563eb] hover:underline cursor-pointer">Rokib</span> All
                rights reserved.
              </footer>
            </div>
          </main>
        </div>
      </div>

      {/* Settings Drawer UI */}
      <SettingsDrawer
        isOpen={settingsDrawerOpen}
        onClose={() => setSettingsDrawerOpen(false)}
        isDark={isDark}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        layoutWidth={layoutWidth}
        setLayoutWidth={setLayoutWidth}
        menuStyle={menuStyle}
        setMenuStyle={setMenuStyle}
        menuPosition={menuPosition}
        setMenuPosition={setMenuPosition}
        headerPosition={headerPosition}
        setHeaderPosition={setHeaderPosition}
        loaderEnabled={loaderEnabled}
        setLoaderEnabled={setLoaderEnabled}
      />
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="w-8 h-8 rounded-full border-4 border-[#2563eb] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
