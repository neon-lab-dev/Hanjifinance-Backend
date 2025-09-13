"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatAndChillService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const crypto_1 = __importDefault(require("crypto"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const chatAndChill_model_1 = __importDefault(require("./chatAndChill.model"));
const razorpay_1 = require("../../utils/razorpay");
const availability_model_1 = __importDefault(require("../admin/availability/availability.model"));
const sendEmail_1 = require("../../utils/sendEmail");
// Checkout
const checkout = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        amount: amount * 100, // paise
        currency: "INR",
    };
    const order = yield razorpay_1.razorpay.orders.create(options);
    return order;
});
// Verify payment
const verifyPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => __awaiter(void 0, void 0, void 0, function* () {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return `${process.env.PAYMENT_REDIRECT_URL}/failed`;
    }
    const generatedSignature = crypto_1.default
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");
    if (generatedSignature !== razorpaySignature) {
        return `${process.env.PAYMENT_REDIRECT_URL}/failed`;
    }
    // Mark booking as booked
    yield chatAndChill_model_1.default.findOneAndUpdate({ razorpayOrderId }, { status: "booked" }, { new: true });
    return `${process.env.PAYMENT_REDIRECT_URL}/success?orderId=${razorpayOrderId}`;
});
// Book Chat & Chill
const bookChatAndChill = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const slot = yield availability_model_1.default.findOne({ date: payload.bookingDate });
    if (slot === null || slot === void 0 ? void 0 : slot.isBooked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slot not available");
    }
    const booking = yield chatAndChill_model_1.default.create({
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
    yield availability_model_1.default.findOneAndUpdate({ date: payload.bookingDate }, { isBooked: true }, { new: true });
    // Format date nicely
    const meetingDate = new Date(payload.bookingDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
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
    yield (0, sendEmail_1.sendEmail)(payload.email, subject, htmlBody);
    return booking;
});
// Get all bookings (with pagination, filter by keyword + status)
const getAllBookings = (keyword, status, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
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
    const [data, total] = yield Promise.all([
        chatAndChill_model_1.default.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        chatAndChill_model_1.default.countDocuments(query),
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
});
// Get single booking
const getSingleBookingById = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield chatAndChill_model_1.default.findById(bookingId);
    if (!booking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
    }
    return booking;
});
// Get bookings by user ID (admin/moderator)
const getBookingsByUserId = (userCustomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield chatAndChill_model_1.default.find({ userCustomId }).sort({ createdAt: -1 });
});
// Get logged-in user's bookings
const getMyBookings = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId);
    return yield chatAndChill_model_1.default.find({ user: userId }).sort({ createdAt: -1 });
});
// Update booking status
const updateBookingStatus = (bookingId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = payload;
    const booking = yield chatAndChill_model_1.default.findByIdAndUpdate(bookingId, { status }, { new: true });
    if (!booking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
    }
    return booking;
});
// Schedule a meeting
const scheduleMeeting = (bookingId, meetingLink) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield chatAndChill_model_1.default.findByIdAndUpdate(bookingId, { status: "scheduled", meetingLink }, { new: true }).populate("user");
    if (!booking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
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
    yield (0, sendEmail_1.sendEmail)(booking.user.email, subject, htmlBody);
    return booking;
});
exports.ChatAndChillService = {
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
