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

// Get all lectures
const getAllCourseLectures = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCourseLectures();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All courses fetched successfully",
    data: result,
  });
});

// Get single lecture by ID
const getSingleLectureById = catchAsync(async (req, res) => {
  const { lectureId } = req.params;
  const result = await CourseServices.getSingleLectureById(lectureId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course fetched successfully",
    data: result,
  });
});

// Get all lectures by Course ID
const getLecturesByCourseId = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.getLecturesByCourseId(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lectures fetched successfully",
    data: {
      lectures: result,
      totalLectures: result.length,
    },
  });
});

// Update lecture
const updateLecture = catchAsync(async (req, res) => {
  const file = req.file;
  const { lectureId } = req.params;

  const result = await CourseServices.updateLecture(lectureId, req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lecture updated successfully",
    data: result,
  });
});


// Delete course
const deleteCourse = catchAsync(async (req, res) => {
  const { lectureId } = req.params;
  const result = await CourseServices.deleteCourse(lectureId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course deleted successfully",
    data: result,
  });
});

export const CourseLectureControllers = {
  addCourseLecture,
  getAllCourseLectures,
  getSingleLectureById,
  getLecturesByCourseId,
  updateLecture,
  deleteCourse,
};
