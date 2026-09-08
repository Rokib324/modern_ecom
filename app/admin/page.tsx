"use client";

import { useEffect, useState, useRef, useMemo } from "react";
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
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  FileText,
  Users,
  Package,
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
  Shield,
  PanelLeftClose,
  PanelLeft,
  X,
  Check,
  MoreHorizontal,
  Mail,
  LogOut,
  ExternalLink,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/* ─── Mock & Chart Data ──────────────────────────────────────────────────────── */

const RECENT_ORDER_DATA = [
  { month: "Jan", orders: 32 },
  { month: "Feb", orders: 45 },
  { month: "Mar", orders: 38 },
  { month: "Apr", orders: 52 },
  { month: "May", orders: 48 },
  { month: "Jun", orders: 60 },
  { month: "Jul", orders: 55 },
  { month: "Aug", orders: 68 },
  { month: "Sep", orders: 62 },
  { month: "Oct", orders: 74 },
  { month: "Nov", orders: 42 },
  { month: "Dec", orders: 18 },
];

const EARNINGS_DATA = [
  { month: "Jan", revenue: 28000, profit: 18000 },
  { month: "Feb", revenue: 38000, profit: 24000 },
  { month: "Mar", revenue: 22000, profit: 14000 },
  { month: "Apr", revenue: 34000, profit: 22000 },
  { month: "May", revenue: 49000, profit: 32000 },
  { month: "Jun", revenue: 41000, profit: 27000 },
  { month: "Jul", revenue: 19000, profit: 12000 },
  { month: "Aug", revenue: 35000, profit: 23000 },
];

const SALES_SPARKLINE = [
  { v: 12 }, { v: 19 }, { v: 15 }, { v: 24 }, { v: 22 }, { v: 30 }, { v: 28 }, { v: 35 },
];
const INCOME_SPARKLINE = [
  { v: 35 }, { v: 28 }, { v: 30 }, { v: 22 }, { v: 24 }, { v: 18 }, { v: 20 }, { v: 15 },
];
const ORDERS_PAID_SPARKLINE = [
  { v: 20 }, { v: 22 }, { v: 21 }, { v: 23 }, { v: 22 }, { v: 24 }, { v: 23 }, { v: 24 },
];
const VISITOR_SPARKLINE = [
  { v: 15 }, { v: 22 }, { v: 18 }, { v: 28 }, { v: 25 }, { v: 34 }, { v: 30 }, { v: 38 },
];

/* ─── Circular Flag Components ───────────────────────────────────────────────── */

function SpainFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="6" fill="#AA151B" />
      <rect y="6" width="24" height="12" fill="#F1BF00" />
      <rect y="18" width="24" height="6" fill="#AA151B" />
    </svg>
  );
}

function IndiaFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="8" fill="#FF9933" />
      <rect y="8" width="24" height="8" fill="#FFFFFF" />
      <rect y="16" width="24" height="8" fill="#138808" />
      <circle cx="12" cy="12" r="2.5" fill="#000080" />
    </svg>
  );
}

function UKFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="24" fill="#012169" />
      <path d="M0,0 L24,24 M24,0 L0,24" stroke="#FFF" strokeWidth="4" />
      <path d="M0,0 L24,24 M24,0 L0,24" stroke="#C8102E" strokeWidth="2" />
      <path d="M12,0 V24 M0,12 H24" stroke="#FFF" strokeWidth="6" />
      <path d="M12,0 V24 M0,12 H24" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}

function BrazilFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="24" fill="#009c3b" />
      <polygon points="12,3 22,12 12,21 2,12" fill="#ffdf00" />
      <circle cx="12" cy="12" r="4" fill="#002776" />
    </svg>
  );
}

function FranceFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="8" height="24" fill="#002654" />
      <rect x="8" width="8" height="24" fill="#FFFFFF" />
      <rect x="16" width="8" height="24" fill="#ED2939" />
    </svg>
  );
}

function TurkeyFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="24" fill="#E30A17" />
      <circle cx="10" cy="12" r="4.5" fill="#FFF" />
      <circle cx="11.2" cy="12" r="3.6" fill="#E30A17" />
      <polygon points="15,10 14,12 16,11 14,13" fill="#FFF" />
    </svg>
  );
}

function BelgiumFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="8" height="24" fill="#000000" />
      <rect x="8" width="8" height="24" fill="#FFD100" />
      <rect x="16" width="8" height="24" fill="#FF0F00" />
    </svg>
  );
}

function SwedenFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="24" fill="#006AA7" />
      <rect x="7" width="3" height="24" fill="#FECC00" />
      <rect y="10.5" width="24" height="3" fill="#FECC00" />
    </svg>
  );
}

function VietnamFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="24" fill="#DA251D" />
      <polygon
        points="12,5 14,10 19,10 15,13 17,18 12,15 7,18 9,13 5,10 10,10"
        fill="#FFFF00"
      />
    </svg>
  );
}

function AustraliaFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="24" fill="#00008B" />
      <rect width="12" height="12" fill="#012169" />
      <path d="M0,0 L12,12 M12,0 L0,12" stroke="#FFF" strokeWidth="2" />
      <path d="M6,0 V12 M0,6 H12" stroke="#C8102E" strokeWidth="1.5" />
      <circle cx="18" cy="7" r="1" fill="#FFF" />
      <circle cx="16" cy="14" r="1.2" fill="#FFF" />
      <circle cx="20" cy="16" r="0.8" fill="#FFF" />
    </svg>
  );
}

function SaudiFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="24" fill="#006C35" />
      <path d="M5,12 H19 M12,9 V15" stroke="#FFF" strokeWidth="1.5" />
    </svg>
  );
}

/* ─── Top Products List ──────────────────────────────────────────────────────── */

const TOP_PRODUCTS = [
  {
    id: 1,
    name: "Patimax Fragrance Long...",
    items: "100 Items",
    coupon: "Sflat",
    Flag: SpainFlag,
    image: "/images/newin_silver_nightdress.jpg",
  },
  {
    id: 2,
    name: "Nulo MedalSeries Adult Cat...",
    items: "100 Items",
    coupon: "Sflat",
    Flag: IndiaFlag,
    image: "/images/newin_ivory_cami.jpg",
  },
  {
    id: 3,
    name: "Pedigree Puppy Dry Dog...",
    items: "100 Items",
    coupon: "Sflat",
    Flag: UKFlag,
    image: "/images/newin_autumn_floral_cami.jpg",
  },
  {
    id: 4,
    name: "Biscoito Premier Cookie...",
    items: "100 Items",
    coupon: "Sflat",
    Flag: BrazilFlag,
    image: "/images/collection_cotton_pyjamas.jpg",
  },
  {
    id: 5,
    name: "Pedigree Adult Dry Dog...",
    items: "100 Items",
    coupon: "Sflat",
    Flag: FranceFlag,
    image: "/images/mens_nightwear.jpg",
  },
];

/* ─── Top Countries List ─────────────────────────────────────────────────────── */

const TOP_COUNTRIES = [
  { name: "Turkish Flag", Flag: TurkeyFlag, trend: "up", value: "6,972" },
  { name: "Belgium", Flag: BelgiumFlag, trend: "up", value: "6,972" },
  { name: "Sweden", Flag: SwedenFlag, trend: "down", value: "6,972" },
  { name: "Vietnamese", Flag: VietnamFlag, trend: "up", value: "6,972" },
  { name: "Australia", Flag: AustraliaFlag, trend: "down", value: "6,972" },
  { name: "Saudi Arabia", Flag: SaudiFlag, trend: "down", value: "6,972" },
];

/* ─── Best Shop Sellers List ─────────────────────────────────────────────────── */

const BEST_SELLERS = [
  {
    name: "Robert",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    purchases: "73 Purchases",
    categories: "Kitchen, Pets",
    total: "$1,000",
    barColor: "bg-[#22c55e]",
  },
  {
    name: "Calvin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    purchases: "66 Purchases",
    categories: "Health, Grocery",
    total: "$4,000",
    barColor: "bg-[#f97316]",
  },
  {
    name: "Dwight",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    purchases: "15,890 Purchases",
    categories: "Electronics",
    total: "$2,700",
    barColor: "bg-[#94a3b8]",
  },
  {
    name: "Cody",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face",
    purchases: "15 Purchases",
    categories: "Movies, Music",
    total: "$2,100",
    barColor: "bg-[#22c55e]",
  },
  {
    name: "Bruce",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    purchases: "127 Purchases",
    categories: "Sports, Fitness",
    total: "$4,400",
    barColor: "bg-[#eab308]",
  },
  {
    name: "Jorge",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face",
    purchases: "30 Purchases",
    categories: "Toys, Baby",
    total: "$4,750",
    barColor: "bg-[#06b6d4]",
  },
  {
    name: "Kristin Watson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    purchases: "93 Purchases",
    categories: "Gift Cards",
    total: "$1,000",
    barColor: "bg-[#a855f7]",
  },
];

