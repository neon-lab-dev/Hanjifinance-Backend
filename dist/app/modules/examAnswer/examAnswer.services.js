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
exports.AnswerService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const exam_model_1 = __importDefault(require("../exam/exam.model"));
const auth_model_1 = require("../auth/auth.model");
const examAnswer_model_1 = __importDefault(require("./examAnswer.model"));
const attendExam = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { examId, courseId, answers } = payload;
    if (!examId || !Array.isArray(answers) || answers.length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide examId and answers");
    }
    const exam = yield exam_model_1.default.findById(examId);
    if (!exam)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam not found");
    const user = yield auth_model_1.User.findOne({
        _id: userId,
        "purchasedCourses.courseId": exam.courseId,
    });
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "You haven't purchased this course. Please purchase to attend the exam.");
    const course = user.purchasedCourses.find((c) => c.courseId.toString() === exam.courseId.toString());
    if (!course)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Course not found in user's purchased courses");
    if (course.examLimitLeft <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You have no remaining attempts for this exam.");
    }
    // Score calculation
    let score = 0;
    const questionMap = new Map();
    exam.questions.forEach((q) => questionMap.set(q._id.toString(), q));
    for (const ans of answers) {
        const question = questionMap.get(ans.questionId.toString());
        if (question && question.correctAnswerIndex === ans.selectedOptionIndex) {
            score++;
        }
    }
    const isPassed = score >= exam.passingMark;
    // Save the answer
    const newAnswer = yield examAnswer_model_1.default.create({
        studentId: userId,
        examId,
        courseId,
        answers,
        score,
        isPassed,
    });
    // Update user purchased course
    const updateFields = {
        "purchasedCourses.$.isAttendedOnExam": true,
    };
    if (isPassed) {
        updateFields["purchasedCourses.$.isPassed"] = true;
        updateFields["purchasedCourses.$.examLimitLeft"] = 0;
        updateFields["purchasedCourses.$.score"] = score;
    }
    else {
        updateFields["purchasedCourses.$.examLimitLeft"] = course.examLimitLeft - 1;
    }
    yield auth_model_1.User.updateOne({ _id: userId, "purchasedCourses.courseId": exam.courseId }, { $set: updateFields });
    return { score, isPassed, newAnswer };
});
const getAllExamAnswer = () => __awaiter(void 0, void 0, void 0, function* () {
    const answer = yield examAnswer_model_1.default.find();
    if (!answer)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Answer not found");
    return answer;
});
const getSingleExamAnswerById = (answerId) => __awaiter(void 0, void 0, void 0, function* () {
    const answer = yield examAnswer_model_1.default.findById(answerId)
        .populate("studentId", "full_name email")
        .populate("examId", "title")
        .populate("courseId", "title");
    if (!answer)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Answer not found");
    return answer;
});
exports.AnswerService = {
    attendExam,
    getAllExamAnswer,
    getSingleExamAnswerById,
};
