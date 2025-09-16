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
const config_1 = __importDefault(require("../../config"));
const sendPauseSubscriptionEmail_1 = require("../../emailTemplates/sendPauseSubscriptionEmail");
const auth_model_1 = require("../auth/auth.model");
const couponCode_model_1 = __importDefault(require("../admin/couponCode/couponCode.model"));
const activities_services_1 = require("../activities/activities.services");
const joinWaitlist = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield boardroomBanter_model_1.BoardRoomBanterSubscription.create(Object.assign(Object.assign({}, payload), { userId: user._id, status: "waitlist" }));
    return subscription;
});
const sendCouponCode = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const couponCode = yield couponCode_model_1.default.findOne({ code: payload === null || payload === void 0 ? void 0 : payload.couponCode });
    if (!couponCode)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid coupon code");
    const user = yield auth_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    const result = yield boardroomBanter_model_1.BoardRoomBanterSubscription.findByIdAndUpdate(payload.subscriptionId, { status: "code sent" });
    yield (0, sendPauseSubscriptionEmail_1.sendCouponCodeEmail)(user, payload === null || payload === void 0 ? void 0 : payload.couponCode);
    return result;
});
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
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create subscription");
    }
    const userData = yield auth_model_1.User.findById(user === null || user === void 0 ? void 0 : user._id);
    // Convert timestamps safely
    const startDate = razorpaySubscription.start_at
        ? new Date(razorpaySubscription.start_at * 1000)
        : new Date();
    // If end_at is missing, calculate it manually
    let endDate = razorpaySubscription.end_at
        ? new Date(razorpaySubscription.end_at * 1000)
        : null;
    // Example: If your plan is monthly, calculate 1 month ahead
    if (!endDate && razorpaySubscription.plan_id === planId) {
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1); // Adjust for plan duration
    }
    // upsert: update if exists, otherwise create new
    const subscription = yield boardroomBanter_model_1.BoardRoomBanterSubscription.findOneAndUpdate({ userId: user === null || user === void 0 ? void 0 : user._id }, {
        $set: {
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            phoneNumber: userData === null || userData === void 0 ? void 0 : userData.phoneNumber,
            razorpaySubscriptionId: razorpaySubscription.id,
            status: "active",
            startDate,
            endDate,
        },
    }, { upsert: true, new: true });
    yield (0, sendPauseSubscriptionEmail_1.sendSubscriptionEmails)(user, subscription);
    const activityPayload = {
        userId: user === null || user === void 0 ? void 0 : user._id,
        title: `Purchased Premium Chat Subscription `,
        description: `You've purchased Premium Chat Subscription for ₹999/month`,
    };
    const createActivity = activities_services_1.ActivityServices.addActivity(activityPayload);
    if (!createActivity) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to add activity");
    }
    return subscription;
});
const verifySubscription = (razorpayPaymentId) => __awaiter(void 0, void 0, void 0, function* () {
    return `${process.env.PAYMENT_REDIRECT_URL}-success?type=boardroomBanter&orderId=${razorpayPaymentId}`;
});
// Get all bookings (with pagination, filter by keyword + status)
const getAllSubscriptions = (keyword_1, status_1, isAddedToWhatsappGroup_1, isSuspended_1, isRemoved_1, ...args_1) => __awaiter(void 0, [keyword_1, status_1, isAddedToWhatsappGroup_1, isSuspended_1, isRemoved_1, ...args_1], void 0, function* (keyword, status, isAddedToWhatsappGroup, isSuspended, isRemoved, page = 1, limit = 10) {
    const query = {};
    // Keyword search
    if (keyword) {
        query.$or = [{ userId: { $regex: keyword, $options: "i" } }];
    }
    // Status filter
    if (status) {
        query.status = status;
    }
    // Boolean filters
    if (isAddedToWhatsappGroup !== undefined) {
        query.isAddedToWhatsappGroup = isAddedToWhatsappGroup === "true";
    }
    if (isSuspended !== undefined) {
        query.isSuspended = isSuspended === "true";
    }
    if (isRemoved !== undefined) {
        query.isRemoved = isRemoved === "true";
    }
    // Pagination
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        boardroomBanter_model_1.BoardRoomBanterSubscription.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        boardroomBanter_model_1.BoardRoomBanterSubscription.countDocuments(query),
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
const getSingleSubscriptionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield boardroomBanter_model_1.BoardRoomBanterSubscription.findById(id);
    if (!subscription) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Subscription not found");
    }
    return subscription;
});
// Pause Subscription
const pauseSubscription = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield boardroomBanter_model_1.BoardRoomBanterSubscription.findOne({
        userId: user === null || user === void 0 ? void 0 : user._id,
        status: "active",
    });
    if (!subscription) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No active subscription found to pause");
    }
    if ((subscription === null || subscription === void 0 ? void 0 : subscription.status) === "cancelled") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Subscription is already cancelled!");
    }
    // try {
    //   await razorpay.subscriptions.pause(subscription.razorpaySubscriptionId!, {
    //     pause_at: "now",
    //   });
    // } catch (error: any) {
    //   console.error("Razorpay pause failed:", error);
    //   throw new AppError(
    //     httpStatus.INTERNAL_SERVER_ERROR,
    //     "Failed to pause subscription in Razorpay"
    //   );
    // }
    subscription.status = "paused";
    subscription.pauseDate = new Date();
    subscription.dateRange = payload === null || payload === void 0 ? void 0 : payload.dateRange;
    subscription.pauseReason = payload === null || payload === void 0 ? void 0 : payload.pauseReason;
    yield subscription.save();
    yield (0, sendPauseSubscriptionEmail_1.sendSubscriptionStatusEmails)(user, subscription, "paused");
    return subscription;
});
// Resume Subscription
const resumeSubscription = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield boardroomBanter_model_1.BoardRoomBanterSubscription.findOne({
        userId: user === null || user === void 0 ? void 0 : user._id,
        status: "paused",
    });
    if (!subscription) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No paused subscription found to resume");
    }
    // try {
    //   await razorpay.subscriptions.resume(subscription.razorpaySubscriptionId!, {
    //     resume_at: "now",
    //   });
    // } catch (error: any) {
    //   console.error("Razorpay resume failed:", error);
    //   throw new AppError(
    //     httpStatus.INTERNAL_SERVER_ERROR,
    //     "Failed to resume subscription in Razorpay"
    //   );
    // }
    subscription.status = "active";
    subscription.resumeDate = new Date();
    yield subscription.save();
    yield (0, sendPauseSubscriptionEmail_1.sendSubscriptionStatusEmails)(user, subscription, "active");
    return subscription;
});
// Cancel Subscription
const cancelSubscription = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield boardroomBanter_model_1.BoardRoomBanterSubscription.findOne({
        userId: user === null || user === void 0 ? void 0 : user._id,
        status: { $in: ["active", "paused"] },
    });
    if (!subscription) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No subscription found to cancel");
    }
    if ((subscription === null || subscription === void 0 ? void 0 : subscription.status) === "cancelled") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Subscription is already cancelled!");
    }
    // try {
    //   await razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId!);
    // } catch (error: any) {
    //   console.error("Razorpay cancel failed:", error);
    //   throw new AppError(
    //     httpStatus.INTERNAL_SERVER_ERROR,
    //     "Failed to cancel subscription in Razorpay"
    //   );
    // }
    subscription.status = "cancelled";
    subscription.cancelDate = new Date();
    subscription.cancelReason = payload === null || payload === void 0 ? void 0 : payload.cancelReason;
    yield subscription.save();
    yield (0, sendPauseSubscriptionEmail_1.sendSubscriptionStatusEmails)(user, subscription, "cancelled");
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
    joinWaitlist,
    sendCouponCode,
    createSubscription,
    verifySubscription,
    getAllSubscriptions,
    getSingleSubscriptionById,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    getMySubscription,
    updateWhatsappGroupStatus,
    suspendUser,
    withdrawSuspension,
    removeUser,
    reAddUser,
};
