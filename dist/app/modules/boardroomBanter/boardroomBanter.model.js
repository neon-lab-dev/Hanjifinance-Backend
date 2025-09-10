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
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["active", "paused", "expired", "pending"],
        default: "active",
    },
    pauseDate: {
        type: Date,
    },
    resumeDate: {
        type: Date,
    },
    razorpaySubscriptionId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    isAddedToWhatsappGroup: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false },
}, { timestamps: true });
exports.BoardRoomBanterSubscription = (0, mongoose_1.model)("BoardRoomBanterSubscription", boardRoomBanterSubscriptionSchema);
