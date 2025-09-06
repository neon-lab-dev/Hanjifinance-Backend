import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { BoardRoomBanterSubscription } from "./boardroomBanter.model";

const createSubscription = async (userId: string, razorpayPaymentId: string) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); // 1-month subscription

  const subscription = await BoardRoomBanterSubscription.create({
    userId,
    startDate,
    endDate,
    status: "active",
    razorpayPaymentId,
  });

  return subscription;
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
  pauseSubscription,
  resumeSubscription,
  getMySubscription,
};
