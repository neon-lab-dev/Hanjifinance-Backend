"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CourseBundleSchema = new mongoose_1.Schema({
    courseId: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Course",
            required: false,
        },
    ],
    imageUrl: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
const CourseBundle = (0, mongoose_1.model)("CourseBundle", CourseBundleSchema);
exports.default = CourseBundle;
