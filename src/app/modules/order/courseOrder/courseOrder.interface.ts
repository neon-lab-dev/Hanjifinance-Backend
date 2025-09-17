import { ObjectId } from "mongoose";

type TCourseOrderItem = {
  courseId: ObjectId;
  courseTitle: string;
  coursePrice: number;
};
export interface TCourseOrder {
  orderId: string;
  userId: ObjectId;
  userCustomId: string;
  name: string;
  email: string;
  phoneNumber: string;
  courses: TCourseOrderItem[];
  courseTitle: string;
  coursePrice: number;
  totalAmount: number;
  razorpayOrderId?: string;
  orderType? : "single" | "bundle";
}
