/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import Availability from "./availability.model";
import AppError from "../../../errors/AppError";

// ✅ Add new availability
const addAvailability = async (payload: any) => {
  const payloadData = {
    date : payload.date,
    slot : payload.slot || "07:00 PM - 07:30 PM",
  }
  const availability = await Availability.create(payloadData);
  return availability;
};

// ✅ Get all availabilities (with optional filter + pagination)
const getAllAvailabilities = async (
  date: string,
  page: number,
  limit: number
) => {
  const query: any = {};

  if (date) {
    // Only match the specific day
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    query.date = { $gte: start, $lte: end };
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Availability.find(query).skip(skip).limit(limit).sort({ date: 1 }),
    Availability.countDocuments(query),
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

// ✅ Get single availability
const getSingleAvailabilityById = async (availabilityId: string) => {
  const availability = await Availability.findById(availabilityId);
  if (!availability) {
    throw new AppError(httpStatus.NOT_FOUND, "Availability not found");
  }
  return availability;
};

// ✅ Delete availability
const deleteAvailability = async (availabilityId: string) => {
  const availability = await Availability.findByIdAndDelete(availabilityId);
  if (!availability) {
    throw new AppError(httpStatus.NOT_FOUND, "Availability not found");
  }
  return availability;
};

export const AvailabilityService = {
  addAvailability,
  getAllAvailabilities,
  getSingleAvailabilityById,
  deleteAvailability,
};
