/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { razorpay } from "../../utils/razorpay";
import FinancialAdvisory from "./financialAdvisory.model";
import { User } from "../auth/auth.model";

// Checkout
const checkout = async (amount: number) => {
  const options = {
    amount: amount * 100, // paise
    currency: "INR",
  };

  const order = await razorpay.orders.create(options);
  return order;
};

// Verify payment
const verifyPayment = async (razorpayPaymentId: string) => {
  return `${process.env.PAYMENT_REDIRECT_URL}-success?type=chatAndChill&orderId=${razorpayPaymentId}`;
};

const bookFinancialAdvisory = async (user: any, payload: any) => {
  const userData = await User.findById(user?._id);
  const booking = await FinancialAdvisory.create({
    ...payload,
    user: user._id,
    name: payload.name,
    email: payload.email,
    phoneNumber: userData!.phoneNumber,
    age: payload.age,
    income: payload.income,
    liabilities: payload.liabilities,
    stockHoldings: payload.stockHoldings || 0,
    financialGoals: payload.financialGoals,
    financialGoalDate: payload.financialGoalDate,
    marketVolatilityComfortLevel: payload.marketVolatilityComfortLevel,
  });

  return booking;
};

// Get all financial advisory bookings (with pagination + keyword filter)
const getAllFinancialAdvisories = async (
  keyword: string,
  page: number,
  limit: number
) => {
  const query: any = {};

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { phoneNumber: { $regex: keyword, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    FinancialAdvisory.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    FinancialAdvisory.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single financial advisory booking by ID
const getSingleFinancialAdvisory = async (advisoryId: string) => {
  const booking = await FinancialAdvisory.findById(advisoryId);
  if (!booking) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Financial advisory booking not found"
    );
  }
  return booking;
};

// Get logged-in user's financial advisory bookings
const getMyFinancialAdvisoryBookings = async (
  userId: string,
  page = 1,
  limit = 10
) => {
  const query: any = { user: userId };

  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    FinancialAdvisory.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    FinancialAdvisory.countDocuments(query),
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: bookings,
  };
};

export const FinancialAdvisoryService = {
  checkout,
  verifyPayment,
  bookFinancialAdvisory,
  getAllFinancialAdvisories,
  getSingleFinancialAdvisory,
  getMyFinancialAdvisoryBookings,
};
