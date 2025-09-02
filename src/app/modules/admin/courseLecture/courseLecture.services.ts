/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import Course from "./courseLecture.model";
import { sendVideoToCloudinary } from "../../../utils/sendVideoToCloudinary ";
import { TCourseLecture } from "./courseLecture.interface";
import AppError from "../../../errors/AppError";
import { sendImageToCloudinary } from "../../../utils/sendImageToCloudinary";
import CourseLecture from "./courseLecture.model";

// Service to add a lecture with optional video
const addCourseLecture = async (
  payload: TCourseLecture,
  file?: Express.Multer.File
) => {
  let videoUrl = "";
  let videoPublicId = "";

  if (file) {
    const { secure_url, public_id } = await sendVideoToCloudinary(
      file.originalname,
      file.path
    );
    videoUrl = secure_url;
    videoPublicId = public_id;
  }

  const payloadData: Partial<TCourseLecture> = {
    ...payload,
    videoUrl,
    videoPublicId,
  };

  // Save lecture to DB
  const result = await CourseLecture.create(payloadData);
  return result;
};

export default {
  addCourseLecture,
};

// Get all courses
const getAllCourseLectures = async () => {
  const result = await CourseLecture.find();
  return result;
};

// Get single course by ID
const getSingleLectureById = async (id: string) => {
  const result = await CourseLecture.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Lecture not found");
  }
  return result;
};

const getLecturesByCourseId = async (courseId: string) => {
  const result = await CourseLecture.find({ courseId });
  if (!result || result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No lectures found for this course");
  }
  return result;
};


// Update course
const updateCourse = async (
  id: string,
  payload: Partial<TCourseLecture>,
  file: any
) => {
  const existing = await Course.findById(id);

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }

  let imageUrl: string | undefined;

  if (file) {
    const imageName = `${payload?.title || existing.title}-${Date.now()}`;
    const path = file.path;

    const { secure_url } = await sendImageToCloudinary(imageName, path);
    imageUrl = secure_url;
  }

  const updatePayload: Partial<TCourseLecture> = {
    ...payload,
    ...(imageUrl && { imageUrl }),
  };

  const result = await Course.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete course by ID
const deleteCourse = async (id: string) => {
  const result = await Course.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }
  return result;
};

export const CourseServices = {
  addCourseLecture,
  getAllCourseLectures,
  getSingleLectureById,
  getLecturesByCourseId,
  updateCourse,
  deleteCourse,
};
