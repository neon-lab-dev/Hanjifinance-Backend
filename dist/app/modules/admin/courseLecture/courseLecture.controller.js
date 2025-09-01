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
exports.CourseControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const courseLecture_services_1 = require("./courseLecture.services");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
// Add course lecture
const addCourseLecture = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const result = yield courseLecture_services_1.CourseServices.addCourse(req.body, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course added successfully",
        data: result,
    });
}));
// Get all courses
const getAllCourses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, category } = req.query;
    const result = yield courseLecture_services_1.CourseServices.getAllCourses(keyword, category);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All courses fetched successfully",
        data: result,
    });
}));
// Get single course by ID
const getSingleCourseById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const result = yield courseLecture_services_1.CourseServices.getSingleCourseById(courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course fetched successfully",
        data: result,
    });
}));
// Update course
const updateCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const { courseId } = req.params;
    const result = yield courseLecture_services_1.CourseServices.updateCourse(courseId, req.body, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course updated successfully",
        data: result,
    });
}));
// Delete course
const deleteCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const result = yield courseLecture_services_1.CourseServices.deleteCourse(courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course deleted successfully",
        data: result,
    });
}));
exports.CourseControllers = {
    addCourseLecture,
    getAllCourses,
    getSingleCourseById,
    updateCourse,
    deleteCourse,
};
