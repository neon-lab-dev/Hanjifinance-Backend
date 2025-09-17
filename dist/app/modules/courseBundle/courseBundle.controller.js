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
exports.CourseBundleControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const courseBundle_service_1 = require("./courseBundle.service");
// Create a Course Bundle
const addCourseBundle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const result = yield courseBundle_service_1.CourseBundleService.addCourseBundle(req.body, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Course bundle created successfully",
        data: result,
    });
}));
// Get All Course Bundles (with pagination + search)
const getAllCourseBundles = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, page = "1", limit = "10" } = req.query;
    const result = yield courseBundle_service_1.CourseBundleService.getAllCourseBundles(keyword, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All course bundles fetched successfully",
        data: {
            bundles: result.data,
            pagination: result.meta,
        },
    });
}));
// Get Single Course Bundle
const getSingleCourseBundle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bundleId } = req.params;
    const result = yield courseBundle_service_1.CourseBundleService.getSingleCourseBundle(bundleId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course bundle fetched successfully",
        data: result,
    });
}));
// Update Course Bundle
const updateCourseBundle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bundleId } = req.params;
    const file = req.file;
    const result = yield courseBundle_service_1.CourseBundleService.updateCourseBundle(bundleId, req.body, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course bundle updated successfully",
        data: result,
    });
}));
// Delete Course Bundle
const deleteCourseBundle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bundleId } = req.params;
    const result = yield courseBundle_service_1.CourseBundleService.deleteCourseBundle(bundleId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course bundle deleted successfully",
        data: result,
    });
}));
exports.CourseBundleControllers = {
    addCourseBundle,
    getAllCourseBundles,
    getSingleCourseBundle,
    updateCourseBundle,
    deleteCourseBundle,
};
