import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ActivityServices } from "./activities.services";

// Add Activity
const addActivity = catchAsync(async (req, res) => {
  const result = await ActivityServices.addActivity(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Activity added successfully",
    data: result,
  });
});

// Get All Activities
const getAllActivities = catchAsync(async (req, res) => {
  const { page = "1", limit = "10", keyword } = req.query;

  const result = await ActivityServices.getAllActivities(
    keyword as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Activities retrieved successfully",
    data: {
      activities: result.data,
      pagination: result.meta,
    },
  });
});

// Get Activities by User ID
const getActivitiesByUserId = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { page = "1", limit = "10" } = req.query;

  const result = await ActivityServices.getActivitiesByUserId(
    userId,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User activities retrieved successfully",
    data: {
      activities: result.data,
      pagination: result.meta,
    },
  });
});

export const ActivityControllers = {
  addActivity,
  getAllActivities,
  getActivitiesByUserId,
};
