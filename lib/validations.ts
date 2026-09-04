import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(120),
  slug: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().max(300).optional(),
  price: z.number().min(0, "Price cannot be negative"),
  comparePrice: z.number().min(0).optional(),
  images: z.array(z.string().url("Invalid image URL").or(z.string().startsWith("/"))).min(1, "At least one image is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  stock: z.number().int().min(0, "Stock cannot be negative").default(0),
  sku: z.string().min(2, "SKU is required").optional(),
  tags: z.array(z.string()).default([]),
  attributes: z
    .array(
      z.object({
        name: z.string().min(1),
        value: z.string().min(1),
      })
    )
    .default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  weight: z.number().optional(),
  dimensions: z
    .object({
      length: z.number(),
      width: z.number(),
      height: z.number(),
    })
    .optional(),
});

export const productUpdateSchema = productSchema.partial();

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(50),
  slug: z.string().optional(),
  description: z.string().max(500).optional(),
  image: z.string().optional(),
  parent: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export const categoryUpdateSchema = categorySchema.partial();

export const orderItemSchema = z.object({
  product: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  // Optional client metadata, but server will re-fetch price and name
  price: z.number().optional(),
  name: z.string().optional(),
  image: z.string().optional(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().regex(/^(\+?88)?01[3-9]\d{8}$/, "Please enter a valid Bangladesh phone number"),
  email: z.string().email("Please enter a valid email"),
  street: z.string().min(3, "Street / detailed address is required"),
  district: z.string().min(2, "District is required"),
  division: z.string().min(2, "Division is required"),
  upazila: z.string().optional(),
  country: z.string().default("BD"),
});

export const orderCreateSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Cart cannot be empty"),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["bkash", "nagad", "cod"]),
  notes: z.string().max(500).optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]),
  trackingNumber: z.string().optional(),
  isPaid: z.boolean().optional(),
  notes: z.string().optional(),
});

export const reviewCreateSchema = z.object({
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(3, "Review comment must be at least 3 characters").max(1000),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50).optional(),
  phone: z.string().regex(/^(\+?88)?01[3-9]\d{8}$/, "Valid Bangladesh phone number required").optional().or(z.literal("")),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().default("BD"),
    })
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
