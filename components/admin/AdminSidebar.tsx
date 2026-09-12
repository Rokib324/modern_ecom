"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronDown,
  Layers,
  Box,
  ClipboardList,
  User,
  UserPlus,
  Image as ImageIcon,
  BarChart3,
  MapPin,
  FileCode,
  HelpCircle,
  Headphones,
  PanelLeftClose,
  PanelLeft,
  X,
  ExternalLink,
  Settings,
} from "lucide-react";

interface AdminSidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (v: boolean) => void;
  isDark: boolean;
  menuPosition: "fixed" | "scrollable";
  activeMenu: string;
  setActiveMenu: (v: string) => void;
  openDropdowns: Record<string, boolean>;
  toggleDropdown: (key: string) => void;
  onOpenSettings: () => void;
}

export default function AdminSidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  isDark,
  menuPosition,
  activeMenu,
  setActiveMenu,
  openDropdowns,
  toggleDropdown,
  onOpenSettings,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40 lg:hidden transition-opacity"
        />
      )}

      {/* ══════════════════════════════════════════
          SIDEBAR (LEFT)
          ══════════════════════════════════════════ */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r flex flex-col z-50 lg:z-30 ${
          isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-200"
        } ${
          // Mobile & Tablet Drawer sliding
          mobileSidebarOpen
            ? "fixed inset-y-0 left-0 w-[270px] shadow-2xl translate-x-0"
            : "fixed inset-y-0 left-0 w-[270px] -translate-x-full lg:translate-x-0"
        } ${
          // Desktop width behavior
          sidebarCollapsed ? "lg:w-[72px]" : "lg:w-[260px]"
        } ${
          menuPosition === "fixed" ? "lg:sticky lg:top-0 lg:h-screen" : "lg:relative lg:min-h-screen"
        }`}
      >
        {/* Logo & Collapse Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 dark:border-gray-800">
          {!sidebarCollapsed || mobileSidebarOpen ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                R
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Remos
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              R
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {/* Mobile / Tablet close button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 select-none scrollbar-thin">
          {/* Top Single Item */}
          <div>
            <button
              onClick={() => setActiveMenu("product-detail-3")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeMenu === "product-detail-3"
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <span className="text-xs">◇</span>
              </div>
              {!sidebarCollapsed && <span className="truncate">Product Detail 3</span>}
            </button>
          </div>

          {/* Main Menu Group */}
          <div className="space-y-1">
            {/* Category */}
            <div>
              <button
                onClick={() => toggleDropdown("category")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-gray-500" />
                  {!sidebarCollapsed && <span>Category</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                      openDropdowns.category ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              {openDropdowns.category && !sidebarCollapsed && (
                <div className="pl-10 pr-2 py-1 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <Link href="/products" className="block py-1 hover:text-[#2563eb]">
                    Category list
                  </Link>
                  <Link href="/products" className="block py-1 hover:text-[#2563eb]">
                    New category
                  </Link>
                </div>
              )}
            </div>

            {/* Attributes */}
            <div>
              <button
                onClick={() => toggleDropdown("attributes")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Box className="w-4 h-4 text-gray-500" />
                  {!sidebarCollapsed && <span>Attributes</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                      openDropdowns.attributes ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            </div>

            {/* Order */}
            <div>
              <button
                onClick={() => toggleDropdown("order")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 text-gray-500" />
                  {!sidebarCollapsed && <span>Order</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                      openDropdowns.order ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              {openDropdowns.order && !sidebarCollapsed && (
                <div className="pl-10 pr-2 py-1 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <Link href="/admin" className="block py-1 hover:text-[#2563eb]">
                    Order list
                  </Link>
                  <Link href="/admin" className="block py-1 hover:text-[#2563eb]">
                    Order tracking
                  </Link>
                </div>
              )}
            </div>

            {/* User */}
            <div>
              <button
                onClick={() => toggleDropdown("user")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  {!sidebarCollapsed && <span>User</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                      openDropdowns.user ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            </div>

            {/* Roles */}
            <div>
              <button
                onClick={() => toggleDropdown("roles")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <UserPlus className="w-4 h-4 text-gray-500" />
                  {!sidebarCollapsed && <span>Roles</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                      openDropdowns.roles ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            </div>

            {/* Gallery */}
            <div>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                {!sidebarCollapsed && <span>Gallery</span>}
              </button>
            </div>

            {/* Report */}
            <div>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <BarChart3 className="w-4 h-4 text-gray-500" />
                {!sidebarCollapsed && <span>Report</span>}
              </button>
            </div>
          </div>

          {/* Section: SETTING */}
          <div>
            {!sidebarCollapsed && (
              <p className="px-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Setting
              </p>
            )}
            <div className="space-y-1">
              {/* Location */}
              <div>
                <button
                  onClick={() => toggleDropdown("location")}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {!sidebarCollapsed && <span>Location</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                        openDropdowns.location ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              </div>

              {/* Setting */}
              <div>
                <button
                  onClick={onOpenSettings}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  {!sidebarCollapsed && <span>Setting</span>}
                </button>
              </div>

              {/* Pages */}
              <div>
                <button
                  onClick={() => toggleDropdown("pages")}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileCode className="w-4 h-4 text-gray-500" />
                    {!sidebarCollapsed && <span>Pages</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                        openDropdowns.pages ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Section: COMPONENTS */}
          <div>
            {!sidebarCollapsed && (
              <p className="px-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Components
              </p>
            )}
            <div>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Box className="w-4 h-4 text-gray-500" />
                {!sidebarCollapsed && <span>Components</span>}
              </button>
            </div>
          </div>

          {/* Section: SUPPORT */}
          <div>
            {!sidebarCollapsed && (
              <p className="px-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Support
              </p>
            )}
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <HelpCircle className="w-4 h-4 text-gray-500" />
                {!sidebarCollapsed && <span>Help Center</span>}
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Headphones className="w-4 h-4 text-gray-500" />
                {!sidebarCollapsed && <span>FAQs</span>}
              </button>
              <Link
                href="/"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-gray-500" />
                {!sidebarCollapsed && <span>Storefront</span>}
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
