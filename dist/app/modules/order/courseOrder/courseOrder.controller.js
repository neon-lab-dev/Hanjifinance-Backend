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
exports.CourseOrderControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const courseOrder_service_1 = require("./courseOrder.service");
const checkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    const razorpayOrder = yield courseOrder_service_1.CourseOrderService.checkout(amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment initiated successfully",
        data: razorpayOrder,
    });
}));
// Verify payment (Razorpay callback)
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const redirectUrl = yield courseOrder_service_1.CourseOrderService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    return res.redirect(redirectUrl);
}));
// Create order (customer)
const createCourseOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseOrder_service_1.CourseOrderService.createCourseOrder(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course order created successfully",
        data: result,
    });
}));
// Get all course orders (Admin/Moderator)
const getAllCourseOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, page = "1", limit = "10" } = req.query;
    const result = yield courseOrder_service_1.CourseOrderService.getAllCourseOrders(keyword, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All course orders fetched successfully",
        data: {
            orders: result.data,
            pagination: result.meta,
        },
    });
}));
// Get single course order by ID
const getSingleCourseOrderById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield courseOrder_service_1.CourseOrderService.getSingleCourseOrderById(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course order fetched successfully",
        data: result,
    });
}));
// Get all orders for a particular user (by userCustomId)
const getCourseOrdersByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userCustomId } = req.params;
    const result = yield courseOrder_service_1.CourseOrderService.getCourseOrdersByUserId(userCustomId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User's course orders fetched successfully",
        data: result,
    });
}));
// Get logged-in user's orders
const getMyCourseOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield courseOrder_service_1.CourseOrderService.getMyCourseOrders(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My course orders fetched successfully",
        data: result,
    });
}));
exports.CourseOrderControllers = {
    checkout,
    verifyPayment,
    createCourseOrder,
    getAllCourseOrders,
    getSingleCourseOrderById,
    getCourseOrdersByUserId,
    getMyCourseOrders,
};
