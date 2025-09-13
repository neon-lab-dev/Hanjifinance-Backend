import { Schema, model } from "mongoose";
import { TBoardRoomBanterSubscription } from "./boardroomBanter.interface";

const boardRoomBanterSubscriptionSchema =
  new Schema<TBoardRoomBanterSubscription>(
    {
      userId: {
        type: String,
        required: true,
        ref: "User",
      },
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phoneNumber: { type: String, required: true, trim: true },
      qualification: { type: String, required: false, trim: true },
      profession: { type: String, required: false, trim: true },
      message: { type: String, required: false, trim: true },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      status: {
        type: String,
        enum: ["waitlist", "active", "paused", "expired", "pending"],
        default: "active",
      },
      pauseDate: {
        type: Date,
      },
      resumeDate: {
        type: Date,
      },
      razorpaySubscriptionId: { type: String, required: false, default: "" },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      isAddedToWhatsappGroup: { type: Boolean, default: false },
      isSuspended: { type: Boolean, default: false },
      isRemoved: { type: Boolean, default: false },
      isCouponCodeSent: { type: Boolean, default: false },
    },
    { timestamps: true }
  );

export const BoardRoomBanterSubscription = model<TBoardRoomBanterSubscription>(
  "BoardRoomBanterSubscription",
  boardRoomBanterSubscriptionSchema
);
