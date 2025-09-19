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
        enum: ["waitlist", "code sent", "active", "expired", "pending", "cancelled"],
        default: "active",
      },
      pauseDate: {
        type: Date,
      },
      resumeDate: {
        type: Date,
      },
      cancelDate: {
        type: Date,
        required: false,
      },
      razorpaySubscriptionId: { type: String, required: false, default: "" },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      isAddedToWhatsappGroup: { type: Boolean, default: false },
      isSuspended: { type: Boolean, default: false },
      isRemoved: { type: Boolean, default: false },
      pausedReason: { type: String, required: false, trim: true },
      cancelReason: { type: String, required: false, trim: true },
      dateRange: { type: String, required: false, trim: true },
      pauseReason: { type: String, required: false, trim: true },
    },
    { timestamps: true }
  );

export const BoardRoomBanterSubscription = model<TBoardRoomBanterSubscription>(
  "BoardRoomBanterSubscription",
  boardRoomBanterSubscriptionSchema
);
