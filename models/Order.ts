import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrderItem {
  product?: mongoose.Types.ObjectId | string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  district: string;
  division: string;
  upazila?: string;
  country: string;
}

export interface IOrder extends Document {
  orderId: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: "bkash" | "nagad" | "cod";
  paymentProvider?: "bkash" | "nagad";
  bkashPaymentId?: string;
  nagadOrderId?: string;
  paymentResult?: {
    id: string;
    status: string;
    transactionId: string;
    updateTime: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  currency: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.Mixed, required: false },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema<IShippingAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  street: { type: String, required: true },
  district: { type: String, required: true },
  division: { type: String, required: true },
  upazila: { type: String },
  country: { type: String, required: true, default: "BD" },
});

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      required: true,
      enum: ["bkash", "nagad", "cod"],
      default: "bkash",
    },
    paymentProvider: {
      type: String,
      enum: ["bkash", "nagad"],
    },
    bkashPaymentId: String,
    nagadOrderId: String,
    paymentResult: {
      id: String,
      status: String,
      transactionId: String,
      updateTime: String,
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "BDT" },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    trackingNumber: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ bkashPaymentId: 1 });
orderSchema.index({ nagadOrderId: 1 });

if (process.env.NODE_ENV !== "production") {
  delete (mongoose.models as Record<string, unknown>).Order;
}

const Order: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder>) ||
  mongoose.model<IOrder>("Order", orderSchema);

export default Order;
