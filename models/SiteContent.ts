import mongoose, { Document, Model, Schema } from "mongoose";

// ─── Default seed data for all sections ───────────────────────────────────────
export const SITE_CONTENT_DEFAULTS: Record<string, unknown> = {
  announcements: {
    items: [
      { id: "ann-1", text: "We Donate 20% of the Profits From our Kids Collection to our Chosen Charity!", active: true },
      { id: "ann-2", text: "Free Shipping on Orders Over $75 — Shop Now", active: true },
      { id: "ann-3", text: "New Arrivals Every Week — Explore the Latest Drops", active: true },
    ],
  },

  hero: {
    slides: [
      {
        id: "slide-1",
        src: "/images/folded_cloths.jpg",
        alt: "Stacked folded garments with floral and gingham prints",
        heading: "New shapes, fresh prints, instant favourites.",
        ctaLabel: "SHOP NEW IN",
        ctaHref: "/products?category=new",
        active: true,
      },
      {
        id: "slide-2",
        src: "/images/homepagemodel.jpg",
        alt: "Model wearing new season styles",
        heading: "Effortless style, beautifully made.",
        ctaLabel: "SHOP WOMENS",
        ctaHref: "/products?category=womens",
        active: true,
      },
    ],
    slideDuration: 6000,
  },

  collections: {
    heading: "Shop Our Collections",
    items: [
      { id: "cotton", title: "Women's Cotton Pyjamas & Nightwear", image: "/images/collection_cotton_pyjamas.jpg", href: "/products?category=cotton-pyjamas", active: true },
      { id: "nightdresses", title: "Women's Nightdresses and Shirts", image: "/images/collection_nightdresses.jpg", href: "/products?category=nightdresses", active: true },
      { id: "satin", title: "Women's Satin Pyjamas & Nightwear", image: "/images/collection_satin_pyjamas.jpg", href: "/products?category=satin-pyjamas", active: true },
      { id: "striped", title: "Striped Pyjamas & Nightwear", image: "/images/collection_striped_pyjamas.jpg", href: "/products?category=striped-pyjamas", active: true },
    ],
  },

  new_in: {
    tabs: [
      { key: "new-in", label: "New In" },
      { key: "best-sellers", label: "Best Sellers" },
      { key: "linen-blend", label: "Linen Blend" },
    ],
    products: [
      { id: "new-1", name: "Ivory Cami Short Pyjama Set with Blue Lace Trim Satin", price: "৳5,800", numPrice: 5800, image: "/images/newin_ivory_cami.jpg", category: "new-in", sizes: ["XS","S","M","L","XL"], isNew: true, active: true },
      { id: "new-2", name: "Ivory Satin Dressing Gown with Blue Lace Trim", price: "৳6,200", numPrice: 6200, image: "/images/newin_ivory_gown.jpg", category: "new-in", sizes: ["XS","S","M","L","XL"], isNew: true, active: true },
      { id: "new-3", name: "Silver Grey with Pink Lace Trim Satin Cap Sleeve Nightdress", price: "৳5,500", numPrice: 5500, image: "/images/newin_silver_nightdress.jpg", category: "new-in", sizes: ["XS","S","M","L","XL"], isNew: true, active: true },
      { id: "new-4", name: "Autumn Floral with Pink Lace Trim Satin Cami Long Pyjama Set", price: "৳5,900", numPrice: 5900, image: "/images/newin_autumn_floral_cami.jpg", category: "new-in", sizes: ["XS","S","M","L","XL"], isNew: true, active: true },
      { id: "new-5", name: "Autumn Floral Satin Kimono Robe with Blush Trim", price: "৳6,500", numPrice: 6500, image: "/images/newin_autumn_floral_set.jpg", category: "new-in", sizes: ["XS","S","M","L","XL"], isNew: true, active: true },
      { id: "new-6", name: "Forest Green Gingham Nightwear Robe", price: "৳5,400", numPrice: 5400, image: "/images/featured_gingham_product.jpg", category: "new-in", sizes: ["S","M","L","XL"], isNew: true, active: true },
      { id: "best-1", name: "Classic Navy Striped Cotton Traditional Pyjama Set", price: "৳4,500", numPrice: 4500, image: "/images/collection_striped_pyjamas.jpg", category: "best-sellers", sizes: ["XS","S","M","L","XL"], isNew: false, active: true },
      { id: "best-2", name: "Luxury Satin Long Sleeve & Trouser Nightwear Set", price: "৳5,200", numPrice: 5200, image: "/images/collection_satin_pyjamas.jpg", category: "best-sellers", sizes: ["XS","S","M","L"], isNew: false, active: true },
      { id: "best-3", name: "Vintage Botanical Floral Cotton Nightdress", price: "৳4,200", numPrice: 4200, image: "/images/collection_nightdresses.jpg", category: "best-sellers", sizes: ["S","M","L","XL"], isNew: false, active: true },
      { id: "best-4", name: "Silk Touch Emerald Green Dressing Gown", price: "৳5,800", numPrice: 5800, image: "/images/featured_dressing_gowns.jpg", category: "best-sellers", sizes: ["XS","S","M","L"], isNew: false, active: true },
      { id: "best-5", name: "Handcrafted Pure Cotton Breathable Pyjama Set", price: "৳4,800", numPrice: 4800, image: "/images/collection_cotton_pyjamas.jpg", category: "best-sellers", sizes: ["XS","S","M","L","XL"], isNew: false, active: true },
      { id: "best-6", name: "Heritage Checkered Flannel Loungewear Set", price: "৳4,900", numPrice: 4900, image: "/images/featured_gingham_lifestyle.jpg", category: "best-sellers", sizes: ["S","M","L"], isNew: false, active: true },
      { id: "linen-1", name: "Relaxed Organic Linen Blend Long Sleeve Pyjama Set", price: "৳5,600", numPrice: 5600, image: "/images/folded_cloths.jpg", category: "linen-blend", sizes: ["S","M","L","XL"], isNew: true, active: true },
      { id: "linen-2", name: "Heritage Botanical Print Linen-Cotton Pyjamas", price: "৳5,400", numPrice: 5400, image: "/images/homepagemodel.jpg", category: "linen-blend", sizes: ["XS","S","M","L"], isNew: false, active: true },
      { id: "linen-3", name: "Breezy Oatmeal Linen Button-Down Nightdress", price: "৳4,800", numPrice: 4800, image: "/images/collection_cotton_pyjamas.jpg", category: "linen-blend", sizes: ["XS","S","M","L","XL"], isNew: false, active: true },
      { id: "linen-4", name: "Washed Terracotta Linen Cami & Shorts Lounge Set", price: "৳4,400", numPrice: 4400, image: "/images/newin_ivory_cami.jpg", category: "linen-blend", sizes: ["S","M","L"], isNew: false, active: true },
      { id: "linen-5", name: "Natural Oat Linen-Cotton Long Dressing Gown", price: "৳6,200", numPrice: 6200, image: "/images/featured_dressing_gowns.jpg", category: "linen-blend", sizes: ["XS","S","M","L","XL"], isNew: false, active: true },
      { id: "linen-6", name: "Sage Stripe Linen Blend Wide Leg Trousers & Cami Set", price: "৳5,000", numPrice: 5000, image: "/images/collection_nightdresses.jpg", category: "linen-blend", sizes: ["XS","S","M","L"], isNew: true, active: true },
    ],
  },

  featured_banners: {
    items: [
      { id: "new-in", title: "New In", buttonText: "Shop Now", href: "/products?category=new", image: "/images/featured_new_in.jpg", alt: "Model wearing new in sky blue floral cotton pyjamas", active: true },
      { id: "dressing-gowns", title: "Dressing Gowns & Robes", buttonText: "Shop Now", href: "/products?category=dressing-gowns", image: "/images/featured_dressing_gowns.jpg", alt: "Model wearing light blue floral cotton dressing gown robe", active: true },
    ],
  },

  mens_kids: {
    banners: [
      { id: "mens", title: "Mens Nightwear", description: "Pyjamas & Robes. From matching family moments to classic menswear-inspired styles, discover men's pyjamas and more", buttonText: "Shop Now", href: "/products?category=mens", image: "/images/mens_nightwear.jpg", alt: "Smiling man wearing classic navy printed pyjama shirt", active: true },
      { id: "kids", title: "Kids Pyjamas", description: "20% of the profits from our kids pyjamas go to a children's charity close to our hearts", buttonText: "Find Out More", href: "/products?category=kids", image: "/images/kids_pyjamas.jpg", alt: "Young girl wearing colourful summer pyjama set", active: true },
    ],
  },

  our_story: {
    eyebrow: "Our Story",
    heading: "Their Nibs has proudly evolved into a women-focused fashion brand, specialising in sleepwear and unique prints that celebrate the natural world, vibrant colour and feeling good.",
    ctaLabel: "Read more",
    ctaHref: "/about",
  },
};

// ─── Schema & Model ────────────────────────────────────────────────────────────
export interface ISiteContent extends Document {
  section: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  updatedAt: Date;
  updatedBy?: string;
}

const siteContentSchema = new Schema<ISiteContent>(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    updatedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

const SiteContent: Model<ISiteContent> =
  mongoose.models.SiteContent ||
  mongoose.model<ISiteContent>("SiteContent", siteContentSchema);

export default SiteContent;
