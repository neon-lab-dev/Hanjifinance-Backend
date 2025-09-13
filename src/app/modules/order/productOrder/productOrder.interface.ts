import { ObjectId } from "mongoose";

export interface TProductOrderItem {
  productId: ObjectId;
  quantity: number;
  price: number;
}

export interface TProductOrder {
  orderId: string;
  userId: ObjectId;
  userCustomId: string;
  orderedItems: TProductOrderItem[];
  totalAmount: number;
  status: "pending" | "delivered" | "cancelled";
  razorpayOrderId?: string;
}