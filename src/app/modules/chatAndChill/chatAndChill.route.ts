// routes/chatAndChill.routes.ts
import express from "express";
import auth from "../../middlewares/auth";
import { ChatAndChillControllers } from "./chatAndChill.controller";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

// Checkout
router.post(
  "/checkout",
  auth(UserRole.admin, UserRole.moderator, UserRole.user),
  ChatAndChillControllers.checkout
);

// Verify payment (Razorpay callback)
router.post(
  "/verify-payment",
  ChatAndChillControllers.verifyPayment
);

// Book Chat & Chill
router.post(
  "/book",
  auth(UserRole.user),
  ChatAndChillControllers.bookChatAndChill
);

// Get all bookings (Admin/Moderator)
router.get(
  "/",
  auth(UserRole.admin, UserRole.moderator),
  ChatAndChillControllers.getAllBookings
);

// Get single booking by ID
router.get(
  "/:bookingId",
  auth(UserRole.admin, UserRole.moderator, UserRole.user),
  ChatAndChillControllers.getSingleBookingById
);

// Get all bookings for a particular user (Admin/Moderator)
router.get(
  "/user/:userCustomId",
  auth(UserRole.admin, UserRole.moderator),
  ChatAndChillControllers.getBookingsByUserId
);

// Get logged-in user's bookings
router.get(
  "/my-bookings",
  auth(UserRole.user),
  ChatAndChillControllers.getMyBookings
);

// Update booking status (Admin/Moderator)
router.put(
  "/update-status",
  auth(UserRole.admin, UserRole.moderator),
  ChatAndChillControllers.updateBookingStatus
);

// Schedule a meeting (Admin/Moderator)
router.put(
  "/schedule-meeting",
  auth(UserRole.admin, UserRole.moderator),
  ChatAndChillControllers.scheduleMeeting
);

export const ChatAndChillRoutes = router;