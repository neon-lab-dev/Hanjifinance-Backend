import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";

// Create order (customer)
const createOrder = catchAsync(async (req, res) => {
  const result = await OrderService.createOrder(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

// Get all orders (Admin/Moderator)
// Get all products
const getAllOrders = catchAsync(async (req, res) => {
  const {
    keyword,
    status,
    page = "1",
    limit = "10",
  } = req.query;

  const result = await OrderService.getAllOrders(
    keyword as string,
    status as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Orders fetched successfully",
    data: {
      products: result.data,
      pagination: result.meta,
    },
  });
});


// Verify payment (Razorpay callback)
const verifyPayment = catchAsync(async (req, res) => {
  const { razorpayOrderId } = req.body;

  const result = await OrderService.verifyPayment(
    razorpayOrderId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment verified successfully",
    data: {
      order: result,
      redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}?orderId=${result?.orderId}`,
    },
  });
});

export const OrderControllers = {
  createOrder,
  verifyPayment,
  getAllOrders,
};
