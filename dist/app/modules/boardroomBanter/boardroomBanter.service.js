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
exports.BoardRoomBanterSubscriptionService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const boardroomBanter_model_1 = require("./boardroomBanter.model");
const razorpay_1 = require("../../utils/razorpay");
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../../config"));
const sendPauseSubscriptionEmail_1 = require("../../emailTemplates/sendPauseSubscriptionEmail");
const createSubscription = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const planId = config_1.default.boardroom_banter_plan_id;
    if (!planId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Razorpay planId not configured");
    }
    let razorpaySubscription;
    try {
        razorpaySubscription = yield razorpay_1.razorpay.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            total_count: 1,
            quantity: 1,
        });
    }
    catch (error) {
        console.error("Razorpay subscription creation failed:", error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create subscription");
    }
    const subscription = yield boardroomBanter_model_1.BoardRoomBanterSubscription.create({
        userId: user === null || user === void 0 ? void 0 : user._id,
        razorpaySubscriptionId: razorpaySubscription.id,
        status: "pending", // pending until payment verified
    });
    yield (0, sendPauseSubscriptionEmail_1.sendSubscriptionEmails)(user, subscription);
    return subscription;
});
const verifySubscription = (razorpaySubscriptionId, razorpayPaymentId, razorpaySignature) => __awaiter(void 0, void 0, void 0, function* () {
    if (!razorpaySubscriptionId || !razorpayPaymentId || !razorpaySignature) {
        return {
            success: false,
            redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}/failed`,
        };
    }
    const generatedSignature = crypto_1.default
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(`${razorpaySubscriptionId}|${razorpayPaymentId}`)
        .digest("hex");
    if (generatedSignature !== razorpaySignature) {
        return {
            success: false,
            redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}/failed`,
        };
    }
    const subscription = yield boardroomBanter_model_1.BoardRoomBanterSubscription.findOneAndUpdate({ razorpaySubscriptionId }, {
        razorpayPaymentId,
        razorpaySignature,
        status: "active",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    }, { new: true });
    if (!subscription) {
        return {
            success: false,
            redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}/failed`,
        };
    }
    return {
        success: true,
        redirectUrl: `${process.env.PAYMENT_REDIRECT_URL}/success?subscriptionId=${razorpaySubscriptionId}`,
        subscription,
    };
});
const pauseSubscription = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield boardroomBanter_model_1.BoardRoomBanterSubscription.findOne({
        userId: user === null || user === void 0 ? void 0 : user._id,
        status: "active",
    });
    if (!subscription) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No active subscription found to pause");
    }
    subscription.status = "paused";
    subscription.pauseDate = new Date();
    yield subscription.save();
    yield (0, sendPauseSubscriptionEmail_1.sendSubscriptionStatusEmails)(user, subscription, "paused");
    return subscription;
});
const resumeSubscription = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield boardroomBanter_model_1.BoardRoomBanterSubscription.findOne({
        userId: user === null || user === void 0 ? void 0 : user._id,
        status: "paused",
    });
    if (!subscription) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No paused subscription found to resume");
    }
    subscription.status = "active";
    subscription.resumeDate = new Date();
    yield subscription.save();
    yield (0, sendPauseSubscriptionEmail_1.sendSubscriptionStatusEmails)(user, subscription, "active");
    return subscription;
});
const getMySubscription = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield boardroomBanter_model_1.BoardRoomBanterSubscription.findOne({ userId }).sort({
        createdAt: -1,
    });
});
const updateWhatsappGroupStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield boardroomBanter_model_1.BoardRoomBanterSubscription.findByIdAndUpdate(id, { isAddedToWhatsappGroup: status }, { new: true });
});
const suspendUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield boardroomBanter_model_1.BoardRoomBanterSubscription.findByIdAndUpdate(userId, { isSuspended: true }, { new: true });
});
const withdrawSuspension = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield boardroomBanter_model_1.BoardRoomBanterSubscription.findByIdAndUpdate(userId, { isSuspended: false }, { new: true });
});
const removeUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield boardroomBanter_model_1.BoardRoomBanterSubscription.findByIdAndUpdate(userId, { isRemoved: true }, { new: true });
});
const reAddUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield boardroomBanter_model_1.BoardRoomBanterSubscription.findByIdAndUpdate(userId, { isRemoved: false }, { new: true });
});
exports.BoardRoomBanterSubscriptionService = {
    createSubscription,
    verifySubscription,
    pauseSubscription,
    resumeSubscription,
    getMySubscription,
    updateWhatsappGroupStatus,
    suspendUser,
    withdrawSuspension,
    removeUser,
    reAddUser,
};
