/* eslint-disable @typescript-eslint/no-explicit-any */
import Activity from "./activities.model";
import { TActivity } from "./activities.interface";

// Create a new activity
const addActivity = async (payload: TActivity) => {
  const result = await Activity.create(payload);

  return result;
};

// Get all activities
const getAllActivities = async (keyword?: string, page = 1, limit = 10) => {
  const query: any = {};

  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Activity.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Activity.countDocuments(query),
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

// Get activities by user ID
const getActivitiesByUserId = async (userId: string, page = 1, limit = 10) => {
  const query = { userId };
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Activity.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Activity.countDocuments(query),
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

export const ActivityServices = {
  addActivity,
  getAllActivities,
  getActivitiesByUserId,
};
