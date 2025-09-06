import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { razorpay } from "../../utils/razorpay";

const createPaymentOrder = async (amount: number) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: amount * 100, //in paisa
    currency: "INR",
  });

  return razorpayOrder;
};

// Verify payment
const verifyPayment = async (razorpayOrderId: string) => {
  if (!razorpayOrderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Razorpay order id");
  }

  return {
    redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}?razorpayOrderId=${razorpayOrderId}`,
  };
};

export const PaymentService = {
  createPaymentOrder,
  verifyPayment,
};
