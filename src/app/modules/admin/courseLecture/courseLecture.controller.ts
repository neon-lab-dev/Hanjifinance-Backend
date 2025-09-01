import httpStatus from "http-status";
import { CourseServices } from "./courseLecture.services";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

// Add course lecture
const addCourseLecture = catchAsync(async (req, res) => {
  const file = req.file;
  const result = await CourseServices.addCourseLecture(req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course added successfully",
    data: result,
  });
});

// Get all courses
const getAllCourses = catchAsync(async (req, res) => {
  const { keyword, category } = req.query;
  const result = await CourseServices.getAllCourses(keyword, category);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All courses fetched successfully",
    data: result,
  });
});

// Get single course by ID
const getSingleCourseById = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.getSingleCourseById(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course fetched successfully",
    data: result,
  });
});

// Update course
const updateCourse = catchAsync(async (req, res) => {
  const file = req.file;
  const { courseId } = req.params;
  const result = await CourseServices.updateCourse(courseId, req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});

// Delete course
const deleteCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.deleteCourse(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course deleted successfully",
    data: result,
  });
});

export const CourseControllers = {
  addCourseLecture,
  getAllCourses,
  getSingleCourseById,
  updateCourse,
  deleteCourse,
};
