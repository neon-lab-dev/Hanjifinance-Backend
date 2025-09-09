import { Schema, model } from "mongoose";
import { TChatAndChill } from "./chatAndChill.interface";

const ChatAndChillSchema = new Schema<TChatAndChill>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userCustomId: {
      type: String,
      trim: true,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "booked", "scheduled" , "cancelled", "completed"],
      default: "pending",
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    meetingLink: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ChatAndChill = model<TChatAndChill>("ChatAndChill", ChatAndChillSchema);

export default ChatAndChill;
