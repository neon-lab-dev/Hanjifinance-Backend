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
exports.HelpDeskServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const helpdesk_model_1 = __importDefault(require("./helpdesk.model"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
// Raise a Query
const raiseQuery = (user, file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    let imageUrl = "";
    if (file) {
        const imageName = `${payload.name}-${Date.now()}`;
        const path = file.path;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        imageUrl = secure_url;
    }
    const payloadData = {
        message: payload === null || payload === void 0 ? void 0 : payload.message,
        userId: user === null || user === void 0 ? void 0 : user._id,
        userCustomId: user === null || user === void 0 ? void 0 : user.userId,
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user === null || user === void 0 ? void 0 : user.email,
        phoneNumber: user === null || user === void 0 ? void 0 : user.phoneNumber,
        status: "pending",
        imageUrl,
    };
    return yield helpdesk_model_1.default.create(payloadData);
});
// Get All Queries
const getAllQueries = (keyword_1, status_1, ...args_1) => __awaiter(void 0, [keyword_1, status_1, ...args_1], void 0, function* (keyword, status, page = 1, limit = 10) {
    const query = {};
    if (keyword) {
        query.$or = [
            { name: { $regex: keyword, $options: "i" } },
            { email: { $regex: keyword, $options: "i" } },
            { phoneNumber: { $regex: keyword, $options: "i" } },
            { userCustomId: { $regex: keyword, $options: "i" } },
        ];
    }
    if (status && status !== "all") {
        query.status = { $regex: status, $options: "i" };
    }
    const skip = (page - 1) * limit;
    // Populate only on find query, not on countDocuments
    const [data, total] = yield Promise.all([
        helpdesk_model_1.default.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate("userId", "name email phoneNumber"),
        helpdesk_model_1.default.countDocuments(query),
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
// Get Single Query by ID
const getSingleQueryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield helpdesk_model_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Query not found");
    }
    return result;
});
// Get Queries of logged-in user
const getMyQueries = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 10, keyword, status) {
    const query = { userId };
    if (keyword) {
        query.$or = [
            { name: { $regex: keyword, $options: "i" } },
            { email: { $regex: keyword, $options: "i" } },
            { phoneNumber: { $regex: keyword, $options: "i" } },
            { userCustomId: { $regex: keyword, $options: "i" } },
        ];
    }
    if (status && status !== "all") {
        query.status = { $regex: status, $options: "i" };
    }
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        helpdesk_model_1.default.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).populate("userId", "name email phoneNumber"),
        helpdesk_model_1.default.countDocuments(query),
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
// Update Query Status
const updateQueryStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield helpdesk_model_1.default.findById(id);
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Query not found");
    }
    const status = payload === null || payload === void 0 ? void 0 : payload.status;
    const result = yield helpdesk_model_1.default.findByIdAndUpdate(id, { status }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Query not found");
    }
    return isExist;
});
// Delete Query
const deleteQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield helpdesk_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Query not found");
    }
    return result;
});
exports.HelpDeskServices = {
    raiseQuery,
    getAllQueries,
    getSingleQueryById,
    getMyQueries,
    updateQueryStatus,
    deleteQuery,
};
