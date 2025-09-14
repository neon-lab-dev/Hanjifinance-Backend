import { Document } from "mongoose";

export interface TBoardRoomBanterSubscription extends Document {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  qualification?:string;
  profession?:string;
  message?:string;
  startDate: Date;
  endDate: Date;
  status: "waitlist" | "code sent" | "active" | "paused" | "expired" | "pending" | "cancelled";
  pauseDate?: Date;
  resumeDate?: Date;
  cancelDate?: Date;
  razorpaySubscriptionId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  isAddedToWhatsappGroup?: boolean;
  isSuspended?: boolean;
  isRemoved?: boolean;
}
