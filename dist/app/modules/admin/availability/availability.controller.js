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
exports.AvailabilityControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const availability_service_1 = require("./availability.service");
// ✅ Add Availability (Admin)
const addAvailability = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield availability_service_1.AvailabilityService.addAvailability(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Availability added successfully",
        data: result,
    });
}));
// ✅ Get All Availabilities (Admin/User)
const getAllAvailabilities = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, page = "1", limit = "10" } = req.query;
    const result = yield availability_service_1.AvailabilityService.getAllAvailabilities(date, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Availabilities fetched successfully",
        data: {
            availabilities: result.data,
            pagination: result.meta,
        },
    });
}));
// ✅ Get Single Availability by ID
const getSingleAvailabilityById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { availabilityId } = req.params;
    const result = yield availability_service_1.AvailabilityService.getSingleAvailabilityById(availabilityId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Availability fetched successfully",
        data: result,
    });
}));
// ✅ Delete Availability
const deleteAvailability = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { availabilityId } = req.params;
    const result = yield availability_service_1.AvailabilityService.deleteAvailability(availabilityId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Availability deleted successfully",
        data: result,
    });
}));
exports.AvailabilityControllers = {
    addAvailability,
    getAllAvailabilities,
    getSingleAvailabilityById,
    deleteAvailability,
};
