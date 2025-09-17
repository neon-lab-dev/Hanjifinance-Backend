import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CourseBundleService } from "./courseBundle.service";

// Create a Course Bundle
const addCourseBundle = catchAsync(async (req, res) => {
  const file = req.file;
  const result = await CourseBundleService.addCourseBundle(req.body, file);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course bundle created successfully",
    data: result,
  });
});

// Get All Course Bundles (with pagination + search)
const getAllCourseBundles = catchAsync(async (req, res) => {
  const { keyword, page = "1", limit = "10" } = req.query;

  const result = await CourseBundleService.getAllCourseBundles(
    keyword as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All course bundles fetched successfully",
    data: {
      bundles: result.data,
      pagination: result.meta,
    },
  });
});

// Get Single Course Bundle
const getSingleCourseBundle = catchAsync(async (req, res) => {
  const { bundleId } = req.params;
  const result = await CourseBundleService.getSingleCourseBundle(bundleId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course bundle fetched successfully",
    data: result,
  });
});

// Update Course Bundle
const updateCourseBundle = catchAsync(async (req, res) => {
  const { bundleId } = req.params;
  const file = req.file;
  const result = await CourseBundleService.updateCourseBundle(bundleId, req.body , file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course bundle updated successfully",
    data: result,
  });
});

// Delete Course Bundle
const deleteCourseBundle = catchAsync(async (req, res) => {
  const { bundleId } = req.params;
  const result = await CourseBundleService.deleteCourseBundle(bundleId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course bundle deleted successfully",
    data: result,
  });
});

export const CourseBundleControllers = {
  addCourseBundle,
  getAllCourseBundles,
  getSingleCourseBundle,
  updateCourseBundle,
  deleteCourseBundle,
};
