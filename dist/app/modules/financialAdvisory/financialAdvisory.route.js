"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatAndChillRoutes = void 0;
// routes/chatAndChill.routes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const financialAdvisory_controller_1 = require("./financialAdvisory.controller");
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
// Checkout
router.post("/checkout", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator, auth_constants_1.UserRole.user), financialAdvisory_controller_1.FinancialAdvisoryControllers.checkout);
// Verify payment (Razorpay callback)
router.post("/verify-payment", financialAdvisory_controller_1.FinancialAdvisoryControllers.verifyPayment);
// Book a financial advisory session
router.post("/book", (0, auth_1.default)(auth_constants_1.UserRole.user), financialAdvisory_controller_1.FinancialAdvisoryControllers.bookFinancialAdvisory);
// Get all financial advisory bookings (Admin/Moderator)
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), financialAdvisory_controller_1.FinancialAdvisoryControllers.getAllFinancialAdvisories);
// Get logged-in user's financial advisory bookings
router.get("/my-bookings", (0, auth_1.default)(auth_constants_1.UserRole.user), financialAdvisory_controller_1.FinancialAdvisoryControllers.getMyFinancialAdvisoryBookings);
// Get single financial advisory booking by ID
router.get("/:advisoryId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator, auth_constants_1.UserRole.user), financialAdvisory_controller_1.FinancialAdvisoryControllers.getSingleFinancialAdvisory);
exports.ChatAndChillRoutes = router;
