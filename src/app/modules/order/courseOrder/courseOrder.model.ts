import { Schema, model } from "mongoose";
import { TCourseOrder } from "./courseOrder.interface";

const CourseOrderSchema = new Schema<TCourseOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userCustomId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    courses: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        courseTitle: { type: String, required: true },
        coursePrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    razorpayOrderId: { type: String },
    orderType: { type: String, enum: ["single", "bundle"], required: true },
  },
  { timestamps: true }
);

export const CourseOrder = model<TCourseOrder>(
  "CourseOrder",
  CourseOrderSchema
);
