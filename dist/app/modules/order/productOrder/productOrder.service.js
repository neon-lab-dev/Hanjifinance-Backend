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
exports.ProductOrderService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const product_model_1 = __importDefault(require("../../admin/product/product.model"));
const productOrder_model_1 = require("./productOrder.model");
const razorpay_1 = require("../../../utils/razorpay");
const crypto_1 = __importDefault(require("crypto"));
const generateOrderId = () => {
    return "HFP-" + Math.floor(1000 + Math.random() * 9000);
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
    // Success
    return `${process.env.PAYMENT_REDIRECT_URL}/success?orderId=${razorpayOrderId}`;
});
// Create Razorpay order
const createProductOrder = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const productIds = payload.orderedItems.map((i) => i.productId);
    const products = yield product_model_1.default.find({ _id: { $in: productIds } });
    if (products.length !== payload.orderedItems.length) {
        throw new Error("Some products not found");
    }
    const orderId = generateOrderId();
    const payloadData = {
        orderId,
        userId: user === null || user === void 0 ? void 0 : user._id,
        userCustomId: user === null || user === void 0 ? void 0 : user.userId,
        orderedItems: payload.orderedItems,
        totalAmount: payload.totalAmount,
        status: "paid",
    };
    const order = yield productOrder_model_1.ProductOrder.create(payloadData);
    return order;
});
// Get all orders
const getAllProductOrders = (keyword_1, status_1, ...args_1) => __awaiter(void 0, [keyword_1, status_1, ...args_1], void 0, function* (keyword, status, page = 1, limit = 10) {
    const query = {};
    // Search filter
    if (keyword) {
        query.$or = [{ orderId: { $regex: keyword, $options: "i" } }];
    }
    // Status filter
    if (status && status !== "all") {
        query.status = { $regex: status, $options: "i" };
    }
    // Pagination
    const skip = (page - 1) * limit;
    const [orders, total] = yield Promise.all([
        productOrder_model_1.ProductOrder.find(query).skip(skip).limit(limit),
        productOrder_model_1.ProductOrder.countDocuments(query),
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
// Get single order by ID
const getSingleProductOrderById = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield productOrder_model_1.ProductOrder.findOne({ orderId });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    return result;
});
// Get all orders for a particular user
const getProductOrdersByUserId = (userCustomId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield productOrder_model_1.ProductOrder.find({ userCustomId });
    if (!result || result.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No orders found for this user");
    }
    return result;
});
// Get my orders (user)
const getMyProductOrders = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield productOrder_model_1.ProductOrder.find({ userId });
    return result;
});
// Get my orders (user)
const updateDeliveryStatus = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield productOrder_model_1.ProductOrder.findOneAndUpdate({ orderId: payload.orderId }, { status: payload.status }, { new: true });
    return result;
});
exports.ProductOrderService = {
    checkout,
    verifyPayment,
    createProductOrder,
    getAllProductOrders,
    getSingleProductOrderById,
    getProductOrdersByUserId,
    getMyProductOrders,
    updateDeliveryStatus,
};
