// import httpStatus from "http-status";
// import AppError from "../../errors/AppError";
import { razorpay } from "../../utils/razorpay";
import crypto from "crypto";
import { User } from "../auth/auth.model";

const initiatePayment = async (amount: number) => {
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
const verifyPayment = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) => {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return {
      success: false,
      redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}/failed`,
    };
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return {
      success: false,
      redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}/failed`,
    };
  }


 const subscription = await User.findOneAndUpdate(
  { razorpayOrderId },
  {
    razorpayPaymentId,
    razorpaySignature,
    status: "active",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  },
  { new: true }
);


  if (!subscription) {
    return {
      success: false,
      redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}/failed`,
    };
  }

  return {
    success: true,
    redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}/success?orderIdId=${razorpayOrderId}`,
    subscription,
  };
};

export const PaymentService = {
  initiatePayment,
  verifyPayment,
};
