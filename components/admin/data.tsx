import React from "react";

/* ─── Chart Data ─────────────────────────────────────────────────────────────── */

export const RECENT_ORDER_DATA = [
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

export const EARNINGS_DATA = [
  { month: "Jan", revenue: 28000, profit: 18000 },
  { month: "Feb", revenue: 38000, profit: 24000 },
  { month: "Mar", revenue: 22000, profit: 14000 },
  { month: "Apr", revenue: 34000, profit: 22000 },
  { month: "May", revenue: 49000, profit: 32000 },
  { month: "Jun", revenue: 41000, profit: 27000 },
  { month: "Jul", revenue: 19000, profit: 12000 },
  { month: "Aug", revenue: 35000, profit: 23000 },
];

export const SALES_SPARKLINE = [
  { v: 12 }, { v: 19 }, { v: 15 }, { v: 24 }, { v: 22 }, { v: 30 }, { v: 28 }, { v: 35 },
];

export const INCOME_SPARKLINE = [
  { v: 35 }, { v: 28 }, { v: 30 }, { v: 22 }, { v: 24 }, { v: 18 }, { v: 20 }, { v: 15 },
];

export const ORDERS_PAID_SPARKLINE = [
  { v: 20 }, { v: 22 }, { v: 21 }, { v: 23 }, { v: 22 }, { v: 24 }, { v: 23 }, { v: 24 },
];

export const VISITOR_SPARKLINE = [
  { v: 15 }, { v: 22 }, { v: 18 }, { v: 28 }, { v: 25 }, { v: 34 }, { v: 30 }, { v: 38 },
];

/* ─── Circular Flag Components ───────────────────────────────────────────────── */

export function SpainFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="6" fill="#AA151B" />
      <rect y="6" width="24" height="12" fill="#F1BF00" />
      <rect y="18" width="24" height="6" fill="#AA151B" />
    </svg>
  );
}

export function IndiaFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="8" fill="#FF9933" />
      <rect y="8" width="24" height="8" fill="#FFFFFF" />
      <rect y="16" width="24" height="8" fill="#138808" />
      <circle cx="12" cy="12" r="2.5" fill="#000080" />
    </svg>
  );
}

export function UKFlag() {
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

export function BrazilFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="24" fill="#009c3b" />
      <polygon points="12,3 22,12 12,21 2,12" fill="#ffdf00" />
      <circle cx="12" cy="12" r="4" fill="#002776" />
    </svg>
  );
}

export function FranceFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="8" height="24" fill="#002654" />
      <rect x="8" width="8" height="24" fill="#FFFFFF" />
      <rect x="16" width="8" height="24" fill="#ED2939" />
    </svg>
  );
}

export function TurkeyFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="24" fill="#E30A17" />
      <circle cx="10" cy="12" r="4.5" fill="#FFF" />
      <circle cx="11.2" cy="12" r="3.6" fill="#E30A17" />
      <polygon points="15,10 14,12 16,11 14,13" fill="#FFF" />
    </svg>
  );
}

export function BelgiumFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="8" height="24" fill="#000000" />
      <rect x="8" width="8" height="24" fill="#FFD100" />
      <rect x="16" width="8" height="24" fill="#FF0F00" />
    </svg>
  );
}

export function SwedenFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="24" fill="#006AA7" />
      <rect x="7" width="3" height="24" fill="#FECC00" />
      <rect y="10.5" width="24" height="3" fill="#FECC00" />
    </svg>
  );
}

export function VietnamFlag() {
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

export function AustraliaFlag() {
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

export function SaudiFlag() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm overflow-hidden flex-shrink-0">
      <rect width="24" height="24" fill="#006C35" />
      <path d="M5,12 H19 M12,9 V15" stroke="#FFF" strokeWidth="1.5" />
    </svg>
  );
}

/* ─── Top Products List ──────────────────────────────────────────────────────── */

export const TOP_PRODUCTS = [
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

export const TOP_COUNTRIES = [
  { name: "Turkish Flag", Flag: TurkeyFlag, trend: "up" as const, value: "6,972" },
  { name: "Belgium", Flag: BelgiumFlag, trend: "up" as const, value: "6,972" },
  { name: "Sweden", Flag: SwedenFlag, trend: "down" as const, value: "6,972" },
  { name: "Vietnamese", Flag: VietnamFlag, trend: "up" as const, value: "6,972" },
  { name: "Australia", Flag: AustraliaFlag, trend: "down" as const, value: "6,972" },
  { name: "Saudi Arabia", Flag: SaudiFlag, trend: "down" as const, value: "6,972" },
];

/* ─── Best Shop Sellers List ─────────────────────────────────────────────────── */

export const BEST_SELLERS = [
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

export const PRODUCT_OVERVIEW = [
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

export const ORDERS_LIST = [
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

export const NEW_COMMENTS = [
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
