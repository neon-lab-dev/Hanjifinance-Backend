/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import Exam from "./exam.model";
import { TExam } from "./exam.interface";
import AppError from "../../errors/AppError";

// Create exam
const createExam = async (payload: TExam) => {
  if (
    !payload.courseId ||
    !payload.title ||
    !payload.questions ||
    !Array.isArray(payload.questions) ||
    payload.questions.length === 0
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please provide course Id, title, and at least one question"
    );
  }

  // Validate questions
  for (const question of payload.questions) {
    if (
      !question.questionText ||
      !Array.isArray(question.options) ||
      question.options.length < 2 ||
      typeof question.correctAnswerIndex !== "number"
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid question format");
    }
  }

  const exam = await Exam.create(payload);
  return exam;
};

// Get all exams
const getAllExams = async () => {
  const result = await Exam.find().populate("courseId");
  return result;
};

// Get single exam by ID
const getSingleExamById = async (id: string) => {
  const result = await Exam.findById(id).populate("courseId");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam not found");
  }
  return result;
};

// Get single exam by ID
const getSingleExamByCourseId = async (courseId: string) => {
  const result = await Exam.findOne({  courseId });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam not found");
  }

  return result;
};


// Update exam
const updateExam = async (id: string, payload: Partial<TExam>) => {
  const existing = await Exam.findById(id);
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam not found");
  }

  if (payload.questions && payload.questions.length > 0) {
    for (const question of payload.questions) {
      if (
        !question.questionText ||
        !Array.isArray(question.options) ||
        question.options.length < 2 ||
        typeof question.correctAnswerIndex !== "number"
      ) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid question format");
      }
    }

    return await Exam.findByIdAndUpdate(
      id,
      { $push: { questions: { $each: payload.questions } } },
      { new: true, runValidators: true }
    );
  }

  const result = await Exam.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete exam
const deleteExam = async (id: string) => {
  const exam = await Exam.findById(id);
  if (!exam) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam not found");
  }

  const result = await Exam.findByIdAndDelete(id);
  return result;
};

export const ExamServices = {
  createExam,
  getAllExams,
  getSingleExamById,
  getSingleExamByCourseId,
  updateExam,
  deleteExam,
};
