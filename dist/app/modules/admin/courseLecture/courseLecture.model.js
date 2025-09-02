"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CourseLectureSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: false,
    },
    videoPublicId: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});
const CourseLecture = (0, mongoose_1.model)("CourseLecture", CourseLectureSchema);
exports.default = CourseLecture;
