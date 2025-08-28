import mongoose, { Document } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export enum OrderPaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export enum OrderStatus {
  PENDING = "pending",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  PROCESSING = "processing",
}

export interface Order extends Document {
  _id: string;
  customerId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  paymentStatus: "pending" | "success" | "failed";
  paymentMethod: "card" | "paypal";
  billingAddress: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  orderStatus: "pending" | "shipped" | "delivered" | "cancelled" | "processing";
}

const orderSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  billingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ["card"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  orderStatus: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    require: true,
  },
});

const Order =
  mongoose.models?.Order || mongoose.model<Order>("Order", orderSchema);

export default Order;
