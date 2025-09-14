"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseOrderRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const auth_constants_1 = require("../../auth/auth.constants");
const courseOrder_controller_1 = require("./courseOrder.controller");
const router = (0, express_1.Router)();
// Razorpay payment-related
router.post("/checkout", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator, auth_constants_1.UserRole.user), courseOrder_controller_1.CourseOrderControllers.checkout);
router.post("/verify-payment", courseOrder_controller_1.CourseOrderControllers.verifyPayment);
// Create course order (after payment success)
router.post("/create", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator, auth_constants_1.UserRole.user), courseOrder_controller_1.CourseOrderControllers.createCourseOrder);
// Logged-in user’s orders
router.get("/my-orders", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator, auth_constants_1.UserRole.user), courseOrder_controller_1.CourseOrderControllers.getMyCourseOrders);
// Admin/Moderator only
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), courseOrder_controller_1.CourseOrderControllers.getAllCourseOrders);
router.get("/:orderId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), courseOrder_controller_1.CourseOrderControllers.getSingleCourseOrderById);
router.get("/user/:userCustomId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), courseOrder_controller_1.CourseOrderControllers.getCourseOrdersByUserId);
exports.CourseOrderRoutes = router;
