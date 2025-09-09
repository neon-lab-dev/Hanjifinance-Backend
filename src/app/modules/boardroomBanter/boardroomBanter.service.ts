/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { BoardRoomBanterSubscription } from "./boardroomBanter.model";
import { razorpay } from "../../utils/razorpay";
import crypto from "crypto";
import config from "../../config";
import {
  sendSubscriptionEmails,
  sendSubscriptionStatusEmails,
} from "../../emailTemplates/sendPauseSubscriptionEmail";

const createSubscription = async (user: any) => {
  const planId = config.boardroom_banter_plan_id;
  if (!planId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Razorpay planId not configured"
    );
  }

  let razorpaySubscription;
  try {
    razorpaySubscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 1,
      quantity: 1,
    });
  } catch (error: any) {
    console.error("Razorpay subscription creation failed:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create subscription"
    );
  }

  const subscription = await BoardRoomBanterSubscription.create({
    userId: user?._id,
    razorpaySubscriptionId: razorpaySubscription.id,
    status: "pending", // pending until payment verified
  });

  await sendSubscriptionEmails(user, subscription);

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

const pauseSubscription = async (user: any) => {
  const subscription = await BoardRoomBanterSubscription.findOne({
    userId: user?._id,
    status: "active",
  });

  if (!subscription) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No active subscription found to pause"
    );
  }

  subscription.status = "paused";
  subscription.pauseDate = new Date();
  await subscription.save();

  await sendSubscriptionStatusEmails(user, subscription, "paused");

  return subscription;
};

const resumeSubscription = async (user: any) => {
  const subscription = await BoardRoomBanterSubscription.findOne({
    userId: user?._id,
    status: "paused",
  });

  if (!subscription) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No paused subscription found to resume"
    );
  }

  subscription.status = "active";
  subscription.resumeDate = new Date();

  await subscription.save();
  await sendSubscriptionStatusEmails(user, subscription, "active");
  return subscription;
};

const getMySubscription = async (userId: string) => {
  return await BoardRoomBanterSubscription.findOne({ userId }).sort({
    createdAt: -1,
  });
};

const updateWhatsappGroupStatus = async (id: string, status: boolean) => {
  return await BoardRoomBanterSubscription.findByIdAndUpdate(
    id,
    { isAddedToWhatsappGroup: status },
    { new: true }
  );
};

const suspendUser = async (userId: string) => {
  return await BoardRoomBanterSubscription.findByIdAndUpdate(
    userId,
    { isSuspended: true },
    { new: true }
  );
};

const withdrawSuspension = async (userId: string) => {
  return await BoardRoomBanterSubscription.findByIdAndUpdate(
    userId,
    { isSuspended: false },
    { new: true }
  );
};

const removeUser = async (userId: string) => {
  return await BoardRoomBanterSubscription.findByIdAndUpdate(
    userId,
    { isRemoved: true },
    { new: true }
  );
};

const reAddUser = async (userId: string) => {
  return await BoardRoomBanterSubscription.findByIdAndUpdate(
    userId,
    { isRemoved: false },
    { new: true }
  );
};

export const BoardRoomBanterSubscriptionService = {
  createSubscription,
  verifySubscription,
  pauseSubscription,
  resumeSubscription,
  getMySubscription,
  updateWhatsappGroupStatus,
  suspendUser,
  withdrawSuspension,
  removeUser,
  reAddUser,
};
