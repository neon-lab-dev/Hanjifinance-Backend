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
exports.ChatAndChillControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const chatAndChill_service_1 = require("./chatAndChill.service");
// Checkout
const checkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    const razorpayOrder = yield chatAndChill_service_1.ChatAndChillService.checkout(amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment initiated successfully",
        data: razorpayOrder,
    });
}));
// Verify payment
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const redirectUrl = yield chatAndChill_service_1.ChatAndChillService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    return res.redirect(redirectUrl);
}));
// Book a Chat & Chill session
const bookChatAndChill = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield chatAndChill_service_1.ChatAndChillService.bookChatAndChill(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Chat & Chill booked successfully. Please wait for admin to schedule a meeting.",
        data: result,
    });
}));
// Get all bookings (Admin/Moderator)
const getAllBookings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, status, page = "1", limit = "10" } = req.query;
    const result = yield chatAndChill_service_1.ChatAndChillService.getAllBookings(keyword, status, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All bookings fetched successfully",
        data: {
            bookings: result.data,
            pagination: result.meta,
        },
    });
}));
// Get single booking by ID
const getSingleBookingById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId } = req.params;
    const result = yield chatAndChill_service_1.ChatAndChillService.getSingleBookingById(bookingId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Booking fetched successfully",
        data: result,
    });
}));
// Get all bookings for a particular user
const getBookingsByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userCustomId } = req.params;
    const result = yield chatAndChill_service_1.ChatAndChillService.getBookingsByUserId(userCustomId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Bookings fetched successfully",
        data: result,
    });
}));
// Get logged-in user's bookings (user)
const getMyBookings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield chatAndChill_service_1.ChatAndChillService.getMyBookings(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My bookings fetched successfully",
        data: result,
    });
}));
// Update booking status (pending, booked, scheduled)
const updateBookingStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield chatAndChill_service_1.ChatAndChillService.updateBookingStatus(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Booking status updated successfully",
        data: result,
    });
}));
// Schedule a meeting (update scheduledAt + mark as scheduled)
const scheduleMeeting = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId, meetingLink } = req.body;
    const result = yield chatAndChill_service_1.ChatAndChillService.scheduleMeeting(bookingId, meetingLink);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Meeting scheduled successfully",
        data: result,
    });
}));
exports.ChatAndChillControllers = {
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
