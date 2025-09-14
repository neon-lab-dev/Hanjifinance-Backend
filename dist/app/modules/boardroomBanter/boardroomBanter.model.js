"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardRoomBanterSubscription = void 0;
const mongoose_1 = require("mongoose");
const boardRoomBanterSubscriptionSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        ref: "User",
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    qualification: { type: String, required: false, trim: true },
    profession: { type: String, required: false, trim: true },
    message: { type: String, required: false, trim: true },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["waitlist", "code sent", "active", "paused", "expired", "pending", "cancelled"],
        default: "active",
    },
    pauseDate: {
        type: Date,
    },
    resumeDate: {
        type: Date,
    },
    cancelDate: {
        type: Date,
        required: false,
    },
    razorpaySubscriptionId: { type: String, required: false, default: "" },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    isAddedToWhatsappGroup: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false },
}, { timestamps: true });
exports.BoardRoomBanterSubscription = (0, mongoose_1.model)("BoardRoomBanterSubscription", boardRoomBanterSubscriptionSchema);
