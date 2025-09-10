import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { CourseOrderService } from "./courseOrder.service";

const checkout = catchAsync(async (req, res) => {
  const { amount } = req.body;
  const razorpayOrder = await CourseOrderService.checkout(amount);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiated successfully",
    data: razorpayOrder,
  });
});

// Verify payment (Razorpay callback)
const verifyPayment = catchAsync(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const redirectUrl = await CourseOrderService.verifyPayment(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  return res.redirect(redirectUrl);
});
// Create order (customer)
const createCourseOrder = catchAsync(async (req, res) => {
  const result = await CourseOrderService.createCourseOrder(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course order created successfully",
    data: result,
  });
});

// Get all course orders (Admin/Moderator)
const getAllCourseOrders = catchAsync(async (req, res) => {
  const { keyword, page = "1", limit = "10" } = req.query;

  const result = await CourseOrderService.getAllCourseOrders(
    keyword as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All course orders fetched successfully",
    data: {
      orders: result.data,
      pagination: result.meta,
    },
  });
});

// Get single course order by ID
const getSingleCourseOrderById = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await CourseOrderService.getSingleCourseOrderById(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course order fetched successfully",
    data: result,
  });
});

// Get all orders for a particular user (by userCustomId)
const getCourseOrdersByUserId = catchAsync(async (req, res) => {
  const { userCustomId } = req.params;
  const result = await CourseOrderService.getCourseOrdersByUserId(userCustomId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User's course orders fetched successfully",
    data: result,
  });
});

// Get logged-in user's orders
const getMyCourseOrders = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await CourseOrderService.getMyCourseOrders(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My course orders fetched successfully",
    data: result,
  });
});

export const CourseOrderControllers = {
  checkout,
  verifyPayment,
  createCourseOrder,
  getAllCourseOrders,
  getSingleCourseOrderById,
  getCourseOrdersByUserId,
  getMyCourseOrders,
};