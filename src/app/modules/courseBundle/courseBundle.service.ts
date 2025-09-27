/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import CourseBundle from "./courseBundle.model";
import { TCourseBundle } from "./courseBundle.interface";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

// Add Course Bundle
const addCourseBundle = async (
  payload: TCourseBundle,
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

  const bundle = await CourseBundle.create(payloadData);
  return bundle;
};

// Get All Course Bundles
const getAllCourseBundles = async (keyword?: string, page = 1, limit = 10) => {
  const query: any = {};

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    CourseBundle.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({
        path: "courseId",
        select: "title subtitle discountedPrice",
      }),
    CourseBundle.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


// Get Single Course Bundle
const getSingleCourseBundle = async (bundleId: string) => {
  const bundle = await CourseBundle.findById(bundleId)
    .populate({
      path: "courseId",
      select: "title subtitle discountedPrice",
    });

  if (!bundle) {
    throw new AppError(httpStatus.NOT_FOUND, "Course bundle not found");
  }

  return bundle;
};


// Update Course Bundle
const updateCourseBundle = async (
  bundleId: string,
  payload: Partial<TCourseBundle>,
  file: any
) => {
  const existing = await CourseBundle.findById(bundleId);

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Course bundle not found");
  }

  let imageUrl: string | undefined;

  if (file) {
    const imageName = `${payload?.name || existing.name}-${Date.now()}`;
    const path = file.path;

    const { secure_url } = await sendImageToCloudinary(imageName, path);
    imageUrl = secure_url;
  }

  const updatePayload = {
    ...payload,
    ...(imageUrl && { imageUrl }),
  };

  const bundle = await CourseBundle.findByIdAndUpdate(bundleId, updatePayload, {
    new: true,
    runValidators: true,
  });

  return bundle;
};

// Delete Course Bundle
const deleteCourseBundle = async (bundleId: string) => {
  const bundle = await CourseBundle.findByIdAndDelete(bundleId);
  if (!bundle) {
    throw new AppError(httpStatus.NOT_FOUND, "Course bundle not found");
  }
  return bundle;
};

export const CourseBundleService = {
  addCourseBundle,
  getAllCourseBundles,
  getSingleCourseBundle,
  updateCourseBundle,
  deleteCourseBundle,
};