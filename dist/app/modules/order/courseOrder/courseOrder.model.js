"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseOrder = void 0;
const mongoose_1 = require("mongoose");
const CourseOrderSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true, unique: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    userCustomId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    courses: [
        {
            courseId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Course",
                required: true,
            },
            courseTitle: { type: String, required: true },
            coursePrice: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    razorpayOrderId: { type: String },
    orderType: { type: String, enum: ["single", "bundle"], required: true },
}, { timestamps: true });
exports.CourseOrder = (0, mongoose_1.model)("CourseOrder", CourseOrderSchema);
