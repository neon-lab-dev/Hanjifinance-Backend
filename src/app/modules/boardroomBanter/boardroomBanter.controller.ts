import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { BoardRoomBanterSubscriptionService } from "./boardroomBanter.service";

const createSubscription = catchAsync(async (req, res) => {
  const result = await BoardRoomBanterSubscriptionService.createSubscription(
    req.user
  );

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
  const result = await BoardRoomBanterSubscriptionService.pauseSubscription(
    req.user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "BoardRoomBanter subscription paused successfully",
    data: result,
  });
});

const resumeSubscription = catchAsync(async (req, res) => {
  const result = await BoardRoomBanterSubscriptionService.resumeSubscription(
    req.user
  );

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

const updateWhatsappGroupStatus = catchAsync(async (req, res) => {
  const { isAddedToWhatsappGroup, userId } = req.body;

  const result =
    await BoardRoomBanterSubscriptionService.updateWhatsappGroupStatus(
      userId,
      isAddedToWhatsappGroup
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "WhatsApp group status updated",
    data: result,
  });
});

const suspendUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await BoardRoomBanterSubscriptionService.suspendUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User suspended successfully",
    data: result,
  });
});

const withdrawSuspension = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result =
    await BoardRoomBanterSubscriptionService.withdrawSuspension(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User suspension withdrawn",
    data: result,
  });
});

const removeUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await BoardRoomBanterSubscriptionService.removeUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User removed successfully (soft delete)",
    data: result,
  });
});

const reAddUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await BoardRoomBanterSubscriptionService.reAddUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User re-added successfully",
    data: result,
  });
});

export const BoardRoomBanterSubscriptionController = {
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