/* ─── Product Overview Table List ────────────────────────────────────────────── */

const PRODUCT_OVERVIEW = [
  {
    id: 1,
    name: "Soft Fluffy Cats",
    productId: "#327",
    price: "$11.70",
    quantity: 28,
    sale: "On sale",
    revenue: "$328.85",
    image: "/images/newin_silver_nightdress.jpg",
  },
  {
    id: 2,
    name: "Taste of the Wild Formula Finder",
    productId: "#380",
    price: "$8.99",
    quantity: 10,
    sale: "On sale",
    revenue: "$105.55",
    image: "/images/newin_ivory_cami.jpg",
  },
  {
    id: 3,
    name: "Wellness Natural Food",
    productId: "#126",
    price: "$5.22",
    quantity: 578,
    sale: "--/--",
    revenue: "$202.87",
    image: "/images/newin_autumn_floral_cami.jpg",
  },
  {
    id: 4,
    name: "Dog Food Rachael Ray",
    productId: "#582",
    price: "$14.81",
    quantity: 36,
    sale: "--/--",
    revenue: "$475.22",
    image: "/images/collection_striped_pyjamas.jpg",
  },
  {
    id: 5,
    name: "Best Buddy Bits Dog Treats",
    productId: "#293",
    price: "$6.48",
    quantity: 84,
    sale: "--/--",
    revenue: "$219.78",
    image: "/images/featured_new_in.jpg",
  },
];

/* ─── Orders List ────────────────────────────────────────────────────────────── */

const ORDERS_LIST = [
  {
    id: 1,
    name: "Prodotti per il tuo cane...",
    date: "20 Nov 2023",
    delivery: "20",
    image: "/images/collection_cotton_pyjamas.jpg",
  },
  {
    id: 2,
    name: "Wholesome Pride...",
    date: "20 Nov 2023",
    delivery: "20",
    image: "/images/newin_autumn_floral_set.jpg",
  },
  {
    id: 3,
    name: "Beneful Baked Delights...",
    date: "20 Nov 2023",
    delivery: "20",
    image: "/images/newin_ivory_gown.jpg",
  },
  {
    id: 4,
    name: "Taste of the Wild...",
    date: "20 Nov 2023",
    delivery: "20",
    image: "/images/featured_dressing_gowns.jpg",
  },
  {
    id: 5,
    name: "Canagan - Britain's...",
    date: "20 Nov 2023",
    delivery: "20",
    image: "/images/kids_pyjamas.jpg",
  },
];

/* ─── Comments List ──────────────────────────────────────────────────────────── */

const NEW_COMMENTS = [
  {
    id: 1,
    name: "Kathryn Murphy",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec dolor vel est interdum",
  },
  {
    id: 2,
    name: "Leslie Alexander",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment:
      "Cras nec viverra justo, a mattis lacus. Vestibulum eleifend, leo sit amet aliquam laoreet, turpis leo vulputate orci",
  },
  {
    id: 3,
    name: "Devon Lane",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment:
      "Morbi eget commodo diam. Praesent dignissim purus ac turpis porta.",
  },
];

/* ─── Main Admin Dashboard Component ─────────────────────────────────────────── */

