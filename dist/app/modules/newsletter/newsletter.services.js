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
exports.NewsletterServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const newsletter_model_1 = __importDefault(require("./newsletter.model"));
// Add Newsletter
const subscribeNewsletter = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isAlreadySubscribed = yield newsletter_model_1.default.findOne({ email: payload.email });
    if (isAlreadySubscribed) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You've already subscribed.");
    }
    const result = yield newsletter_model_1.default.create(payload);
    return result;
});
// Get all Newsletters
const getAllNewsletters = (keyword_1, ...args_1) => __awaiter(void 0, [keyword_1, ...args_1], void 0, function* (keyword, page = 1, limit = 10) {
    const query = {};
    if (keyword) {
        query.$or = [
            { name: { $regex: keyword, $options: "i" } },
            { email: { $regex: keyword, $options: "i" } },
        ];
    }
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        newsletter_model_1.default.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        newsletter_model_1.default.countDocuments(query),
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
// Get single Newsletter by ID
const getSingleNewsletterById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield newsletter_model_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Newsletter not found");
    }
    return result;
});
// Update Newsletter
const updateNewsletter = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield newsletter_model_1.default.findById(id);
    if (!existing) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Newsletter not found");
    }
    const result = yield newsletter_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Delete Newsletter
const deleteNewsletter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield newsletter_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Newsletter not found");
    }
    return result;
});
exports.NewsletterServices = {
    subscribeNewsletter,
    getAllNewsletters,
    getSingleNewsletterById,
    updateNewsletter,
    deleteNewsletter,
};
