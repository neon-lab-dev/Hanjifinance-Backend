import { ObjectId } from "mongoose";

export interface TOrderItem {
  productId: ObjectId;
  quantity: number;
  price: number;
}

export interface TOrder {
  orderId: string;
  userId: ObjectId;
  userCustomId: string;
  orderedItems: TOrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "failed";
  razorpayOrderId?: string;
}
