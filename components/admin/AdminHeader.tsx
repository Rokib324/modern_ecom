"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  Search,
  Moon,
  Sun,
  Bell,
  MessageSquare,
  Maximize,
  Minimize,
  Grid,
  Settings,
  User,
  Mail,
  FileText,
  Headphones,
  LogOut,
  PanelLeft,
} from "lucide-react";

interface AdminHeaderProps {
  isDark: boolean;
  setThemeMode: (mode: "light" | "dark") => void;
  headerPosition: "fixed" | "scrollable";
  setMobileSidebarOpen: (v: boolean) => void;
  onOpenSettings: () => void;
}

export default function AdminHeader({
  isDark,
  setThemeMode,
  headerPosition,
  setMobileSidebarOpen,
  onOpenSettings,
}: AdminHeaderProps) {
  const { data: session } = useSession();
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const adminMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target as Node)) {
        setAdminDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header
      className={`h-16 px-3 sm:px-6 flex items-center justify-between border-b z-20 gap-2 ${
        isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-200"
      } ${headerPosition === "fixed" ? "sticky top-0" : "relative"}`}
    >
      {/* Left: Mobile hamburger & Search input */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pr-1">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 -ml-1 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          aria-label="Open sidebar navigation"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-[170px] xs:max-w-[220px] sm:max-w-xs md:max-w-sm">
          <input
            type="text"
            placeholder="Search here..."
            className={`w-full text-xs sm:text-sm pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 rounded-xl border focus:outline-none transition-colors ${
              isDark
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-[#2563eb]"
                : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#2563eb]"
            }`}
          />
          <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4 absolute left-2.5 sm:left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Right Action Icons Row */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
        {/* Theme circle indicator */}
        <div className="hidden sm:flex w-6 h-6 rounded-full bg-blue-100 border border-blue-200 items-center justify-center cursor-pointer" />

        {/* Dark mode toggle */}
        <button
          onClick={() => setThemeMode(isDark ? "light" : "dark")}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle Dark Mode"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications with Orange Badge (1) */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#f97316] text-white text-[9px] font-bold flex items-center justify-center leading-none">
              1
            </span>
          </button>
          {notificationsOpen && (
            <div className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-full mt-2 w-[calc(100vw-1.5rem)] sm:w-72 max-w-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-2xl p-4 text-xs z-50 animate-scale-up">
              <p className="font-semibold text-gray-800 dark:text-white mb-2">Notifications</p>
              <div className="p-2.5 bg-blue-50 dark:bg-gray-700/50 rounded-xl text-blue-900 dark:text-blue-200">
                New order #327 received from Robert!
              </div>
            </div>
          )}
        </div>

        {/* Messages Chat with Blue Badge (1) */}
        <div className="relative">
          <button
            onClick={() => setMessagesOpen(!messagesOpen)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            title="Messages"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#2563eb] text-white text-[9px] font-bold flex items-center justify-center leading-none">
              1
            </span>
          </button>
          {messagesOpen && (
            <div className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-full mt-2 w-[calc(100vw-1rem)] sm:w-72 max-w-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-2xl p-4 text-xs z-50 animate-scale-up">
              <p className="font-semibold text-gray-800 dark:text-white mb-2">Inbox Messages</p>
              <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-700 dark:text-gray-200">
                <strong>Kathryn Murphy:</strong> Product inquiry regarding soft satin set...
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="w-9 h-9 rounded-full hidden md:flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Grid / Apps Icon */}
        <button
          className="w-9 h-9 rounded-full hidden md:flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Applications"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* ── Admin Profile Button (Image 4) ── */}
        <div className="relative ml-1 sm:ml-2" ref={adminMenuRef}>
          <button
            onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Admin Profile Menu"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden relative border border-gray-200 dark:border-gray-700 flex-shrink-0">
              <Image
                src={
                  session?.user?.image ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                }
                alt="Admin avatar"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="hidden md:flex flex-col text-left leading-tight pr-1">
              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                {session?.user?.name || "Kristin Watson"}
              </span>
              <span className="text-[11px] text-gray-400">Admin</span>
            </div>
          </button>

          {/* ── Image 4: Admin Button Dropdown UI ── */}
          {adminDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-scale-up">
              <Link
                href="/admin"
                onClick={() => setAdminDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 font-medium transition-colors"
              >
                <User className="w-4 h-4 text-gray-400" />
                Account
              </Link>

              <div className="flex items-center justify-between px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 font-medium cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Inbox
                </div>
                <span className="bg-[#22c55e]/15 text-[#16a34a] font-bold text-[10px] px-2 py-0.5 rounded-full">
                  27
                </span>
              </div>

              <div className="flex items-center gap-3 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 font-medium cursor-pointer transition-colors">
                <FileText className="w-4 h-4 text-gray-400" />
                Taskboard
              </div>

              <button
                onClick={() => {
                  setAdminDropdownOpen(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 font-medium transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                Setting
              </button>

              <div className="flex items-center gap-3 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 font-medium cursor-pointer transition-colors">
                <Headphones className="w-4 h-4 text-gray-400" />
                Support
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Log out
              </button>
            </div>
          )}
        </div>

        {/* Settings Gear Button (Opens Image 5 Drawer) */}
        <button
          onClick={onOpenSettings}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Settings Drawer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
