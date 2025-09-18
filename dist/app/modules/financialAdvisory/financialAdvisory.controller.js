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
exports.FinancialAdvisoryControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const financialAdvisory_service_1 = require("./financialAdvisory.service");
// Checkout
const checkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    const razorpayOrder = yield financialAdvisory_service_1.FinancialAdvisoryService.checkout(amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment initiated successfully",
        data: razorpayOrder,
    });
}));
// Verify payment
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_payment_id } = req.body;
    const redirectUrl = yield financialAdvisory_service_1.FinancialAdvisoryService.verifyPayment(razorpay_payment_id);
    return res.redirect(redirectUrl);
}));
// Book a Financial Advisory session
const bookFinancialAdvisory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield financialAdvisory_service_1.FinancialAdvisoryService.bookFinancialAdvisory(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Financial Advisory session booked successfully. Please wait for confirmation.",
        data: result,
    });
}));
// Get all Financial Advisory bookings (Admin/Moderator)
const getAllFinancialAdvisories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, page = "1", limit = "10" } = req.query;
    const result = yield financialAdvisory_service_1.FinancialAdvisoryService.getAllFinancialAdvisories(keyword, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All financial advisory bookings fetched successfully",
        data: {
            advisories: result.data,
            pagination: result.meta,
        },
    });
}));
// Get single Financial Advisory booking by ID
const getSingleFinancialAdvisory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { advisoryId } = req.params;
    const result = yield financialAdvisory_service_1.FinancialAdvisoryService.getSingleFinancialAdvisory(advisoryId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Financial advisory booking fetched successfully",
        data: result,
    });
}));
// Get logged-in user's Financial Advisory bookings
const getMyFinancialAdvisoryBookings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { page = "1", limit = "5" } = req.query;
    const result = yield financialAdvisory_service_1.FinancialAdvisoryService.getMyFinancialAdvisoryBookings(userId, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My financial advisory bookings fetched successfully",
        data: {
            advisories: result.data,
            pagination: result.meta,
        },
    });
}));
exports.FinancialAdvisoryControllers = {
    checkout,
    verifyPayment,
    bookFinancialAdvisory,
    getAllFinancialAdvisories,
    getSingleFinancialAdvisory,
    getMyFinancialAdvisoryBookings,
};
