"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  themeMode: "light" | "dark";
  setThemeMode: (v: "light" | "dark") => void;
  layoutWidth: "full" | "boxed";
  setLayoutWidth: (v: "full" | "boxed") => void;
  menuStyle: "click" | "hover" | "default";
  setMenuStyle: (v: "click" | "hover" | "default") => void;
  menuPosition: "fixed" | "scrollable";
  setMenuPosition: (v: "fixed" | "scrollable") => void;
  headerPosition: "fixed" | "scrollable";
  setHeaderPosition: (v: "fixed" | "scrollable") => void;
  loaderEnabled: boolean;
  setLoaderEnabled: (v: boolean) => void;
}

export default function SettingsDrawer({
  isOpen,
  onClose,
  isDark,
  themeMode,
  setThemeMode,
  layoutWidth,
  setLayoutWidth,
  menuStyle,
  setMenuStyle,
  menuPosition,
  setMenuPosition,
  headerPosition,
  setHeaderPosition,
  loaderEnabled,
  setLoaderEnabled,
}: SettingsDrawerProps) {
  const [settingsTab, setSettingsTab] = useState<"style" | "colors">("style");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
      />

      {/* Slide-out Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div
          className={`w-screen max-w-sm sm:max-w-md shadow-2xl flex flex-col justify-between overflow-y-auto ${
            isDark ? "bg-[#1f2937] text-white" : "bg-white text-gray-800"
          }`}
        >
          {/* Header */}
          <div className="px-5 sm:px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide">Setting</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Options */}
          <div className="px-5 sm:px-6 py-6 space-y-6 sm:space-y-7 flex-1">
            {/* Tabs [Theme Style] [Theme Colors] */}
            <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl flex gap-1">
              <button
                onClick={() => setSettingsTab("style")}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  settingsTab === "style"
                    ? "bg-white dark:bg-gray-700 text-[#2563eb] shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Theme Style
              </button>
              <button
                onClick={() => setSettingsTab("colors")}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  settingsTab === "colors"
                    ? "bg-white dark:bg-gray-700 text-[#2563eb] shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Theme Colors
              </button>
            </div>

            {/* Option 1: Theme color mode */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                Theme color mode:
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setThemeMode("light")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    themeMode === "light"
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      themeMode === "light"
                        ? "bg-white text-[#2563eb] border-white"
                        : "border-gray-400"
                    }`}
                  >
                    {themeMode === "light" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  Light
                </button>

                <button
                  onClick={() => setThemeMode("dark")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    themeMode === "dark"
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      themeMode === "dark"
                        ? "bg-white text-[#2563eb] border-white"
                        : "border-gray-400"
                    }`}
                  >
                    {themeMode === "dark" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  Dark
                </button>
              </div>
            </div>

            {/* Option 2: Layout width style */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                Layout width style
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setLayoutWidth("full")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    layoutWidth === "full"
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      layoutWidth === "full"
                        ? "bg-white text-[#2563eb] border-white"
                        : "border-gray-400"
                    }`}
                  >
                    {layoutWidth === "full" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  Full width
                </button>

                <button
                  onClick={() => setLayoutWidth("boxed")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    layoutWidth === "boxed"
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      layoutWidth === "boxed"
                        ? "bg-white text-[#2563eb] border-white"
                        : "border-gray-400"
                    }`}
                  >
                    {layoutWidth === "boxed" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  Boxed
                </button>
              </div>
            </div>

            {/* Option 3: Vertical & Horizontal menu style */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                Vertical & Horizontal menu style
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setMenuStyle("click")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    menuStyle === "click"
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      menuStyle === "click"
                        ? "bg-white text-[#2563eb] border-white"
                        : "border-gray-400"
                    }`}
                  >
                    {menuStyle === "click" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  Menu click
                </button>

                <button
                  onClick={() => setMenuStyle("hover")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    menuStyle === "hover"
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      menuStyle === "hover"
                        ? "bg-white text-[#2563eb] border-white"
                        : "border-gray-400"
                    }`}
                  >
                    {menuStyle === "hover" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  Icon hover
                </button>

                <button
                  onClick={() => setMenuStyle("default")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    menuStyle === "default"
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      menuStyle === "default"
                        ? "bg-white text-[#2563eb] border-white"
                        : "border-gray-400"
                    }`}
                  >
                    {menuStyle === "default" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  Icon default
                </button>
              </div>
            </div>

            {/* Option 4: Menu position */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                Menu position
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setMenuPosition("fixed")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    menuPosition === "fixed"
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      menuPosition === "fixed"
                        ? "bg-white text-[#2563eb] border-white"
                        : "border-gray-400"
                    }`}
                  >
                    {menuPosition === "fixed" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  Fixed
                </button>

                <button
                  onClick={() => setMenuPosition("scrollable")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    menuPosition === "scrollable"
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      menuPosition === "scrollable"
                        ? "bg-white text-[#2563eb] border-white"
                        : "border-gray-400"
                    }`}
                  >
                    {menuPosition === "scrollable" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  Scrollable
                </button>
              </div>
            </div>

            {/* Option 5: Header positions */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                Header positions
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setHeaderPosition("fixed")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    headerPosition === "fixed"
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      headerPosition === "fixed"
                        ? "bg-white text-[#2563eb] border-white"
                        : "border-gray-400"
                    }`}
                  >
                    {headerPosition === "fixed" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  Fixed
                </button>

                <button
                  onClick={() => setHeaderPosition("scrollable")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    headerPosition === "scrollable"
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      headerPosition === "scrollable"
                        ? "bg-white text-[#2563eb] border-white"
                        : "border-gray-400"
                    }`}
                  >
                    {headerPosition === "scrollable" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  Scrollable
                </button>
              </div>
            </div>

            {/* Option 6: Loader */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-900 dark:text-white">Loader</p>
                <button
                  onClick={() => setLoaderEnabled(!loaderEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    loaderEnabled ? "bg-[#2563eb]" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      loaderEnabled ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom close action */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#2563eb] text-white font-medium text-xs rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
            >
              Apply & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
