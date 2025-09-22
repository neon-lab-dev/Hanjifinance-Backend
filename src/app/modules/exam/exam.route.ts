import express from "express";
import { ExamControllers } from "./exam.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

// Create a new exam
router.post(
  "/create",
  auth(UserRole.admin, UserRole.moderator),
  ExamControllers.createExam
);

// Get all exams
router.get("/", ExamControllers.getAllExams);

// Get single exam by ID
router.get("/:examId", ExamControllers.getSingleExamById);

// Update an exam
router.put(
  "/update/:examId",
  auth(UserRole.admin, UserRole.moderator),
  ExamControllers.updateExam
);

// Delete an exam
router.delete(
  "/delete/:examId",
  auth(UserRole.admin, UserRole.moderator),
  ExamControllers.deleteExam
);

export const ExamRoutes = router;
