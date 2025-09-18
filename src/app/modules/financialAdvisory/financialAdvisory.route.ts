// routes/chatAndChill.routes.ts
import express from "express";
import auth from "../../middlewares/auth";
import {  FinancialAdvisoryControllers } from "./financialAdvisory.controller";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

// Checkout
router.post(
  "/checkout",
  auth(UserRole.admin, UserRole.moderator, UserRole.user),
  FinancialAdvisoryControllers.checkout
);

// Verify payment (Razorpay callback)
router.post("/verify-payment", FinancialAdvisoryControllers.verifyPayment);
// Book a financial advisory session
router.post(
  "/book",
  auth(UserRole.user),
  FinancialAdvisoryControllers.bookFinancialAdvisory
);

// Get all financial advisory bookings (Admin/Moderator)
router.get(
  "/",
  auth(UserRole.admin, UserRole.moderator),
  FinancialAdvisoryControllers.getAllFinancialAdvisories
);

// Get logged-in user's financial advisory bookings
router.get(
  "/my-bookings",
  auth(UserRole.user),
  FinancialAdvisoryControllers.getMyFinancialAdvisoryBookings
);

// Get single financial advisory booking by ID
router.get(
  "/:advisoryId",
  auth(UserRole.admin, UserRole.moderator, UserRole.user),
  FinancialAdvisoryControllers.getSingleFinancialAdvisory
);

export const ChatAndChillRoutes = router;
