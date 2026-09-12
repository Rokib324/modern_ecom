"use client";

import React from "react";
import Link from "next/link";
import {
  PanelLeftClose,
  PanelLeft,
  X,
  ExternalLink,
  Settings,
  LayoutDashboard,
  Ticket,
  Megaphone,
  Image as ImageIcon,
  LayoutGrid,
  Sparkles,
  Layers,
  Users,
  BookOpen,
  Globe,
  ChevronDown,
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

// ─── Nav item button ──────────────────────────────────────────────────────────
function NavItem({
  id,
  label,
  icon: Icon,
  iconColor,
  activeMenu,
  setActiveMenu,
  sidebarCollapsed,
  mobileSidebarOpen,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  iconColor?: string;
  activeMenu: string;
  setActiveMenu: (v: string) => void;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
}) {
  const isActive = activeMenu === id;
  const isExpanded = !sidebarCollapsed || mobileSidebarOpen;
  return (
    <button
      onClick={() => setActiveMenu(id)}
      title={!isExpanded ? label : undefined}
      className={`w-full flex items-center ${
        !isExpanded ? "justify-center px-0" : "gap-3 px-3"
      } py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
        isActive
          ? "bg-[#2563eb] text-white shadow-sm"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      <Icon
        className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : iconColor ?? "text-gray-500"}`}
      />
      {isExpanded && <span className="truncate">{label}</span>}
    </button>
  );
}

// ─── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ label, sidebarCollapsed, mobileSidebarOpen }: { label: string; sidebarCollapsed: boolean; mobileSidebarOpen: boolean }) {
  if (sidebarCollapsed && !mobileSidebarOpen) return <div className="border-t border-gray-100 dark:border-gray-800 my-1" />;
  return (
    <p className="px-3 pt-1 pb-1.5 text-[10.5px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
      {label}
    </p>
  );
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
  const isExpanded = !sidebarCollapsed || mobileSidebarOpen;

  const navItemProps = { activeMenu, setActiveMenu, sidebarCollapsed, mobileSidebarOpen };

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
          SIDEBAR
          ══════════════════════════════════════════ */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r flex flex-col z-50 lg:z-30 flex-shrink-0 ${
          isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-200"
        } ${
          mobileSidebarOpen
            ? "fixed inset-y-0 left-0 w-[270px] shadow-2xl translate-x-0"
            : "fixed inset-y-0 left-0 w-[270px] -translate-x-full lg:translate-x-0"
        } ${
          sidebarCollapsed ? "lg:w-[72px]" : "lg:w-[260px]"
        } lg:static lg:h-screen`}
      >
        {/* ── Logo & Collapse Header ── */}
        <div className={`h-16 flex items-center ${isExpanded ? "justify-between px-5" : "justify-center px-2"} border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          {isExpanded ? (
            <>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  V
                </div>
                <span className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                  Veronne
                </span>
              </div>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`hidden lg:flex p-1.5 rounded-lg transition-colors ${isDark ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
                title="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-bold text-lg shadow-sm hover:ring-2 hover:ring-blue-400 transition-all"
              title="Expand sidebar"
            >
              V
            </button>
          )}

          {/* Mobile close */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className={`lg:hidden p-1.5 rounded-lg transition-colors ${isDark ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Navigation ── */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 select-none scrollbar-thin">

          {/* ── MAIN ── */}
          <SectionLabel label="Main" sidebarCollapsed={sidebarCollapsed} mobileSidebarOpen={mobileSidebarOpen} />
          <div className="space-y-0.5 mb-3">
            <NavItem id="dashboard"     label="Dashboard"   icon={LayoutDashboard} iconColor="text-blue-500"   {...navItemProps} />
            <NavItem id="coupons"       label="Coupons"     icon={Ticket}          iconColor="text-amber-500"  {...navItemProps} />
          </div>

          {/* ── SITE CONTENT ── */}
          <SectionLabel label="Site Content" sidebarCollapsed={sidebarCollapsed} mobileSidebarOpen={mobileSidebarOpen} />
          <div className="space-y-0.5 mb-3">
            <NavItem id="cms:announcements"     label="Announcement Bar"   icon={Megaphone}    iconColor="text-rose-500"    {...navItemProps} />
            <NavItem id="cms:hero"              label="Hero Slider"        icon={ImageIcon}    iconColor="text-purple-500"  {...navItemProps} />
            <NavItem id="cms:collections"       label="Collections Grid"   icon={LayoutGrid}   iconColor="text-cyan-500"    {...navItemProps} />
            <NavItem id="cms:new_in"            label="New In / Bestsellers" icon={Sparkles}   iconColor="text-yellow-500"  {...navItemProps} />
            <NavItem id="cms:featured_banners"  label="Featured Banners"   icon={Layers}       iconColor="text-indigo-500"  {...navItemProps} />
            <NavItem id="cms:mens_kids"         label="Mens & Kids"        icon={Users}        iconColor="text-teal-500"    {...navItemProps} />
            <NavItem id="cms:our_story"         label="Our Story"          icon={BookOpen}     iconColor="text-orange-500"  {...navItemProps} />
          </div>

          {/* ── SETTINGS ── */}
          <SectionLabel label="Settings" sidebarCollapsed={sidebarCollapsed} mobileSidebarOpen={mobileSidebarOpen} />
          <div className="space-y-0.5 mb-3">
            <button
              onClick={onOpenSettings}
              className={`w-full flex items-center ${
                !isExpanded ? "justify-center px-0" : "gap-3 px-3"
              } py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800`}
              title={!isExpanded ? "Settings" : undefined}
            >
              <Settings className="w-4 h-4 flex-shrink-0 text-gray-500" />
              {isExpanded && <span className="truncate">Settings</span>}
            </button>

            {/* Orders quick-link collapsible */}
            <button
              onClick={() => toggleDropdown("orders")}
              className={`w-full flex items-center ${
                !isExpanded ? "justify-center px-0" : "justify-between px-3"
              } py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
              title={!isExpanded ? "Orders" : undefined}
            >
              <div className={`flex items-center ${!isExpanded ? "justify-center" : "gap-3"}`}>
                <Globe className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                {isExpanded && <span>Orders</span>}
              </div>
              {isExpanded && (
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${openDropdowns.orders ? "rotate-180" : ""}`} />
              )}
            </button>
            {openDropdowns.orders && isExpanded && (
              <div className={`pl-10 pr-2 py-1 space-y-1 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                <Link href="/admin" className="block py-1 hover:text-[#2563eb]">Order list</Link>
                <Link href="/admin" className="block py-1 hover:text-[#2563eb]">Order tracking</Link>
              </div>
            )}
          </div>

          {/* ── STOREFRONT LINK ── */}
          <div className="pt-1">
            <Link
              href="/"
              target="_blank"
              className={`w-full flex items-center ${
                !isExpanded ? "justify-center px-0" : "gap-3 px-3"
              } py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800`}
              title={!isExpanded ? "View Storefront" : undefined}
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0 text-gray-500" />
              {isExpanded && <span className="truncate">View Storefront</span>}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
