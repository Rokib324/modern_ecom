/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Load .env.local manually
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const [key, ...values] = trimmed.split("=");
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join("=").trim();
      }
    });
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not set in .env.local");
  process.exit(1);
}

// Minimal schemas for seeding
const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: String,
    price: { type: Number, required: true },
    comparePrice: Number,
    images: [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: String,
    stock: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },
    tags: [String],
    attributes: [{ name: String, value: String }],
    reviews: [ReviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function seed() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  // 1. Seed Categories
  console.log("Seeding categories...");
  const categoriesData = [
    {
      name: "New In",
      slug: "new",
      description: "Discover our newest luxury arrivals, nightwear, and pyjamas.",
      image: "/images/featured_new_in.jpg",
    },
    {
      name: "Womens",
      slug: "womens",
      description: "Sophisticated silk, satin, and pure cotton nightwear for women.",
      image: "/images/newin_ivory_cami.jpg",
    },
    {
      name: "Mens",
      slug: "mens",
      description: "Crisp cotton and classic tailored pyjama sets for men.",
      image: "/images/mens_nightwear.jpg",
    },
    {
      name: "Kids",
      slug: "kids",
      description: "Ultra-soft and gentle nightwear designed for kids and babies.",
      image: "/images/kids_pyjamas.jpg",
    },
    {
      name: "Robes & Gowns",
      slug: "robes",
      description: "Flowing luxury dressing gowns and kimonos.",
      image: "/images/featured_dressing_gowns.jpg",
    },
    {
      name: "Home & Accessories",
      slug: "home",
      description: "Silk pillowcases, eyemasks, and home fragrance essentials.",
      image: "/images/folded_cloths.jpg",
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const updated = await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true, new: true }
    );
    categoryMap[cat.slug] = updated._id;
    console.log(`  ✓ Category: ${updated.name} (${updated._id})`);
  }

  // 2. Seed Products with BDT pricing
  console.log("Seeding products...");
  const productsData = [
    {
      name: "Ivory Cami Short Pyjama Set with Blue Lace Trim Satin",
      slug: "ivory-cami-short-pyjama-set-blue-lace",
      description:
        "Crafted from lustrous silk-touch satin, this ivory cami short set features intricate contrasting sapphire blue lace trim along the neckline and hem. Includes adjustable shoulder straps and an elasticated waistband for sublime comfort.",
      shortDescription: "Silk-touch satin cami short set with sapphire blue lace.",
      price: 5800,
      comparePrice: 6500,
      images: ["/images/newin_ivory_cami.jpg"],
      category: categoryMap["new"],
      brand: "Maison De Nuit",
      stock: 45,
      sku: "MDN-CAMI-01",
      tags: ["new", "satin", "lace", "cami", "summer"],
      attributes: [
        { name: "Material", value: "95% Polyester Satin, 5% Elastane" },
        { name: "Care", value: "Machine Wash Delicate 30°C" },
      ],
      isFeatured: true,
      rating: 4.9,
      numReviews: 12,
    },
    {
      name: "Ivory Satin Dressing Gown with Blue Lace Trim",
      slug: "ivory-satin-dressing-gown-blue-lace",
      description:
        "An exquisite kimono-style full-length dressing gown in gleaming ivory satin, adorned with scalloped blue lace cuffs and hemline. Fastens with a matching wide belt tie.",
      shortDescription: "Full-length ivory satin kimono gown with scalloped blue lace.",
      price: 6200,
      comparePrice: 7000,
      images: ["/images/newin_ivory_gown.jpg"],
      category: categoryMap["robes"],
      brand: "Maison De Nuit",
      stock: 30,
      sku: "MDN-GOWN-02",
      tags: ["new", "robe", "satin", "lace", "dressing-gown"],
      attributes: [
        { name: "Length", value: "Mid-Calf (120cm)" },
        { name: "Material", value: "Satin with Scalloped Lace" },
      ],
      isFeatured: true,
      rating: 4.8,
      numReviews: 8,
    },
    {
      name: "Silver Grey with Pink Lace Trim Satin Cap Sleeve Nightdress",
      slug: "silver-grey-pink-lace-satin-nightdress",
      description:
        "A flattering bias-cut nightdress rendered in soft silver-grey satin, detailed with delicate dusty pink eyelash lace along the sweetheart neckline and cap sleeves.",
      shortDescription: "Bias-cut silver grey satin nightdress with dusty pink lace.",
      price: 5500,
      comparePrice: 6200,
      images: ["/images/newin_silver_nightdress.jpg"],
      category: categoryMap["womens"],
      brand: "Maison De Nuit",
      stock: 25,
      sku: "MDN-ND-03",
      tags: ["nightdress", "satin", "grey", "lace", "bestseller"],
      attributes: [
        { name: "Fit", value: "Relaxed Bias Cut" },
        { name: "Material", value: "100% Silky Satin" },
      ],
      isFeatured: true,
      rating: 5.0,
      numReviews: 15,
    },
    {
      name: "Autumn Floral with Pink Lace Trim Satin Cami Long Pyjama Set",
      slug: "autumn-floral-pink-lace-satin-long-set",
      description:
        "Rich autumnal florals printed across midnight satin, balanced by blush pink lace framing the camisole. Paired with full-length straight-leg trousers with an elasticated drawstring waist.",
      shortDescription: "Floral print camisole and long trousers pyjama set.",
      price: 5900,
      comparePrice: 6800,
      images: ["/images/newin_autumn_floral_cami.jpg"],
      category: categoryMap["womens"],
      brand: "Botanique",
      stock: 40,
      sku: "BOT-FLR-04",
      tags: ["floral", "autumn", "satin", "long-pyjamas"],
      attributes: [
        { name: "Inseam", value: "76cm" },
        { name: "Material", value: "Satin Twill" },
      ],
      isFeatured: false,
      rating: 4.7,
      numReviews: 9,
    },
    {
      name: "Autumn Floral Satin Kimono Robe with Blush Trim",
      slug: "autumn-floral-satin-kimono-robe",
      description:
        "A wrap robe showcasing painterly botanical blossoms on dark navy satin. Features three-quarter kimono sleeves trimmed in delicate blush lace.",
      shortDescription: "Botanical print kimono wrap robe with blush lace.",
      price: 6500,
      comparePrice: 7400,
      images: ["/images/newin_autumn_floral_set.jpg"],
      category: categoryMap["robes"],
      brand: "Botanique",
      stock: 20,
      sku: "BOT-ROBE-05",
      tags: ["floral", "robe", "kimono"],
      attributes: [{ name: "Sleeve", value: "3/4 Kimono" }],
      isFeatured: false,
      rating: 4.9,
      numReviews: 6,
    },
    {
      name: "Classic Striped Woven Cotton Pyjama Set",
      slug: "classic-striped-cotton-pyjama-set",
      description:
        "Traditional luxury tailoring meets breathable 100% organic woven cotton. White and navy candy stripes finished with mother-of-pearl buttons and crisp contrast piping.",
      shortDescription: "Crisp organic cotton striped button-down pyjamas.",
      price: 4500,
      comparePrice: 5200,
      images: ["/images/collection_striped_pyjamas.jpg"],
      category: categoryMap["womens"],
      brand: "Heritage Sleepwear",
      stock: 35,
      sku: "HER-STR-06",
      tags: ["cotton", "striped", "classic", "organic"],
      attributes: [
        { name: "Material", value: "100% GOTS Certified Cotton" },
        { name: "Closure", value: "Mother of Pearl Buttons" },
      ],
      isFeatured: true,
      rating: 4.8,
      numReviews: 22,
    },
    {
      name: "Heritage Soft Cotton Button-Down Nightwear",
      slug: "heritage-soft-cotton-nightwear",
      description:
        "Indulgently soft brushed cotton nightwear set designed for crisp evenings. Tailored notched lapel collar with chest pocket.",
      shortDescription: "Brushed cotton long pyjama set with notched lapels.",
      price: 4800,
      comparePrice: 5500,
      images: ["/images/collection_cotton_pyjamas.jpg"],
      category: categoryMap["womens"],
      brand: "Heritage Sleepwear",
      stock: 30,
      sku: "HER-COT-07",
      tags: ["cotton", "soft", "loungewear"],
      attributes: [{ name: "Material", value: "Brushed Cotton" }],
      isFeatured: false,
      rating: 4.7,
      numReviews: 11,
    },
    {
      name: "Mens Classic Tailored Cotton Nightwear Set",
      slug: "mens-classic-tailored-cotton-set",
      description:
        "Sophisticated gentleman's nightwear set crafted from 200-thread-count Egyptian cotton. Features a tailored piped shirt and comfortable drawstring trousers.",
      shortDescription: "Men's tailored Egyptian cotton pyjama suit.",
      price: 5200,
      comparePrice: 5900,
      images: ["/images/mens_nightwear.jpg"],
      category: categoryMap["mens"],
      brand: "Savile Sleep",
      stock: 32,
      sku: "SAV-MEN-08",
      tags: ["mens", "cotton", "tailored", "classic"],
      attributes: [
        { name: "Fit", value: "Regular Mens Tailored" },
        { name: "Material", value: "100% Egyptian Cotton" },
      ],
      isFeatured: true,
      rating: 4.9,
      numReviews: 18,
    },
    {
      name: "Kids Organic Cotton Sweet Dreams Pyjama Set",
      slug: "kids-organic-cotton-sweet-dreams-set",
      description:
        "Gentle, hypoallergenic 100% organic cotton two-piece set designed to provide optimal airflow and peaceful sleep for little ones. 20% of profits go to our chosen children's charity.",
      shortDescription: "Ultra-soft hypoallergenic organic cotton set for children.",
      price: 2800,
      comparePrice: 3400,
      images: ["/images/kids_pyjamas.jpg"],
      category: categoryMap["kids"],
      brand: "Little Slumber",
      stock: 60,
      sku: "LIT-KID-09",
      tags: ["kids", "organic", "charity", "cotton"],
      attributes: [
        { name: "Age Group", value: "2 - 12 Years" },
        { name: "Standard", value: "OEKO-TEX Standard 100" },
      ],
      isFeatured: true,
      rating: 5.0,
      numReviews: 31,
    },
    {
      name: "Gingham Check Relaxed Cotton Loungewear",
      slug: "gingham-check-relaxed-cotton-loungewear",
      description:
        "Chic retro-inspired gingham check pyjamas in yarn-dyed breathable cotton. Perfect for lazy Sunday mornings and relaxed evenings.",
      shortDescription: "Yarn-dyed gingham check two-piece loungewear.",
      price: 4200,
      comparePrice: 4900,
      images: ["/images/featured_gingham_product.jpg"],
      category: categoryMap["womens"],
      brand: "Heritage Sleepwear",
      stock: 28,
      sku: "HER-GIN-10",
      tags: ["gingham", "cotton", "weekend"],
      attributes: [{ name: "Weave", value: "Yarn-Dyed Poplin" }],
      isFeatured: false,
      rating: 4.6,
      numReviews: 7,
    },
    {
      name: "Luxury Silk Pillowcase & Eye Mask Set",
      slug: "luxury-silk-pillowcase-eye-mask-set",
      description:
        "100% Mulberry silk 22-momme pillowcase and cushioned eye mask. Protects skin hydration and prevents morning hair frizz.",
      shortDescription: "Pure Mulberry silk 22-momme pillowcase with sleep mask.",
      price: 3500,
      comparePrice: 4200,
      images: ["/images/folded_cloths.jpg"],
      category: categoryMap["home"],
      brand: "Maison De Nuit",
      stock: 50,
      sku: "MDN-SLK-11",
      tags: ["silk", "pillowcase", "accessories", "gift"],
      attributes: [{ name: "Silk Grade", value: "Grade 6A Mulberry Silk" }],
      isFeatured: false,
      rating: 4.9,
      numReviews: 19,
    },
  ];

  for (const prod of productsData) {
    const updated = await Product.findOneAndUpdate(
      { slug: prod.slug },
      { $set: prod },
      { upsert: true, new: true }
    );
    console.log(`  ✓ Product: ${updated.name} (৳${updated.price})`);
  }

  console.log("\n Seeding completed successfully!");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeder failed:", err);
  process.exit(1);
});
