/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Course from "./course.model";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { TCourse } from "./course.interface";

// Add course (admin only)
const addCourse = async (
  payload: TCourse,
  file: Express.Multer.File | undefined
) => {
  let imageUrl = "";

  if (file) {
    const imageName = `${payload.name}-${Date.now()}`;
    const path = file.path;

    const { secure_url } = await sendImageToCloudinary(imageName, path);
    imageUrl = secure_url;
  }

  const payloadData = {
    ...payload,
    imageUrl,
  };

  const result = await Course.create(payloadData);
  return result;
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
  payload: Partial<TCourse>,
  file: any
) => {
  const existing = await Course.findById(id);

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }

  let imageUrl: string | undefined;

  if (file) {
    const imageName = `${payload?.name || existing.name}-${Date.now()}`;
    const path = file.path;

    const { secure_url } = await sendImageToCloudinary(imageName, path);
    imageUrl = secure_url;
  }

  const updatePayload: Partial<TCourse> = {
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
  addCourse,
  getAllCourses,
  getSingleCourseById,
  updateCourse,
  deleteCourse,
};
