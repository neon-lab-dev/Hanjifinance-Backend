import { ObjectId } from "mongoose";

export interface TCourseOrder {
  orderId: string;
  userId: ObjectId;
  userCustomId: string;
  purchasedCourses: string[];
  totalAmount: number;
  razorpayOrderId?: string;
}