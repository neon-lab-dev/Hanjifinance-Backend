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
  status: "waitlist" | "active" | "paused" | "expired" | "pending";
  pauseDate?: Date;
  resumeDate?: Date;
  razorpaySubscriptionId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  isAddedToWhatsappGroup?: boolean;
  isSuspended?: boolean;
  isRemoved?: boolean;
  isCouponCodeSent?: boolean;
}
