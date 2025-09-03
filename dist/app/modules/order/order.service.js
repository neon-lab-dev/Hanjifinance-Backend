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
exports.OrderService = exports.verifyPayment = exports.createOrder = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const order_model_1 = require("./order.model");
const razorpay_1 = require("../../utils/razorpay");
const product_model_1 = __importDefault(require("../admin/product/product.model"));
const generateOrderId = () => {
    return "HFP-" + Math.floor(1000 + Math.random() * 9000);
};
// Create Razorpay order
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const productIds = payload.orderedItems.map((i) => i.productId);
    const products = yield product_model_1.default.find({ _id: { $in: productIds } });
    if (products.length !== payload.orderedItems.length) {
        throw new Error("Some products not found");
    }
    const orderId = generateOrderId();
    // Creating Razorpay order
    const razorpayOrder = yield razorpay_1.razorpay.orders.create({
        amount: payload.totalAmount * 100, // in paisa
        currency: "INR",
    });
    const payloadData = {
        orderId,
        userId: payload.userId,
        items: payload.orderedItems,
        totalAmount: payload.totalAmount,
        status: "pending",
        razorpayOrderId: razorpayOrder.id,
    };
    const order = yield order_model_1.Order.create(payloadData);
    return { order };
});
exports.createOrder = createOrder;
// Verify payment
const verifyPayment = (razorpayPaymentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Just check if paymentId exists (you won’t be validating signature/orderId anymore)
    if (!razorpayPaymentId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid payment id");
    }
    const order = yield order_model_1.Order.findOneAndUpdate({ paymentId: razorpayPaymentId }, { status: "paid" }, { new: true });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found for this payment id");
    }
    return order;
});
exports.verifyPayment = verifyPayment;
exports.OrderService = {
    createOrder: exports.createOrder,
    verifyPayment: exports.verifyPayment,
};
