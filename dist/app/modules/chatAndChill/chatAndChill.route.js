"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatAndChillRoutes = void 0;
// routes/chatAndChill.routes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const chatAndChill_controller_1 = require("./chatAndChill.controller");
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
// Checkout
router.post("/checkout", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator, auth_constants_1.UserRole.user), chatAndChill_controller_1.ChatAndChillControllers.checkout);
// Verify payment (Razorpay callback)
router.post("/verify-payment", chatAndChill_controller_1.ChatAndChillControllers.verifyPayment);
// Book Chat & Chill
router.post("/book", (0, auth_1.default)(auth_constants_1.UserRole.user), chatAndChill_controller_1.ChatAndChillControllers.bookChatAndChill);
// Get all bookings (Admin/Moderator)
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), chatAndChill_controller_1.ChatAndChillControllers.getAllBookings);
// Get logged-in user's bookings
router.get("/my-bookings", (0, auth_1.default)(auth_constants_1.UserRole.user), chatAndChill_controller_1.ChatAndChillControllers.getMyBookings);
// Schedule a meeting (Admin/Moderator)
router.put("/schedule-meeting", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), chatAndChill_controller_1.ChatAndChillControllers.scheduleMeeting);
// Get single booking by ID
router.get("/:bookingId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator, auth_constants_1.UserRole.user), chatAndChill_controller_1.ChatAndChillControllers.getSingleBookingById);
// Get all bookings for a particular user (Admin/Moderator)
router.get("/user/:userCustomId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), chatAndChill_controller_1.ChatAndChillControllers.getBookingsByUserId);
// Update booking status (Admin/Moderator)
router.put("/update-status/:bookingId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), chatAndChill_controller_1.ChatAndChillControllers.updateBookingStatus);
exports.ChatAndChillRoutes = router;
