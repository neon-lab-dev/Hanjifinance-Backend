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
exports.CourseServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const sendVideoToCloudinary_1 = require("../../../utils/sendVideoToCloudinary ");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const courseLecture_model_1 = __importDefault(require("./courseLecture.model"));
// Service to add a lecture with optional video
const addCourseLecture = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    let videoUrl = "";
    let videoPublicId = "";
    if (file) {
        const { secure_url, public_id } = yield (0, sendVideoToCloudinary_1.sendVideoToCloudinary)(file.originalname, file.path);
        videoUrl = secure_url;
        videoPublicId = public_id;
    }
    const payloadData = Object.assign(Object.assign({}, payload), { videoUrl,
        videoPublicId });
    // Save lecture to DB
    const result = yield courseLecture_model_1.default.create(payloadData);
    return result;
});
// Get all courses
const getAllCourseLectures = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseLecture_model_1.default.find();
    return result;
});
// Get single course by ID
const getSingleLectureById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseLecture_model_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Lecture not found");
    }
    return result;
});
const getLecturesByCourseId = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseLecture_model_1.default.find({ courseId });
    if (!result || result.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No lectures found for this course");
    }
    return result;
});
// Update course
const updateLecture = (id, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield courseLecture_model_1.default.findById(id);
    if (!existing) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Lecture not found");
    }
    let videoUrl;
    let videoPublicId;
    if (file) {
        const { secure_url, public_id } = yield (0, sendVideoToCloudinary_1.sendVideoToCloudinary)(file.originalname, file.path);
        videoUrl = secure_url;
        videoPublicId = public_id;
    }
    const updatePayload = Object.assign(Object.assign(Object.assign({}, payload), (videoUrl && { videoUrl })), (videoPublicId && { videoPublicId }));
    const result = yield courseLecture_model_1.default.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Delete course by ID
const deleteLecture = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseLecture_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Course not found");
    }
    return result;
});
exports.CourseServices = {
    addCourseLecture,
    getAllCourseLectures,
    getSingleLectureById,
    getLecturesByCourseId,
    updateLecture,
    deleteLecture,
};
