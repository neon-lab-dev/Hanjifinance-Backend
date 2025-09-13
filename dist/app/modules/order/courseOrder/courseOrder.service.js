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
exports.CourseOrderService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const courseOrder_model_1 = require("./courseOrder.model");
const razorpay_1 = require("../../../utils/razorpay");
const crypto_1 = __importDefault(require("crypto"));
const auth_model_1 = require("../../auth/auth.model");
const course_model_1 = __importDefault(require("../../admin/course/course.model"));
const generateOrderId = () => {
    return "HFCO-" + Math.floor(1000 + Math.random() * 9000);
};
const checkout = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (!amount || amount <= 0) {
        throw new Error("Invalid payment amount");
    }
    const razorpayOrder = yield razorpay_1.razorpay.orders.create({
        amount: amount * 100, //in paisa
        currency: "INR",
    });
    return razorpayOrder;
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
    return `${process.env.PAYMENT_REDIRECT_URL}/success?orderId=${razorpayOrderId}`;
});
// Create course order
const createCourseOrder = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = generateOrderId();
    const userData = yield auth_model_1.User.findById(user === null || user === void 0 ? void 0 : user._id);
    const courseData = yield course_model_1.default.findById(payload.courseId);
    const payloadData = {
        orderId,
        userId: user === null || user === void 0 ? void 0 : user._id,
        name: userData === null || userData === void 0 ? void 0 : userData.name,
        email: userData === null || userData === void 0 ? void 0 : userData.email,
        phoneNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
        userCustomId: user === null || user === void 0 ? void 0 : user.userId,
        courseId: payload.courseId,
        courseTitle: courseData === null || courseData === void 0 ? void 0 : courseData.title,
        coursePrice: courseData === null || courseData === void 0 ? void 0 : courseData.discountedPrice,
        totalAmount: payload.totalAmount,
    };
    const order = yield courseOrder_model_1.CourseOrder.create(payloadData);
    return order;
});
// Get all course orders (Admin/Moderator)
const getAllCourseOrders = (keyword_1, ...args_1) => __awaiter(void 0, [keyword_1, ...args_1], void 0, function* (keyword, page = 1, limit = 10) {
    const query = {};
    if (keyword) {
        const regex = { $regex: keyword, $options: "i" };
        query.$or = [
            { orderId: regex },
            { name: regex },
            { email: regex },
            { phoneNumber: regex },
        ];
    }
    const skip = (page - 1) * limit;
    const [orders, total] = yield Promise.all([
        courseOrder_model_1.CourseOrder.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        courseOrder_model_1.CourseOrder.countDocuments(query),
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
});
// Get single course
const getSingleCourseOrderById = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseOrder_model_1.CourseOrder.findOne({ orderId });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Course order not found");
    }
    return result;
});
// Get all course orders for a particular user
const getCourseOrdersByUserId = (userCustomId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseOrder_model_1.CourseOrder.find({ userCustomId });
    if (!result || result.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No course orders found for this user");
    }
    return result;
});
// Get my course orders (logged-in user)
const getMyCourseOrders = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseOrder_model_1.CourseOrder.find({ userId });
    return result;
});
exports.CourseOrderService = {
    checkout,
    verifyPayment,
    createCourseOrder,
    getAllCourseOrders,
    getSingleCourseOrderById,
    getCourseOrdersByUserId,
    getMyCourseOrders,
};
