/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
// import crypto from "crypto";
import AppError from "../../errors/AppError";
import ChatAndChill from "./chatAndChill.model";
import { razorpay } from "../../utils/razorpay";
import Availability from "../admin/availability/availability.model";
import { sendEmail } from "../../utils/sendEmail";

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
  // razorpayOrderId: string,
  razorpayPaymentId: string,
  // razorpaySignature: string
) => {
  // if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
  //   return `${process.env.PAYMENT_REDIRECT_URL}/failed`;
  // }

  // const generatedSignature = crypto
  //   .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
  //   .update(`${razorpayOrderId}|${razorpayPaymentId}`)
  //   .digest("hex");

  // if (generatedSignature !== razorpaySignature) {
  //   return `${process.env.PAYMENT_REDIRECT_URL}/failed`;
  // }

  // Mark booking as booked
  // await ChatAndChill.findOneAndUpdate(
  //   { razorpayOrderId },
  //   { status: "booked" },
  //   { new: true }
  // );

  return `${process.env.PAYMENT_REDIRECT_URL}-success?type=chatAndChill&orderId=${razorpayPaymentId}`;
};

// Book Chat & Chill
const bookChatAndChill = async (user: any, payload: any) => {
  const slot = await Availability.findOne({ date: payload.bookingDate });

  if (slot?.isBooked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Slot not available");
  }

  const booking = await ChatAndChill.create({
    title: payload.title || "Chat & Chill",
    user: user._id,
    userCustomId: user.userId,
    name: payload.name,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    topicsToDiscuss: payload.topicsToDiscuss || "",
    bookingDate: payload.bookingDate,
    status: "booked",
  });

  await Availability.findOneAndUpdate(
    { date: payload.bookingDate },
    { isBooked: true },
    { new: true }
  );

  // Format date nicely
  const meetingDate = new Date(payload.bookingDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const meetingSlot = "07:00 PM - 07:30 PM";

  // Confirmation email
  const subject = "Your Chat & Chill Booking is Confirmed - Hanjifinance";

  const htmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#c0392b; text-align:center;">Hanjifinance</h2>
      <p style="font-size:16px; color:#333;">Hello <strong>${payload.name}</strong>,</p>
      <p style="font-size:15px; color:#555;">
        Thank you for booking a <strong>Chat & Chill</strong> session with us. Your booking is confirmed and our admin will share the meeting link with you soon.
      </p>
      <p style="font-size:15px; color:#555;">
        <strong>Topic:</strong> ${payload.title || "Chat & Chill"} <br/>
        <strong>Date:</strong> ${meetingDate} <br/>
        <strong>Slot:</strong> ${meetingSlot} <br/>
        <strong>Status:</strong> Booked
      </p>
      <p style="font-size:15px; color:#555; margin-top:20px;">
        Note: You will receive the meeting link on your <strong>email</strong> as well as in your <strong>dashboard</strong>.
      </p>
      <p style="font-size:15px; color:#333; margin-top:30px;">Best regards,</p>
      <p style="font-size:16px; font-weight:bold; color:#c0392b;">The Hanjifinance Team</p>
    </div>
  </div>
  `;

  await sendEmail(payload.email, subject, htmlBody);

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
      { name: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { phoneNumber: { $regex: keyword, $options: "i" } },
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
const getMyBookings = async (
  userId: string,
  page = 1,
  limit = 10
) => {
  const query: any = { user:userId };

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    ChatAndChill.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    ChatAndChill.countDocuments(query),
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: orders,
  };
};

// Update booking status
const updateBookingStatus = async (
  bookingId: string,
  payload: {
    status: "cancelled" | "booked" | "scheduled" | "completed";
  }
) => {
  const { status } = payload;

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
const scheduleMeeting = async (bookingId: string, meetingLink: string) => {
  const booking = await ChatAndChill.findByIdAndUpdate(
    bookingId,
    { status: "scheduled", meetingLink },
    { new: true }
  ).populate<{ user: { name: string; email: string } }>("user");

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  // Format meeting date
  const meetingDate = booking.bookingDate
    ? new Date(booking.bookingDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not provided";

  const meetingSlot = "07:00 PM - 07:30 PM";

  const subject = "Your Meeting is Scheduled - Hanjifinance";

  const htmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#c0392b; text-align:center;">Hanjifinance</h2>
      <p style="font-size:16px; color:#333;">Hello <strong>${booking.user.name}</strong>,</p>
      <p style="font-size:15px; color:#555;">
        Your meeting has been successfully scheduled. Please find the details below:
      </p>
      <p style="font-size:15px; color:#555;">
        <strong>Topic:</strong> ${booking.title || "Chat & Chill"} <br/>
        <strong>Date:</strong> ${meetingDate} <br/>
        <strong>Slot:</strong> ${meetingSlot} <br/>
        <strong>Status:</strong> Scheduled
      </p>
      <div style="text-align:center; margin:30px 0;">
        <a href="${meetingLink}" target="_blank" style="background:#c0392b; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:16px; font-weight:bold;">
          Join Meeting
        </a>
      </div>
      <p style="font-size:14px; color:#777;">
        Please make sure to join on time. If you face any issues, kindly contact our support.
      </p>
      <p style="font-size:15px; color:#333; margin-top:30px;">Best regards,</p>
      <p style="font-size:16px; font-weight:bold; color:#c0392b;">The Hanjifinance Team</p>
    </div>
  </div>
  `;

  // Send email
  await sendEmail(booking.user.email, subject, htmlBody);

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
