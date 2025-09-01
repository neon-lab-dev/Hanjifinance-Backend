import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";
import { CourseControllers } from "./course.controller";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

// For admin only
router.post(
  "/add-course",
  multerUpload.single("file"),
  auth(UserRole.admin, UserRole.moderator, UserRole["super-admin"]),
  CourseControllers.addCourse
);

router.get("/", CourseControllers.getAllCourses);
router.get("/:courseId", CourseControllers.getSingleCourseById);

router.put(
  "/:courseId",
  multerUpload.single("file"),
  auth(UserRole.admin, UserRole.moderator, UserRole["super-admin"]),
  CourseControllers.updateCourse
);

router.delete(
  "/:courseId",
  auth(UserRole.admin, UserRole.moderator, UserRole["super-admin"]),
  CourseControllers.deleteCourse
);

export const CourseRoutes = router;
