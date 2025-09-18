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
exports.FinancialAdvisoryService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const razorpay_1 = require("../../utils/razorpay");
const financialAdvisory_model_1 = __importDefault(require("./financialAdvisory.model"));
const auth_model_1 = require("../auth/auth.model");
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
const verifyPayment = (razorpayPaymentId) => __awaiter(void 0, void 0, void 0, function* () {
    return `${process.env.PAYMENT_REDIRECT_URL}-success?type=chatAndChill&orderId=${razorpayPaymentId}`;
});
const bookFinancialAdvisory = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield auth_model_1.User.findById(user === null || user === void 0 ? void 0 : user._id);
    const booking = yield financialAdvisory_model_1.default.create(Object.assign(Object.assign({}, payload), { user: user._id, name: payload.name, email: payload.email, phoneNumber: userData.phoneNumber, age: payload.age, income: payload.income, liabilities: payload.liabilities, stockHoldings: payload.stockHoldings || 0, financialGoals: payload.financialGoals, financialGoalDate: payload.financialGoalDate, marketVolatilityComfortLevel: payload.marketVolatilityComfortLevel }));
    return booking;
});
// Get all financial advisory bookings (with pagination + keyword filter)
const getAllFinancialAdvisories = (keyword, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (keyword) {
        query.$or = [
            { name: { $regex: keyword, $options: "i" } },
            { email: { $regex: keyword, $options: "i" } },
            { phoneNumber: { $regex: keyword, $options: "i" } },
        ];
    }
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        financialAdvisory_model_1.default.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        financialAdvisory_model_1.default.countDocuments(query),
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
// Get single financial advisory booking by ID
const getSingleFinancialAdvisory = (advisoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield financialAdvisory_model_1.default.findById(advisoryId);
    if (!booking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Financial advisory booking not found");
    }
    return booking;
});
// Get logged-in user's financial advisory bookings
const getMyFinancialAdvisoryBookings = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 10) {
    const query = { user: userId };
    const skip = (page - 1) * limit;
    const [bookings, total] = yield Promise.all([
        financialAdvisory_model_1.default.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        financialAdvisory_model_1.default.countDocuments(query),
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
});
exports.FinancialAdvisoryService = {
    checkout,
    verifyPayment,
    bookFinancialAdvisory,
    getAllFinancialAdvisories,
    getSingleFinancialAdvisory,
    getMyFinancialAdvisoryBookings,
};
