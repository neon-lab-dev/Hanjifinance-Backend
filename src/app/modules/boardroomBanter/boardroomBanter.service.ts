/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { BoardRoomBanterSubscription } from "./boardroomBanter.model";
import { razorpay } from "../../utils/razorpay";
import config from "../../config";
import {
  sendCouponCodeEmail,
  sendSubscriptionEmails,
  sendSubscriptionStatusEmails,
} from "../../emailTemplates/sendPauseSubscriptionEmail";
import { User } from "../auth/auth.model";
import { TBoardRoomBanterSubscription } from "./boardroomBanter.interface";

const joinWaitlist = async (
  user: any,
  payload: TBoardRoomBanterSubscription
) => {
  const subscription = await BoardRoomBanterSubscription.create({
    ...payload,
    userId: user._id,
    status: "waitlist",
  });

  return subscription;
};

const sendCouponCode = async (payload: any) => {
  const user = await User.findOne({ email: payload?.email });
  const result = await BoardRoomBanterSubscription.findByIdAndUpdate(
    payload.subscriptionId,
    { status: "code sent" }
  );

  await sendCouponCodeEmail(user, payload?.couponCode);

  return result;
};

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
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create subscription"
    );
  }

  const userData = await User.findById(user?._id);

  // Convert timestamps safely
  const startDate = razorpaySubscription.start_at
    ? new Date(razorpaySubscription.start_at * 1000)
    : new Date();

  // If end_at is missing, calculate it manually
  let endDate = razorpaySubscription.end_at
    ? new Date(razorpaySubscription.end_at * 1000)
    : null;

  // Example: If your plan is monthly, calculate 1 month ahead
  if (!endDate && razorpaySubscription.plan_id === planId) {
    endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Adjust for plan duration
  }

  // upsert: update if exists, otherwise create new
  const subscription = await BoardRoomBanterSubscription.findOneAndUpdate(
    { userId: user?._id },
    {
      $set: {
        name: user?.name,
        email: user?.email,
        phoneNumber: userData?.phoneNumber,
        razorpaySubscriptionId: razorpaySubscription.id,
        status: "active",
        startDate,
        endDate,
      },
    },
    { upsert: true, new: true }
  );

  await sendSubscriptionEmails(user, subscription);

  return subscription;
};



const verifySubscription = async (razorpayPaymentId: string) => {
  return `${process.env.PAYMENT_REDIRECT_URL}-success?type=boardroomBanter&orderId=${razorpayPaymentId}`;
};

// Get all bookings (with pagination, filter by keyword + status)
const getAllSubscriptions = async (
  keyword: string,
  status: string,
  isAddedToWhatsappGroup?: string,
  isSuspended?: string,
  isRemoved?: string,
  page = 1,
  limit = 10
) => {
  const query: any = {};

  // Keyword search
  if (keyword) {
    query.$or = [{ userId: { $regex: keyword, $options: "i" } }];
  }

  // Status filter
  if (status) {
    query.status = status;
  }

  // Boolean filters
  if (isAddedToWhatsappGroup !== undefined) {
    query.isAddedToWhatsappGroup = isAddedToWhatsappGroup === "true";
  }

  if (isSuspended !== undefined) {
    query.isSuspended = isSuspended === "true";
  }

  if (isRemoved !== undefined) {
    query.isRemoved = isRemoved === "true";
  }

  // Pagination
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    BoardRoomBanterSubscription.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    BoardRoomBanterSubscription.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single booking
const getSingleSubscriptionById = async (id: string) => {
  const subscription = await BoardRoomBanterSubscription.findById(id);
  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
  }
  return subscription;
};

// Pause Subscription
const pauseSubscription = async (user: any) => {
  const subscription = await BoardRoomBanterSubscription.findOne({
    userId: user?._id,
    status: "active",
  });

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "No active subscription found to pause");
  }

  try {
    await razorpay.subscriptions.pause(subscription.razorpaySubscriptionId!, {
      pause_at: "now",
    });
  } catch (error: any) {
    console.error("Razorpay pause failed:", error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to pause subscription in Razorpay");
  }

  subscription.status = "paused";
  subscription.pauseDate = new Date();
  await subscription.save();

  await sendSubscriptionStatusEmails(user, subscription, "paused");
  return subscription;
};

// Resume Subscription
const resumeSubscription = async (user: any) => {
  const subscription = await BoardRoomBanterSubscription.findOne({
    userId: user?._id,
    status: "paused",
  });

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "No paused subscription found to resume");
  }

  try {
    await razorpay.subscriptions.resume(subscription.razorpaySubscriptionId!, {
      resume_at: "now",
    });
  } catch (error: any) {
    console.error("Razorpay resume failed:", error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to resume subscription in Razorpay");
  }

  subscription.status = "active";
  subscription.resumeDate = new Date();
  await subscription.save();

  await sendSubscriptionStatusEmails(user, subscription, "active");
  return subscription;
};

// Cancel Subscription
const cancelSubscription = async (user: any) => {
  const subscription = await BoardRoomBanterSubscription.findOne({
    userId: user?._id,
    status: { $in: ["active", "paused"] },
  });

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "No subscription found to cancel");
  }

  try {
    // Call Razorpay cancel API
    await razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId!);
  } catch (error: any) {
    console.error("Razorpay cancel failed:", error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to cancel subscription in Razorpay");
  }

  subscription.status = "cancelled";
  subscription.cancelDate = new Date();
  await subscription.save();

  await sendSubscriptionStatusEmails(user, subscription, "cancelled");
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
  joinWaitlist,
  sendCouponCode,
  createSubscription,
  verifySubscription,
  getAllSubscriptions,
  getSingleSubscriptionById,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  getMySubscription,
  updateWhatsappGroupStatus,
  suspendUser,
  withdrawSuspension,
  removeUser,
  reAddUser,
};
