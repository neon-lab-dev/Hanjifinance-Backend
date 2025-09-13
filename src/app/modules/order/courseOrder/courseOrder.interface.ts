import { ObjectId } from "mongoose";

export interface TCourseOrder {
  orderId: string;
  userId: ObjectId;
  userCustomId: string;
  name:string;
  email:string;
  phoneNumber:string;
  courseId: ObjectId;
  courseTitle: string;
  coursePrice: number;
  totalAmount: number;
  razorpayOrderId?: string;
}