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
const getAllCourses = async (keyword: any, category: any) => {
  const query: any = {};

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  if (category && category !== "all") {
    query.category = { $regex: category, $options: "i" };
  }

  const result = await Course.find(query);
  return result;
};

// Get single course by ID
const getSingleCourseById = async (id: string) => {
  const result = await Course.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
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
  getAllCourses,
  getSingleCourseById,
  updateCourse,
  deleteCourse,
};
