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
    const booking = yield chatAndChill_model_1.default.create({
        title: payload.title || "Chat & Chill",
        user: user._id,
        userCustomId: user.userId,
        status: "booked"
    });
    return booking;
});
// Get all bookings (with pagination, filter by keyword + status)
const getAllBookings = (keyword, status, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
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
    return yield chatAndChill_model_1.default.find({ user: userId }).sort({ createdAt: -1 });
});
// Update booking status
const updateBookingStatus = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId, status } = payload;
    const booking = yield chatAndChill_model_1.default.findByIdAndUpdate(bookingId, { status }, { new: true });
    if (!booking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
    }
    return booking;
});
// Schedule a meeting
const scheduleMeeting = (bookingId, scheduledAt, meetingLink) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield chatAndChill_model_1.default.findByIdAndUpdate(bookingId, { scheduledAt, status: "scheduled", meetingLink }, { new: true });
    if (!booking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
    }
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
