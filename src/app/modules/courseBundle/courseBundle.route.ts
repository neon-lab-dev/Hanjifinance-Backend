import express from "express";
import auth from "../../middlewares/auth";
import { CourseBundleControllers } from "./courseBundle.controller";
import { UserRole } from "../auth/auth.constants";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

// Add Course Bundle (Admin/Moderator only)
router.post(
  "/create",
  auth(UserRole.admin, UserRole.moderator),
  multerUpload.single("file"),
  CourseBundleControllers.addCourseBundle
);

// Get All Course Bundles
router.get(
  "/",
  CourseBundleControllers.getAllCourseBundles
);

// Get Single Course Bundle
router.get(
  "/:bundleId",
  CourseBundleControllers.getSingleCourseBundle
);

// Update Course Bundle
router.put(
  "/update/:bundleId",
  auth(UserRole.admin, UserRole.moderator),
  multerUpload.single("file"),
  CourseBundleControllers.updateCourseBundle
);

// Delete Course Bundle
router.delete(
  "/delete/:bundleId",
  auth(UserRole.admin, UserRole.moderator),
  CourseBundleControllers.deleteCourseBundle
);

export const CourseBundleRoutes = router;
