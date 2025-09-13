import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { BoardRoomBanterSubscriptionService } from "./boardroomBanter.service";

const joinWaitlist = catchAsync(async (req, res) => {
  const result = await BoardRoomBanterSubscriptionService.joinWaitlist(
    req.user, req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "We've received your request. We will contact you soon!",
    data: result,
  });
});

const sendCouponCode = catchAsync(async (req, res) => {
  const result = await BoardRoomBanterSubscriptionService.sendCouponCode(
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Coupon code sent!",
    data: result,
  });
});

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

// Get all subscriptions (Admin/Moderator)
const getAllSubscriptions = catchAsync(async (req, res) => {
  const {
    keyword,
    status,
    page = "1",
    limit = "10",
    isAddedToWhatsappGroup,
    isSuspended,
    isRemoved,
  } = req.query;

  const result = await BoardRoomBanterSubscriptionService.getAllSubscriptions(
    keyword as string,
    status as string,

    isAddedToWhatsappGroup as string,
    isSuspended as string,
    isRemoved as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All subscriptions fetched successfully",
    data: {
      subscriptions: result.data,
      pagination: result.meta,
    },
  });
});

// Get single subscription by ID
const getSingleSubscriptionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await BoardRoomBanterSubscriptionService.getSingleSubscriptionById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription fetched successfully",
    data: result,
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
  sendCouponCode,
  joinWaitlist,
  createSubscription,
  verifySubscription,
  getAllSubscriptions,
  getSingleSubscriptionById,
  pauseSubscription,
  resumeSubscription,
  getMySubscription,
  updateWhatsappGroupStatus,
  suspendUser,
  withdrawSuspension,
  removeUser,
  reAddUser,
};
