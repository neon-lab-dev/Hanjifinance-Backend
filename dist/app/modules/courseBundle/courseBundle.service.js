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
exports.CourseBundleService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const courseBundle_model_1 = __importDefault(require("./courseBundle.model"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
// Add Course Bundle
const addCourseBundle = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    let imageUrl = "";
    if (file) {
        const imageName = `${payload.name}-${Date.now()}`;
        const path = file.path;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        imageUrl = secure_url;
    }
    const payloadData = Object.assign(Object.assign({}, payload), { imageUrl });
    const bundle = yield courseBundle_model_1.default.create(payloadData);
    return bundle;
});
// Get All Course Bundles
const getAllCourseBundles = (keyword_1, ...args_1) => __awaiter(void 0, [keyword_1, ...args_1], void 0, function* (keyword, page = 1, limit = 10) {
    const query = {};
    if (keyword) {
        query.$or = [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
        ];
    }
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        courseBundle_model_1.default.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate({
            path: "courseId",
            select: "title subtitle discountedPrice",
        }),
        courseBundle_model_1.default.countDocuments(query),
    ]);
    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
});
// Get Single Course Bundle
const getSingleCourseBundle = (bundleId) => __awaiter(void 0, void 0, void 0, function* () {
    const bundle = yield courseBundle_model_1.default.findById(bundleId)
        .populate({
        path: "courseId",
        select: "title subtitle discountedPrice",
    });
    if (!bundle) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Course bundle not found");
    }
    return bundle;
});
// Update Course Bundle
const updateCourseBundle = (bundleId, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield courseBundle_model_1.default.findById(bundleId);
    if (!existing) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Course bundle not found");
    }
    let imageUrl;
    if (file) {
        const imageName = `${(payload === null || payload === void 0 ? void 0 : payload.name) || existing.name}-${Date.now()}`;
        const path = file.path;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        imageUrl = secure_url;
    }
    const updatePayload = Object.assign(Object.assign({}, payload), (imageUrl && { imageUrl }));
    const bundle = yield courseBundle_model_1.default.findByIdAndUpdate(bundleId, updatePayload, {
        new: true,
        runValidators: true,
    });
    return bundle;
});
// Delete Course Bundle
const deleteCourseBundle = (bundleId) => __awaiter(void 0, void 0, void 0, function* () {
    const bundle = yield courseBundle_model_1.default.findByIdAndDelete(bundleId);
    if (!bundle) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Course bundle not found");
    }
    return bundle;
});
exports.CourseBundleService = {
    addCourseBundle,
    getAllCourseBundles,
    getSingleCourseBundle,
    updateCourseBundle,
    deleteCourseBundle,
};
