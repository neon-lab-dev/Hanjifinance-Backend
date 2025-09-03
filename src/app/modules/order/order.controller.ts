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
};
