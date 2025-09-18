import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FinancialAdvisoryService } from "./financialAdvisory.service";

// Checkout
const checkout = catchAsync(async (req, res) => {
  const { amount } = req.body;
  const razorpayOrder = await FinancialAdvisoryService.checkout(amount);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiated successfully",
    data: razorpayOrder,
  });
});

// Verify payment
const verifyPayment = catchAsync(async (req, res) => {
  const { razorpay_payment_id } = req.body;

  const redirectUrl =
    await FinancialAdvisoryService.verifyPayment(razorpay_payment_id);

  return res.redirect(redirectUrl);
});

// Book a Financial Advisory session
const bookFinancialAdvisory = catchAsync(async (req, res) => {
  const result = await FinancialAdvisoryService.bookFinancialAdvisory(
    req.user,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message:
      "Financial Advisory session booked successfully. Please wait for confirmation.",
    data: result,
  });
});

// Get all Financial Advisory bookings (Admin/Moderator)
const getAllFinancialAdvisories = catchAsync(async (req, res) => {
  const { keyword, page = "1", limit = "10" } = req.query;

  const result = await FinancialAdvisoryService.getAllFinancialAdvisories(
    keyword as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All financial advisory bookings fetched successfully",
    data: {
      advisories: result.data,
      pagination: result.meta,
    },
  });
});

// Get single Financial Advisory booking by ID
const getSingleFinancialAdvisory = catchAsync(async (req, res) => {
  const { advisoryId } = req.params;
  const result =
    await FinancialAdvisoryService.getSingleFinancialAdvisory(advisoryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Financial advisory booking fetched successfully",
    data: result,
  });
});

// Get logged-in user's Financial Advisory bookings
const getMyFinancialAdvisoryBookings = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { page = "1", limit = "5" } = req.query;

  const result = await FinancialAdvisoryService.getMyFinancialAdvisoryBookings(
    userId,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My financial advisory bookings fetched successfully",
    data: {
      advisories: result.data,
      pagination: result.meta,
    },
  });
});

export const FinancialAdvisoryControllers = {
  checkout,
  verifyPayment,
  bookFinancialAdvisory,
  getAllFinancialAdvisories,
  getSingleFinancialAdvisory,
  getMyFinancialAdvisoryBookings,
};
