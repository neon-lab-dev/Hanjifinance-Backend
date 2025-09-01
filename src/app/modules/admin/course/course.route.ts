import express from "express";
import { CourseControllers } from "./course.controller";
import { multerUpload } from "../../../config/multer.config";
import auth from "../../../middlewares/auth";
import { UserRole } from "../../auth/auth.constants";

const router = express.Router();

// For admin only
router.post(
  "/admin/add",
  auth(UserRole.admin, UserRole.moderator),
  multerUpload.single("file"),
  CourseControllers.addCourse
);

router.get("/", CourseControllers.getAllCourses);
router.get("/:courseId", CourseControllers.getSingleCourseById);

router.put(
  "/:courseId",
  auth(UserRole.admin, UserRole.moderator),
  multerUpload.single("file"),
  CourseControllers.updateCourse
);

router.delete(
  "/:courseId",
  auth(UserRole.admin, UserRole.moderator),
  CourseControllers.deleteCourse
);

export const CourseRoutes = router;
