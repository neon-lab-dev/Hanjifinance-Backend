import { Types } from "mongoose";

export type TChatAndChill = {
  user: Types.ObjectId;
  userCustomId?: string;
  title?: string;
  amount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: "pending" | "booked" | "scheduled" | "cancelled" | "completed";
  scheduledAt?: Date;
  meetingLink? :string;
  createdAt?: Date;
  updatedAt?: Date;
};