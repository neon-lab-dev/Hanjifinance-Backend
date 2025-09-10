"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatAndChillSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userCustomId: {
        type: String,
        trim: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    topicsToDiscuss: {
        type: String,
        required: false,
    },
    bookingDate: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: false,
    },
    razorpayOrderId: {
        type: String,
        trim: true,
        default: null,
    },
    razorpayPaymentId: {
        type: String,
        trim: true,
        default: null,
    },
    status: {
        type: String,
        enum: ["pending", "booked", "scheduled", "cancelled", "completed"],
        default: "pending",
    },
    meetingLink: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});
const ChatAndChill = (0, mongoose_1.model)("ChatAndChill", ChatAndChillSchema);
exports.default = ChatAndChill;
