import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { BoardRoomBanterSubscription } from "./boardroomBanter.model";
import { razorpay } from "../../utils/razorpay";
import crypto from "crypto";
import config from "../../config";

const createSubscription = async (userId: string) => {

  const planId = config.boardroom_banter_plan_id || ""

  const razorpaySubscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: 1,
    quantity: 1,
    start_at: Math.floor(Date.now() / 1000),
  });

  const subscription = await BoardRoomBanterSubscription.create({
    userId,
    razorpaySubscriptionId: razorpaySubscription.id,
  });

  return subscription;
};


const verifySubscription = async (
  razorpaySubscriptionId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) => {
  if (!razorpaySubscriptionId || !razorpayPaymentId || !razorpaySignature) {
    return {
      success: false,
      redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}/failed`,
    };
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
    .update(`${razorpaySubscriptionId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return {
      success: false,
      redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}/failed`,
    };
  }


 const subscription = await BoardRoomBanterSubscription.findOneAndUpdate(
  { razorpaySubscriptionId },
  {
    razorpayPaymentId,
    razorpaySignature,
    status: "active",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  },
  { new: true }
);


  if (!subscription) {
    return {
      success: false,
      redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}/failed`,
    };
  }

  return {
    success: true,
    redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}/success?subscriptionId=${razorpaySubscriptionId}`,
    subscription,
  };
};


const pauseSubscription = async (userId: string) => {
  const subscription = await BoardRoomBanterSubscription.findOne({ userId, status: "active" });

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "No active subscription found to pause");
  }

  subscription.status = "paused";
  subscription.pauseDate = new Date();
  await subscription.save();

  return subscription;
};

const resumeSubscription = async (userId: string) => {
  const subscription = await BoardRoomBanterSubscription.findOne({ userId, status: "paused" });

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "No paused subscription found to resume");
  }

  subscription.status = "active";
  subscription.resumeDate = new Date();

  // Adjust endDate by adding the paused duration
  if (subscription.pauseDate) {
    const pausedDuration = subscription.resumeDate.getTime() - subscription.pauseDate.getTime();
    subscription.endDate = new Date(subscription.endDate.getTime() + pausedDuration);
  }

  await subscription.save();
  return subscription;
};

const getMySubscription = async (userId: string) => {
  return await BoardRoomBanterSubscription.findOne({ userId }).sort({ createdAt: -1 });
};

export const BoardRoomBanterSubscriptionService = {
  createSubscription,
  verifySubscription,
  pauseSubscription,
  resumeSubscription,
  getMySubscription,
};
