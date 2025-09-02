/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { sendVideoToCloudinary } from "../../../utils/sendVideoToCloudinary ";
import { TCourseLecture } from "./courseLecture.interface";
import AppError from "../../../errors/AppError";
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
const updateLecture = async (
  id: string,
  payload: Partial<TCourseLecture>,
  file?: Express.Multer.File
) => {
  const existing = await CourseLecture.findById(id);

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Lecture not found");
  }

  let videoUrl: string | undefined;
  let videoPublicId: string | undefined;

  if (file) {
    const { secure_url, public_id } = await sendVideoToCloudinary(
      file.originalname,
      file.path
    );
    videoUrl = secure_url;
    videoPublicId = public_id;
  }

  const updatePayload: Partial<TCourseLecture> = {
    ...payload,
    ...(videoUrl && { videoUrl }),
    ...(videoPublicId && { videoPublicId }),
  };

  const result = await CourseLecture.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  });

  return result;
};


// Delete course by ID
const deleteLecture = async (id: string) => {
  const result = await CourseLecture.findByIdAndDelete(id);
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
  updateLecture,
  deleteLecture,
};
