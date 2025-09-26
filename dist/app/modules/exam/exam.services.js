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
exports.ExamServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const exam_model_1 = __importDefault(require("./exam.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
// Create exam
const createExam = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.courseId ||
        !payload.title ||
        !payload.questions ||
        !Array.isArray(payload.questions) ||
        payload.questions.length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide course Id, title, and at least one question");
    }
    // Validate questions
    for (const question of payload.questions) {
        if (!question.questionText ||
            !Array.isArray(question.options) ||
            question.options.length < 2 ||
            typeof question.correctAnswerIndex !== "number") {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid question format");
        }
    }
    const exam = yield exam_model_1.default.create(payload);
    return exam;
});
// Get all exams
const getAllExams = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield exam_model_1.default.find().populate("courseId");
    return result;
});
// Get single exam by ID
const getSingleExamById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield exam_model_1.default.findById(id).populate("courseId");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam not found");
    }
    return result;
});
// Get single exam by ID
const getSingleExamByCourseId = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield exam_model_1.default.findOne({ courseId });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam not found");
    }
    return result;
});
// Update exam
const updateExam = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield exam_model_1.default.findById(id);
    if (!existing) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam not found");
    }
    if (payload.questions && payload.questions.length > 0) {
        for (const question of payload.questions) {
            if (!question.questionText ||
                !Array.isArray(question.options) ||
                question.options.length < 2 ||
                typeof question.correctAnswerIndex !== "number") {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid question format");
            }
        }
        return yield exam_model_1.default.findByIdAndUpdate(id, { $push: { questions: { $each: payload.questions } } }, { new: true, runValidators: true });
    }
    const result = yield exam_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Delete exam
const deleteExam = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const exam = yield exam_model_1.default.findById(id);
    if (!exam) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam not found");
    }
    const result = yield exam_model_1.default.findByIdAndDelete(id);
    return result;
});
exports.ExamServices = {
    createExam,
    getAllExams,
    getSingleExamById,
    getSingleExamByCourseId,
    updateExam,
    deleteExam,
};
