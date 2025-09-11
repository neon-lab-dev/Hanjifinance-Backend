/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Newsletter from "./newsletter.model";
import { TNewsletter } from "./newsletter.interface";

// Add Newsletter
const subscribeNewsletter = async (payload: TNewsletter) => {
  const isAlreadySubscribed = await Newsletter.findOne({ email: payload.email });
  if (isAlreadySubscribed) {
    throw new AppError(httpStatus.BAD_REQUEST, "You've already subscribed.");
  }
  const result = await Newsletter.create(payload);
  return result;
};

// Get all Newsletters
const getAllNewsletters = async (keyword?: string, page = 1, limit = 10) => {
  const query: any = {};

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Newsletter.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Newsletter.countDocuments(query),
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

// Get single Newsletter by ID
const getSingleNewsletterById = async (id: string) => {
  const result = await Newsletter.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Newsletter not found");
  }
  return result;
};

// Update Newsletter
const updateNewsletter = async (id: string, payload: Partial<TNewsletter>) => {
  const existing = await Newsletter.findById(id);
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Newsletter not found");
  }

  const result = await Newsletter.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete Newsletter
const deleteNewsletter = async (id: string) => {
  const result = await Newsletter.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Newsletter not found");
  }
  return result;
};

export const NewsletterServices = {
  subscribeNewsletter,
  getAllNewsletters,
  getSingleNewsletterById,
  updateNewsletter,
  deleteNewsletter,
};
