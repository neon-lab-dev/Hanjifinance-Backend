import express from "express";
import { multerUpload } from "../../../config/multer.config";
import auth from "../../../middlewares/auth";
import { UserRole } from "../../auth/auth.constants";
import { CourseLectureControllers } from "./courseLecture.controller";

const router = express.Router();

// For admin only
router.post(
  "/add",
  auth(UserRole.admin, UserRole.moderator),
  multerUpload.single("file"),
  CourseLectureControllers.addCourseLecture
);

router.get("/", CourseLectureControllers.getAllCourseLectures);
router.get("/:lectureId", CourseLectureControllers.getSingleLectureById);
router.get("/all/:courseId", CourseLectureControllers.getLecturesByCourseId);

router.put(
  "/update/:lectureId",
  auth(UserRole.admin, UserRole.moderator),
  multerUpload.single("file"),
  CourseLectureControllers.updateLecture
);

router.delete(
  "/delete/:lectureId",
  auth(UserRole.admin, UserRole.moderator),
  CourseLectureControllers.deleteCourse
);

export const CourseLectureRoutes = router;
