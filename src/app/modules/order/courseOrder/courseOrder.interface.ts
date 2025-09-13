import { ObjectId } from "mongoose";

export interface TCourseOrder {
  orderId: string;
  userId: ObjectId;
  userCustomId: string;
  courseId: ObjectId;
  totalAmount: number;
  razorpayOrderId?: string;
}