import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AnswerService } from "./examAnswer.services";

const attendExam = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await AnswerService.attendExam(req.body, userId );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Exam submitted successfully",
    data: result,
  });
});

const getAllExamAnswer = catchAsync(async (req, res) => {
  const result = await AnswerService.getAllExamAnswer();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Exam answers fetched successfully",
    data: result,
  });
});

const getSingleExamAnswerById = catchAsync(async (req, res) => {
  const { answerId } = req.params;
  const result = await AnswerService.getSingleExamAnswerById(answerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Exam answer fetched successfully",
    data: result,
  });
});

export const AnswerController = {
  attendExam,
  getAllExamAnswer,
  getSingleExamAnswerById,
};
