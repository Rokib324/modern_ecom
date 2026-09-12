import Coupon from "@/models/Coupon";

export async function ensureSeedCoupons() {
  try {
    const count = await Coupon.countDocuments();
    if (count === 0) {
      await Coupon.create([
        {
          code: "ECOM10",
          description: "10% off storewide discount",
          discountType: "percentage",
          discountValue: 10,
          minOrderAmount: 0,
          maxDiscountAmount: null,
          startDate: new Date(),
          expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          usageLimit: 500,
          usedCount: 12,
          userLimit: 1,
          isActive: true,
        },
        {
          code: "SAVE20",
          description: "20% off on orders over ৳1,000 (Max discount ৳500)",
          discountType: "percentage",
          discountValue: 20,
          minOrderAmount: 1000,
          maxDiscountAmount: 500,
          startDate: new Date(),
          expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          usageLimit: 250,
          usedCount: 38,
          userLimit: 1,
          isActive: true,
        },
        {
          code: "FLAT200",
          description: "Flat ৳200 discount on orders above ৳2,000",
          discountType: "fixed",
          discountValue: 200,
          minOrderAmount: 2000,
          maxDiscountAmount: null,
          startDate: new Date(),
          expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          usageLimit: 100,
          usedCount: 19,
          userLimit: 2,
          isActive: true,
        },
        {
          code: "VIP50",
          description: "Special VIP discount: ৳50 off with no minimum purchase",
          discountType: "fixed",
          discountValue: 50,
          minOrderAmount: 0,
          maxDiscountAmount: null,
          startDate: new Date(),
          expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Expired sample
          usageLimit: 50,
          usedCount: 50,
          userLimit: 1,
          isActive: false,
        },
      ]);
    }
  } catch (err) {
    console.error("Error ensuring seed coupons:", err);
  }
}
