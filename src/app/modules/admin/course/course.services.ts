/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import Course from "./course.model";
import { TCourse } from "./course.interface";
import AppError from "../../../errors/AppError";
import { sendImageToCloudinary } from "../../../utils/sendImageToCloudinary";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add course (admin only)
const addCourse = async (
  payload: TCourse,
  file: Express.Multer.File | undefined
) => {
  let imageUrl = "";

  if (file) {
    const imageName = `${payload.title}-${Date.now()}`;
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
const getAllCourses = async (
  keyword?: string,
  page = 1,
  limit = 10
) => {
  const query: any = {};

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword.trim(), $options: "i" } },
      { description: { $regex: keyword.trim(), $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [courses, total] = await Promise.all([
    Course.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Course.countDocuments(query),
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: courses,
  };
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
    const imageName = `${payload?.title || existing.title}-${Date.now()}`;
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
  const course = await Course.findById(id);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }

  // Delete course image from cloudinary if exists
  if (course.imageUrl) {
    try {
      // Extract public_id from imageUrl
      const parts = course.imageUrl.split("/");
      const filename = parts[parts.length - 1];

      // Remove extension and decode URL
      const publicId = decodeURIComponent(filename.split(".")[0]);
      console.log("Deleting Cloudinary image with publicId:", publicId);

      await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary image deleted successfully");
    } catch (err) {
      console.error("Error deleting Cloudinary image:", err);
    }
  }

  // Delete course from DB
  const result = await Course.findByIdAndDelete(id);

  return result;
};

export const CourseServices = {
  addCourse,
  getAllCourses,
  getSingleCourseById,
  updateCourse,
  deleteCourse,
};
