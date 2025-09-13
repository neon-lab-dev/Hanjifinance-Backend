import { Schema, model } from "mongoose";
import { TCourseOrder } from "./courseOrder.interface";

const CourseOrderSchema = new Schema<TCourseOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userCustomId: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    totalAmount: { type: Number, required: true },
    razorpayOrderId: { type: String },
  },
  { timestamps: true }
);

export const CourseOrder = model<TCourseOrder>(
  "CourseOrder",
  CourseOrderSchema
);