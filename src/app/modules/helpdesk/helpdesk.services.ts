/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import HelpDesk from "./helpdesk.model";
import { THelpDesk } from "./helpdesk.interface";

// Raise a Query
const raiseQuery = async (user: any, payload: THelpDesk) => {
  const payloadData = {
    message: payload?.message,
    userId: user?._id,
    name: user?.name,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    status: "pending",
  };
  return await HelpDesk.create(payloadData);
};

// Get All Queries
const getAllQueries = async (
  keyword?: string,
  status?: string,
  page = 1,
  limit = 10
) => {
  const query: any = {};

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { phoneNumber: { $regex: keyword, $options: "i" } },
    ];
  }

  if (status && status !== "all") {
    query.status = { $regex: status, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    HelpDesk.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    HelpDesk.countDocuments(query),
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

// Get Single Query by ID
const getSingleQueryById = async (id: string) => {
  const result = await HelpDesk.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Query not found");
  }
  return result;
};

// Get Queries of logged-in user
const getMyQueries = async (userId: string, page = 1, limit = 10) => {
  const query: any = { userId };

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    HelpDesk.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    HelpDesk.countDocuments(query),
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

// Update Query Status
const updateQueryStatus = async (id: string, payload: any) => {
  const isExist = await HelpDesk.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Query not found");
  }

  const status = payload?.status;

  const result = await HelpDesk.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Query not found");
  }

  return isExist;
};

// Delete Query
const deleteQuery = async (id: string) => {
  const result = await HelpDesk.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Query not found");
  }
  return result;
};

export const HelpDeskServices = {
  raiseQuery,
  getAllQueries,
  getSingleQueryById,
  getMyQueries,
  updateQueryStatus,
  deleteQuery,
};
