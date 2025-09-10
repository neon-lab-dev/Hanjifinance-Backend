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
exports.BoardRoomBanterSubscriptionController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const boardroomBanter_service_1 = require("./boardroomBanter.service");
const createSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield boardroomBanter_service_1.BoardRoomBanterSubscriptionService.createSubscription(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "BoardRoomBanter subscription created successfully",
        data: result,
    });
}));
const verifySubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const result = yield boardroomBanter_service_1.BoardRoomBanterSubscriptionService.verifySubscription(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment verified successfully",
        data: {
            redirectUrl: result.redirectUrl,
            subscription: result.subscription,
        },
    });
}));
const pauseSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield boardroomBanter_service_1.BoardRoomBanterSubscriptionService.pauseSubscription(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "BoardRoomBanter subscription paused successfully",
        data: result,
    });
}));
const resumeSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield boardroomBanter_service_1.BoardRoomBanterSubscriptionService.resumeSubscription(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "BoardRoomBanter subscription resumed successfully",
        data: result,
    });
}));
const getMySubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const result = yield boardroomBanter_service_1.BoardRoomBanterSubscriptionService.getMySubscription(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fetched my BoardRoomBanter subscription successfully",
        data: result,
    });
}));
const updateWhatsappGroupStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isAddedToWhatsappGroup, userId } = req.body;
    const result = yield boardroomBanter_service_1.BoardRoomBanterSubscriptionService.updateWhatsappGroupStatus(userId, isAddedToWhatsappGroup);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "WhatsApp group status updated",
        data: result,
    });
}));
const suspendUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield boardroomBanter_service_1.BoardRoomBanterSubscriptionService.suspendUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User suspended successfully",
        data: result,
    });
}));
const withdrawSuspension = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield boardroomBanter_service_1.BoardRoomBanterSubscriptionService.withdrawSuspension(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User suspension withdrawn",
        data: result,
    });
}));
const removeUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield boardroomBanter_service_1.BoardRoomBanterSubscriptionService.removeUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User removed successfully (soft delete)",
        data: result,
    });
}));
const reAddUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield boardroomBanter_service_1.BoardRoomBanterSubscriptionService.reAddUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User re-added successfully",
        data: result,
    });
}));
exports.BoardRoomBanterSubscriptionController = {
    createSubscription,
    verifySubscription,
    pauseSubscription,
    resumeSubscription,
    getMySubscription,
    updateWhatsappGroupStatus,
    suspendUser,
    withdrawSuspension,
    removeUser,
    reAddUser,
};
