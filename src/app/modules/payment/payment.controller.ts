import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const initiatePayment = catchAsync(async (req, res) => {
  const { amount } = req.body;

  const razorpayOrder = await PaymentService.createPaymentOrder(amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiated successfully",
    data: razorpayOrder,
  });
});


// Verify payment (Razorpay callback)
 const verifyPayment = catchAsync(async (req, res) => {
  const { razorpayOrderId } = req.body;

  const result = await PaymentService.verifyPayment(razorpayOrderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment verified successfully",
    data: result,
  });
});

export const PaymentController = {
  initiatePayment,
  verifyPayment,
};