import { Document } from "mongoose";

export interface TBoardRoomBanterSubscription extends Document {
  userId: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "paused" | "expired";
  pauseDate?: Date;
  resumeDate?: Date;
  razorpaySubscriptionId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}
