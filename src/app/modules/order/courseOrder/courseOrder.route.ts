import { Router } from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "../../auth/auth.constants";
import { CourseOrderControllers } from "./courseOrder.controller";

const router = Router();

// Razorpay payment-related
router.post(
  "/checkout",
  auth(UserRole.admin, UserRole.moderator, UserRole.user),
  CourseOrderControllers.checkout
);

router.post(
  "/verify-payment",
  auth(UserRole.admin, UserRole.moderator, UserRole.user),
  CourseOrderControllers.verifyPayment
);

// Create course order (after payment success)
router.post(
  "/create",
  auth(UserRole.admin, UserRole.moderator, UserRole.user),
  CourseOrderControllers.createCourseOrder
);

// Logged-in user’s orders
router.get(
  "/my-orders",
  auth(UserRole.admin, UserRole.moderator, UserRole.user),
  CourseOrderControllers.getMyCourseOrders
);

// Admin/Moderator only
router.get(
  "/",
  auth(UserRole.admin, UserRole.moderator),
  CourseOrderControllers.getAllCourseOrders
);

router.get(
  "/:orderId",
  auth(UserRole.admin, UserRole.moderator),
  CourseOrderControllers.getSingleCourseOrderById
);

router.get(
  "/user/:userCustomId",
  auth(UserRole.admin, UserRole.moderator),
  CourseOrderControllers.getCourseOrdersByUserId
);

export const CourseOrderRoutes = router;
