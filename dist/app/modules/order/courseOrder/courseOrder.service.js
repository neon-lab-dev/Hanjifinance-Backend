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
const auth_model_1 = require("../../auth/auth.model");
const activities_services_1 = require("../../activities/activities.services");
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
const verifyPayment = (razorpayPaymentId) => __awaiter(void 0, void 0, void 0, function* () {
    return `${process.env.PAYMENT_REDIRECT_URL}-success?type=course&orderId=${razorpayPaymentId}`;
});
// Create course order
const createCourseOrder = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.courseId || payload.courseId.length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "No courses provided");
    }
    const userData = yield auth_model_1.User.findById(user === null || user === void 0 ? void 0 : user._id);
    if (!userData)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    // Fetching all courses by ids
    const courses = yield course_model_1.default.find({ _id: { $in: payload.courseId } });
    if (!courses || courses.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Courses not found");
    }
    const orderId = generateOrderId();
    // Map courses to objects for DB
    const coursesData = courses.map((c) => ({
        courseId: c._id,
        courseTitle: c.title,
        coursePrice: c.discountedPrice,
    }));
    const orderData = {
        orderId,
        userId: user._id,
        userCustomId: user.userId,
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        courses: coursesData,
        totalAmount: payload.totalAmount,
        orderType: payload.orderType,
    };
    const order = yield courseOrder_model_1.CourseOrder.create(orderData);
    // Add activity for each course
    for (const course of coursesData) {
        yield activities_services_1.ActivityServices.addActivity({
            userId: user._id,
            title: `Purchased Course`,
            description: `You've purchased ${course.courseTitle} course for ₹${course.coursePrice}`,
        });
    }
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
        courseOrder_model_1.CourseOrder.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
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
const getMyCourseOrders = (userId_1, keyword_1, status_1, ...args_1) => __awaiter(void 0, [userId_1, keyword_1, status_1, ...args_1], void 0, function* (userId, keyword, status, page = 1, limit = 10) {
    const query = { userId };
    if (keyword) {
        query.$or = [{ orderId: { $regex: keyword, $options: "i" } }];
    }
    if (status && status !== "all") {
        query.status = { $regex: status, $options: "i" };
    }
    const skip = (page - 1) * limit;
    const [orders, total] = yield Promise.all([
        courseOrder_model_1.CourseOrder.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate("courseId", "imageUrl tagline subtitle"),
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
exports.CourseOrderService = {
    checkout,
    verifyPayment,
    createCourseOrder,
    getAllCourseOrders,
    getSingleCourseOrderById,
    getCourseOrdersByUserId,
    getMyCourseOrders,
};
