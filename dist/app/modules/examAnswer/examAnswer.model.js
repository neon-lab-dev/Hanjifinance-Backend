"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// answer.model.ts
const mongoose_1 = require("mongoose");
const AnswerItemSchema = new mongoose_1.Schema({
    questionId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    selectedOptionIndex: { type: Number, required: true },
});
const AnswerSchema = new mongoose_1.Schema({
    examId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Exam", required: true },
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    answers: { type: [AnswerItemSchema], required: true },
    score: { type: Number, required: true },
    isPassed: { type: Boolean, required: true },
    submittedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
const ExamAnswer = (0, mongoose_1.model)("ExamAnswer", AnswerSchema);
exports.default = ExamAnswer;
