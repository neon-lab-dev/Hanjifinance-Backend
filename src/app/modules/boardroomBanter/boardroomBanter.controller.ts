import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { BoardRoomBanterSubscriptionService } from "./boardroomBanter.service";

const createSubscription = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result =
    await BoardRoomBanterSubscriptionService.createSubscription(userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "BoardRoomBanter subscription created successfully",
    data: result,
  });
});

const verifySubscription = catchAsync(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const result = await BoardRoomBanterSubscriptionService.verifySubscription(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment verified successfully",
    data: {
      redirectUrl: result.redirectUrl,
      subscription: result.subscription,
    },
  });
});

const pauseSubscription = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result =
    await BoardRoomBanterSubscriptionService.pauseSubscription(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "BoardRoomBanter subscription paused successfully",
    data: result,
  });
});

const resumeSubscription = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result =
    await BoardRoomBanterSubscriptionService.resumeSubscription(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "BoardRoomBanter subscription resumed successfully",
    data: result,
  });
});

const getMySubscription = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result =
    await BoardRoomBanterSubscriptionService.getMySubscription(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched my BoardRoomBanter subscription successfully",
    data: result,
  });
});

export const BoardRoomBanterSubscriptionController = {
  createSubscription,
  verifySubscription,
  pauseSubscription,
  resumeSubscription,
  getMySubscription,
};
