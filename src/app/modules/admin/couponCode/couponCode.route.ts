import express from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "../../auth/auth.constants";
import { CouponCodeControllers } from "./couponCode.controller";

const router = express.Router();

// Add coupon code (Admin / Moderator only)
router.post(
  "/add",
  auth(UserRole.admin, UserRole.moderator),
  CouponCodeControllers.addCouponCode
);

// Add coupon code (Admin / Moderator only)
router.post(
  "/validate",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  CouponCodeControllers.validateCouponCode
);

// Get all coupon codes
router.get("/", CouponCodeControllers.getAllCouponCodes);

// Delete coupon code (Admin / Moderator only)
router.delete(
  "/delete/:couponCodeId",
  auth(UserRole.admin, UserRole.moderator),
  CouponCodeControllers.deleteCouponCode
);

export const CouponCodeRoutes = router;
