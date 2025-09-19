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
exports.AvailabilityService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const availability_model_1 = __importDefault(require("./availability.model"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
// Add new availability
const addAvailability = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const payloadData = {
        date: payload.date,
        slot: payload.slot || "07:00 PM - 07:30 PM",
    };
    const availability = yield availability_model_1.default.create(payloadData);
    return availability;
});
// Get all availabilities
const getAllAvailabilities = (date, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    yield availability_model_1.default.updateMany({ date: { $lt: today }, isAvailable: true }, { $set: { isAvailable: false } });
    const query = {};
    if (date) {
        const start = new Date(date);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        query.date = { $gte: start, $lte: end };
    }
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        availability_model_1.default.find(query).skip(skip).limit(limit).sort({ date: 1 }),
        availability_model_1.default.countDocuments(query),
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
// Get single availability
const getSingleAvailabilityById = (availabilityId) => __awaiter(void 0, void 0, void 0, function* () {
    const availability = yield availability_model_1.default.findById(availabilityId);
    if (!availability) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Availability not found");
    }
    return availability;
});
// Delete availability
const deleteAvailability = (availabilityId) => __awaiter(void 0, void 0, void 0, function* () {
    const availability = yield availability_model_1.default.findByIdAndDelete(availabilityId);
    if (!availability) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Availability not found");
    }
    return availability;
});
exports.AvailabilityService = {
    addAvailability,
    getAllAvailabilities,
    getSingleAvailabilityById,
    deleteAvailability,
};
