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
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["active", "paused", "expired"],
        default: "active",
      },
      pauseDate: {
        type: Date,
      },
      resumeDate: {
        type: Date,
      },
      razorpaySubscriptionId: { type: String, required: true },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
    },
    { timestamps: true }
  );

export const BoardRoomBanterSubscription = model<TBoardRoomBanterSubscription>(
  "BoardRoomBanterSubscription",
  boardRoomBanterSubscriptionSchema
);
