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
exports.ActivityServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const activities_model_1 = __importDefault(require("./activities.model"));
// Create a new activity
const addActivity = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield activities_model_1.default.create(payload);
    return result;
});
// Get all activities
const getAllActivities = (keyword_1, ...args_1) => __awaiter(void 0, [keyword_1, ...args_1], void 0, function* (keyword, page = 1, limit = 10) {
    const query = {};
    if (keyword) {
        query.$or = [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
        ];
    }
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        activities_model_1.default.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        activities_model_1.default.countDocuments(query),
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
// Get activities by user ID
const getActivitiesByUserId = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 10) {
    const query = { userId };
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        activities_model_1.default.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        activities_model_1.default.countDocuments(query),
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
exports.ActivityServices = {
    addActivity,
    getAllActivities,
    getActivitiesByUserId,
};
