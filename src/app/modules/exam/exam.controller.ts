import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ExamServices } from "./exam.services";

// Create Exam
const createExam = catchAsync(async (req, res) => {
  const result = await ExamServices.createExam(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Exam created successfully",
    data: result,
  });
});

// Get all exams
const getAllExams = catchAsync(async (req, res) => {
  const result = await ExamServices.getAllExams();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All exams fetched successfully",
    data: result,
  });
});

// Get single exam by ID
const getSingleExamById = catchAsync(async (req, res) => {
  const { examId } = req.params;
  const result = await ExamServices.getSingleExamById(examId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Exam fetched successfully",
    data: result,
  });
});

// Update exam
const updateExam = catchAsync(async (req, res) => {
  const { examId } = req.params;
  const result = await ExamServices.updateExam(examId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Exam updated successfully",
    data: result,
  });
});

// Delete exam
const deleteExam = catchAsync(async (req, res) => {
  const { examId } = req.params;
  const result = await ExamServices.deleteExam(examId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Exam deleted successfully",
    data: result,
  });
});

export const ExamControllers = {
  createExam,
  getAllExams,
  getSingleExamById,
  updateExam,
  deleteExam,
};
