/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import crypto from "crypto";
import AppError from "../../errors/AppError";
import ChatAndChill from "./chatAndChill.model";
import { razorpay } from "../../utils/razorpay";

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
const verifyPayment = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) => {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return `${process.env.PAYMENT_REDIRECT_URL}/failed`;
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return `${process.env.PAYMENT_REDIRECT_URL}/failed`;
  }

  // Mark booking as booked
  await ChatAndChill.findOneAndUpdate(
    { razorpayOrderId },
    { status: "booked" },
    { new: true }
  );

  return `${process.env.PAYMENT_REDIRECT_URL}/success?orderId=${razorpayOrderId}`;
};

// Book Chat & Chill
const bookChatAndChill = async (user: any, payload: any) => {
  const booking = await ChatAndChill.create({
    title: payload.title || "Chat & Chill",
    user: user._id,
    userCustomId: user.userId,
    status: "booked"
  });

  return booking;
};

// Get all bookings (with pagination, filter by keyword + status)
const getAllBookings = async (
  keyword: string,
  status: string,
  page: number,
  limit: number
) => {
  const query: any = {};

  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    ChatAndChill.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    ChatAndChill.countDocuments(query),
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

// Get single booking
const getSingleBookingById = async (bookingId: string) => {
  const booking = await ChatAndChill.findById(bookingId);
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }
  return booking;
};

// Get bookings by user ID (admin/moderator)
const getBookingsByUserId = async (userCustomId: string) => {
  return await ChatAndChill.find({ userCustomId }).sort({ createdAt: -1 });
};

// Get logged-in user's bookings
const getMyBookings = async (userId: string) => {
  return await ChatAndChill.find({ user: userId }).sort({ createdAt: -1 });
};

// Update booking status
const updateBookingStatus = async (payload: {
  bookingId: string;
  status: "pending" | "booked" | "scheduled";
}) => {
  const { bookingId, status } = payload;

  const booking = await ChatAndChill.findByIdAndUpdate(
    bookingId,
    { status },
    { new: true }
  );

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  return booking;
};

// Schedule a meeting
const scheduleMeeting = async (bookingId: string, scheduledAt: Date, meetingLink:string) => {
  const booking = await ChatAndChill.findByIdAndUpdate(
    bookingId,
    { scheduledAt, status: "scheduled", meetingLink },
    { new: true }
  );

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  return booking;
};

export const ChatAndChillService = {
  checkout,
  verifyPayment,
  bookChatAndChill,
  getAllBookings,
  getSingleBookingById,
  getBookingsByUserId,
  getMyBookings,
  updateBookingStatus,
  scheduleMeeting,
};
