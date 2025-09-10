import express from "express";
import { AvailabilityControllers } from "./availability.controller";
import auth from "../../../middlewares/auth";
import { UserRole } from "../../auth/auth.constants";

const router = express.Router();

// Create availability
router.post(
  "/add",
  auth(UserRole.admin, UserRole.moderator),
  AvailabilityControllers.addAvailability
);

// Get all availability slots
router.get("/", AvailabilityControllers.getAllAvailabilities);

// Get single availability by ID
router.get(
  "/:availabilityId",
  AvailabilityControllers.getSingleAvailabilityById
);

// Delete availability
router.delete(
  "/:availabilityId",
  auth(UserRole.admin, UserRole.moderator),
  AvailabilityControllers.deleteAvailability
);

export const AvailabilityRoutes = router;
