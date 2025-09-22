import express from "express";
import { AnswerController } from "./examAnswer.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

// Student attends an exam
router.post(
  "/attend",
  auth(UserRole.user , UserRole.admin, UserRole.moderator),
  AnswerController.attendExam
);

// Get all exam answers
router.get(
  "/",
  auth(UserRole.admin, UserRole.moderator),
  AnswerController.getAllExamAnswer
);

// Get single exam answer
router.get(
  "/:answerId",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  AnswerController.getSingleExamAnswerById
);

export const ExamAnswerRoutes = router;