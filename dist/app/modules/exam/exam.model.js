"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
// exam.model.ts
const mongoose_1 = require("mongoose");
const OptionSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
    },
}, { _id: false });
const QuestionSchema = new mongoose_1.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: {
        type: [OptionSchema],
        validate: (val) => val.length >= 2,
        required: true,
    },
    correctAnswerIndex: {
        type: Number,
        required: true,
    },
});
const ExamSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    questions: {
        type: [QuestionSchema],
        required: true,
    },
    duration: {
        type: Number,
    },
    passingMark: {
        type: Number,
    },
}, {
    timestamps: true,
});
ExamSchema.pre('save', function (next) {
    const totalQuestions = this.questions.length;
    this.duration = totalQuestions;
    // 70% passing
    this.passingMark = Math.ceil(totalQuestions * 0.7);
    next();
});
const Exam = (0, mongoose_1.model)("Exam", ExamSchema);
exports.default = Exam;
