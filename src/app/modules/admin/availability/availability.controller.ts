import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AvailabilityService } from "./availability.service";

// ✅ Add Availability (Admin)
const addAvailability = catchAsync(async (req, res) => {
  const result = await AvailabilityService.addAvailability(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Availability added successfully",
    data: result,
  });
});

// ✅ Get All Availabilities (Admin/User)
const getAllAvailabilities = catchAsync(async (req, res) => {
  const { date, page = "1", limit = "10" } = req.query;

  const result = await AvailabilityService.getAllAvailabilities(
    date as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Availabilities fetched successfully",
    data: {
      availabilities: result.data,
      pagination: result.meta,
    },
  });
});

// ✅ Get Single Availability by ID
const getSingleAvailabilityById = catchAsync(async (req, res) => {
  const { availabilityId } = req.params;
  const result = await AvailabilityService.getSingleAvailabilityById(availabilityId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Availability fetched successfully",
    data: result,
  });
});

// ✅ Delete Availability
const deleteAvailability = catchAsync(async (req, res) => {
  const { availabilityId } = req.params;
  const result = await AvailabilityService.deleteAvailability(availabilityId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Availability deleted successfully",
    data: result,
  });
});

export const AvailabilityControllers = {
  addAvailability,
  getAllAvailabilities,
  getSingleAvailabilityById,
  deleteAvailability,
};