export default function AdminDashboard() {
  const { data: session } = useSession();

  // Settings State (Image 5)
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [layoutWidth, setLayoutWidth] = useState<"full" | "boxed">("full");
  const [menuStyle, setMenuStyle] = useState<"click" | "hover" | "default">("click");
  const [menuPosition, setMenuPosition] = useState<"fixed" | "scrollable">("fixed");
  const [headerPosition, setHeaderPosition] = useState<"fixed" | "scrollable">("fixed");
  const [loaderEnabled, setLoaderEnabled] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"style" | "colors">("style");

  // UI Interactive States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    category: false,
    attributes: false,
    order: false,
    user: false,
    roles: false,
    location: false,
    pages: false,
  });
  const [currentPage, setCurrentPage] = useState(2);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

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

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
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
                    onClick={() => setSettingsDrawerOpen(true)}
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

        {/* ══════════════════════════════════════════
            MAIN CONTENT WRAPPER
            ══════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* ─── Top Header Bar ─── */}
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
                        setSettingsDrawerOpen(true);
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
                onClick={() => setSettingsDrawerOpen(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Settings Drawer"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* ─── Dashboard Content Body ─── */}
          <main className="flex-1 p-3.5 sm:p-6 lg:p-7 space-y-5 sm:space-y-6">
            <div
              className={`mx-auto space-y-6 ${
                layoutWidth === "boxed" ? "max-w-[1340px]" : "w-full"
              }`}
            >
              {/* ══════════════════════════════════════════
                  TOP 4 METRICS CARDS
                  ══════════════════════════════════════════ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                {/* 1. Total Sales */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${
                    isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#22c55e] flex items-center justify-center text-white shadow-sm shadow-green-500/20 flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 ml-3 sm:ml-4">
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-400">
                        Total Sales
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
                        34,945
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#22c55e]">
                      <TrendingUp className="w-3.5 h-3.5" />
                      1.56%
                    </div>
                  </div>

                  {/* Sparkline chart */}
                  <div className="h-10 w-full mt-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={SALES_SPARKLINE}>
                        <defs>
                          <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke="#22c55e"
                          strokeWidth={2.5}
                          fill="url(#greenGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Total Income */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${
                    isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#f97316] flex items-center justify-center text-white shadow-sm shadow-orange-500/20 flex-shrink-0">
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 ml-3 sm:ml-4">
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-400">
                        Total Income
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
                        $37,802
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#ef4444]">
                      <TrendingDown className="w-3.5 h-3.5" />
                      1.56%
                    </div>
                  </div>

                  {/* Sparkline chart */}
                  <div className="h-10 w-full mt-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={INCOME_SPARKLINE}>
                        <defs>
                          <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke="#f97316"
                          strokeWidth={2.5}
                          fill="url(#orangeGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Orders Paid */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${
                    isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#cbd5e1] dark:bg-gray-700 flex items-center justify-center text-white dark:text-gray-300 shadow-sm flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 ml-3 sm:ml-4">
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-400">
                        Orders Paid
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
                        34,945
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-400">
                      <TrendingUp className="w-3.5 h-3.5" />
                      0.00%
                    </div>
                  </div>

                  {/* Sparkline chart */}
                  <div className="h-10 w-full mt-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ORDERS_PAID_SPARKLINE}>
                        <defs>
                          <linearGradient id="grayGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke="#94a3b8"
                          strokeWidth={2.5}
                          fill="url(#grayGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Total Visitor */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${
                    isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#2563eb] flex items-center justify-center text-white shadow-sm shadow-blue-500/20 flex-shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 ml-3 sm:ml-4">
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-400">
                        Total Visitor
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
                        34,945
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#22c55e]">
                      <TrendingUp className="w-3.5 h-3.5" />
                      1.56%
                    </div>
                  </div>

                  {/* Sparkline chart */}
                  <div className="h-10 w-full mt-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={VISITOR_SPARKLINE}>
                        <defs>
                          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke="#2563eb"
                          strokeWidth={2.5}
                          fill="url(#blueGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════
                  MIDDLE ROW: RECENT ORDER / TOP PRODUCTS / TOP COUNTRIES
                  ══════════════════════════════════════════ */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
                {/* 1. Recent Order Area Chart (5 cols) */}
                <div
                  className={`md:col-span-2 lg:col-span-5 p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
                    isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      Recent Order
                    </h2>
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="h-56 sm:h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={RECENT_ORDER_DATA}>
                        <defs>
                          <linearGradient id="orderFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#64748b" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? "#111827" : "#ffffff",
                            borderColor: isDark ? "#374151" : "#e2e8f0",
                            borderRadius: "12px",
                            fontSize: "12px",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="orders"
                          stroke="#2563eb"
                          strokeWidth={3}
                          fill="url(#orderFill)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Top Products (4 cols) */}
                <div
                  className={`md:col-span-1 lg:col-span-4 p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
                    isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      Top Products
                    </h2>
                    <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 font-medium">
                      View all <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-3.5 divide-y divide-gray-100 dark:divide-gray-800">
                    {TOP_PRODUCTS.map((prod) => (
                      <div
                        key={prod.id}
                        className="pt-3.5 first:pt-0 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative flex-shrink-0">
                            <Image
                              src={prod.image}
                              alt={prod.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate hover:text-[#2563eb] cursor-pointer">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{prod.items}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-[10px] text-gray-400">Coupon Code</p>
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                              {prod.coupon}
                            </p>
                          </div>
                          <prod.Flag />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Top Countries By Sales (3 cols) */}
                <div
                  className={`md:col-span-1 lg:col-span-3 p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
                    isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      Top Countries By Sales
                    </h2>
                    <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 font-medium">
                      View all <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Summary amount */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        $37,802
                      </span>
                      <span className="text-xs font-semibold text-[#22c55e] flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" /> 1.56%
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">since last weekend</p>
                  </div>

                  {/* Countries list */}
                  <div className="space-y-3">
                    {TOP_COUNTRIES.map((c) => (
                      <div key={c.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <c.Flag />
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {c.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {c.trend === "up" ? (
                            <TrendingUp className="w-3.5 h-3.5 text-[#22c55e]" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-[#ef4444]" />
                          )}
                          <span className="font-bold text-gray-800 dark:text-gray-100">
                            {c.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════
                  SECOND ROW: BEST SHOP SELLERS & PRODUCT OVERVIEW TABLES
                  ══════════════════════════════════════════ */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
                {/* 1. Best Shop Sellers (5 cols) */}
                <div
                  className={`lg:col-span-5 p-4 sm:p-6 rounded-2xl border shadow-sm ${
                    isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      Best Shop Sellers
                    </h2>
                    <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 font-medium">
                      View all <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
                    <table className="w-full min-w-[460px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider font-semibold">
                          <th className="pb-3">Shop</th>
                          <th className="pb-3">Categories</th>
                          <th className="pb-3">Total</th>
                          <th className="pb-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {BEST_SELLERS.map((seller) => (
                          <tr key={seller.name} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                            <td className="py-3 pr-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0">
                                  <Image
                                    src={seller.avatar}
                                    alt={seller.name}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-800 dark:text-gray-200 truncate underline underline-offset-2 cursor-pointer">
                                    {seller.name}
                                  </p>
                                  <p className="text-[10px] text-gray-400">{seller.purchases}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-gray-500 dark:text-gray-400">
                              {seller.categories}
                            </td>
                            <td className="py-3 px-2 font-bold text-gray-800 dark:text-gray-200">
                              {seller.total}
                            </td>
                            <td className="py-3 pl-2 text-right">
                              <div className="inline-block w-8 h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <div className={`w-full h-full ${seller.barColor}`} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Product Overview Table (7 cols) */}
                <div
                  className={`lg:col-span-7 p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
                    isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                        Product overview
                      </h2>
                      <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 font-medium">
                        View all <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
                      <table className="w-full min-w-[540px] text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider font-semibold">
                            <th className="pb-3">Name</th>
                            <th className="pb-3">Product ID</th>
                            <th className="pb-3">Price</th>
                            <th className="pb-3">Quantity</th>
                            <th className="pb-3">Sale</th>
                            <th className="pb-3 text-right">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {PRODUCT_OVERVIEW.map((item) => (
                            <tr
                              key={item.id}
                              className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                            >
                              <td className="py-3 pr-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 relative flex-shrink-0">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      unoptimized
                                      className="object-cover"
                                    />
                                  </div>
                                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate underline underline-offset-2 cursor-pointer max-w-[150px]">
                                    {item.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-gray-500 dark:text-gray-400 font-mono text-[11px]">
                                {item.productId}
                              </td>
                              <td className="py-3 px-2 font-medium text-gray-800 dark:text-gray-200">
                                {item.price}
                              </td>
                              <td className="py-3 px-2 font-medium text-gray-600 dark:text-gray-300">
                                {item.quantity}
                              </td>
                              <td className="py-3 px-2">
                                <span
                                  className={`text-[11px] font-medium ${
                                    item.sale === "On sale"
                                      ? "text-[#22c55e]"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {item.sale}
                                </span>
                              </td>
                              <td className="py-3 pl-2 text-right font-bold text-gray-900 dark:text-white">
                                {item.revenue}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination row */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                    <span>Showing 5 entries</span>
                    <div className="flex items-center gap-1.5 font-medium">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          currentPage === 1
                            ? "bg-[#2563eb] text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        1
                      </button>
                      <button
                        onClick={() => setCurrentPage(2)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          currentPage === 2
                            ? "bg-[#2563eb] text-white shadow-sm"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        2
                      </button>
                      <button
                        onClick={() => setCurrentPage(3)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          currentPage === 3
                            ? "bg-[#2563eb] text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        3
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════
                  THIRD ROW: ORDERS / EARNINGS / NEW COMMENTS (IMAGE 2 & 3)
                  ══════════════════════════════════════════ */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
                {/* 1. Orders (4 cols) */}
                <div
                  className={`md:col-span-1 lg:col-span-4 p-4 sm:p-6 rounded-2xl border shadow-sm ${
                    isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Orders</h2>
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
                    <table className="w-full min-w-[320px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider font-semibold">
                          <th className="pb-2.5">Product</th>
                          <th className="pb-2.5">Price</th>
                          <th className="pb-2.5 text-right">Del</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {ORDERS_LIST.map((ord) => (
                          <tr key={ord.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                            <td className="py-3 pr-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 relative flex-shrink-0">
                                  <Image
                                    src={ord.image}
                                    alt={ord.name}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                </div>
                                <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[130px] underline underline-offset-2 cursor-pointer">
                                  {ord.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-gray-400 whitespace-nowrap">
                              {ord.date}
                            </td>
                            <td className="py-3 pl-2 text-right font-semibold text-gray-700 dark:text-gray-300">
                              {ord.delivery}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Earnings Bar Chart (5 cols) */}
                <div
                  className={`md:col-span-2 lg:col-span-5 p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
                    isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                        Earnings
                      </h2>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Chart Legend with Figures */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                          Revenue
                        </div>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-base font-bold text-gray-900 dark:text-white">
                            $37,802
                          </span>
                          <span className="text-[11px] font-semibold text-[#22c55e] flex items-center">
                            <TrendingUp className="w-3 h-3 mr-0.5" /> 0.56%
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <span className="w-2 h-2 rounded-full bg-[#93c5fd]" />
                          Profit
                        </div>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-base font-bold text-gray-900 dark:text-white">
                            $28,305
                          </span>
                          <span className="text-[11px] font-semibold text-[#22c55e] flex items-center">
                            <TrendingUp className="w-3 h-3 mr-0.5" /> 0.56%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dual Bar Chart */}
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={EARNINGS_DATA} barGap={4}>
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#64748b" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? "#111827" : "#ffffff",
                            borderColor: isDark ? "#374151" : "#e2e8f0",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="profit" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. New Comments (3 cols) */}
                <div
                  className={`md:col-span-1 lg:col-span-3 p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
                    isDark ? "bg-[#1f2937] border-gray-800" : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      New Comments
                    </h2>
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
                    {NEW_COMMENTS.map((c) => (
                      <div key={c.id} className="pt-4 first:pt-0">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className="w-7 h-7 rounded-full overflow-hidden relative flex-shrink-0">
                            <Image
                              src={c.avatar}
                              alt={c.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                              {c.name}
                            </p>
                            <div className="flex items-center text-amber-400 text-[10px] leading-none">
                              {"★".repeat(c.rating)}
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {c.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════
                  FOOTER
                  ══════════════════════════════════════════ */}
              <footer className="pt-6 pb-2 text-center text-xs text-gray-400 dark:text-gray-500">
                Copyright © 2026 Ecom. Design by{" "}
                <span className="text-[#2563eb] hover:underline cursor-pointer">Rokib</span> All
                rights reserved.
              </footer>
            </div>
          </main>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          IMAGE 5: SETTINGS DRAWER UI ("SETTING")
          ══════════════════════════════════════════ */}
      {settingsDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setSettingsDrawerOpen(false)}
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
                  onClick={() => setSettingsDrawerOpen(false)}
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
                  onClick={() => setSettingsDrawerOpen(false)}
                  className="w-full py-2.5 bg-[#2563eb] text-white font-medium text-xs rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Apply & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
