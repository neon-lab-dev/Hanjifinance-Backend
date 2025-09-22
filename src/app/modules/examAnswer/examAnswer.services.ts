/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { TAnswerItem } from "./examAnswer.interface";
import AppError from "../../errors/AppError";
import Exam from "../exam/exam.model";
import { User } from "../auth/auth.model";
import ExamAnswer from "./examAnswer.model";

type AttendExamPayload = {
  examId: string;
  courseId: string;
  answers: TAnswerItem[];
};

const attendExam = async (payload: AttendExamPayload, userId: string) => {
  const { examId, courseId, answers } = payload;

  if (!examId || !Array.isArray(answers) || answers.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please provide examId and answers");
  }

  const exam = await Exam.findById(examId);
  if (!exam) throw new AppError(httpStatus.NOT_FOUND, "Exam not found");

  const user = await User.findOne({
    _id: userId,
    "purchasedCourses.courseId": exam.courseId,
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "You haven't purchased this course. Please purchase to attend the exam.");

  const course = user.purchasedCourses!.find(
    (c) => c.courseId.toString() === exam.courseId.toString()
  );

  if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not found in user's purchased courses");

  if (course.examLimitLeft <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have no remaining attempts for this exam.");
  }

  // Score calculation
  let score = 0;
  const questionMap = new Map();
  exam.questions.forEach((q) => questionMap.set(q._id.toString(), q));

  for (const ans of answers) {
    const question = questionMap.get(ans.questionId.toString());
    if (question && question.correctAnswerIndex === ans.selectedOptionIndex) {
      score++;
    }
  }

  const isPassed = score >= exam.passingMark!;

  // Save the answer
  const newAnswer = await ExamAnswer.create({
    studentId: userId,
    examId,
    courseId,
    answers,
    score,
    isPassed,
  });

  // Update user purchased course
  const updateFields: any = {
    "purchasedCourses.$.isAttendedOnExam": true,
  };
  if (isPassed) {
    updateFields["purchasedCourses.$.isPassed"] = true;
    updateFields["purchasedCourses.$.examLimitLeft"] = 0;
    updateFields["purchasedCourses.$.score"] = score;

  } else {
    updateFields["purchasedCourses.$.examLimitLeft"] = course.examLimitLeft - 1;
  }

  await User.updateOne(
    { _id: userId, "purchasedCourses.courseId": exam.courseId },
    { $set: updateFields }
  );

  return { score, isPassed, newAnswer };
};

const getAllExamAnswer = async () => {
  const answer = await ExamAnswer.find();

  if (!answer) throw new AppError(httpStatus.NOT_FOUND, "Answer not found");

  return answer;
};

const getSingleExamAnswerById = async (answerId: string) => {
  const answer = await ExamAnswer.findById(answerId)
    .populate("studentId", "full_name email")
    .populate("examId", "title")
    .populate("courseId", "title");

  if (!answer) throw new AppError(httpStatus.NOT_FOUND, "Answer not found");

  return answer;
};

export const AnswerService = {
  attendExam,
  getAllExamAnswer,
  getSingleExamAnswerById,
};
