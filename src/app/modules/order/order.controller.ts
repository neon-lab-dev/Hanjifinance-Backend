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

// Verify payment (Razorpay callback)
const verifyPayment = catchAsync(async (req, res) => {
  const { razorpayOrderId } = req.body;

  const result = await OrderService.verifyPayment(razorpayOrderId);

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

// Get all orders (Admin/Moderator)
const getAllOrders = catchAsync(async (req, res) => {
  const { keyword, status, page = "1", limit = "10" } = req.query;

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

// Get single order by ID
const getSingleOrderById = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await OrderService.getSingleOrderById(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order fetched successfully",
    data: result,
  });
});

// Get all orders for a particular user
const getOrdersByUserId = catchAsync(async (req, res) => {
  const { userCustomId } = req.params;
  console.log(userCustomId);
  const result = await OrderService.getOrdersByUserId(userCustomId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders fetched successfully",
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  verifyPayment,
  getAllOrders,
  getSingleOrderById,
  getOrdersByUserId,
};
