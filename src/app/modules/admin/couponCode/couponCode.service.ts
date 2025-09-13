/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import CouponCode from "./couponCode.model";

// Add Coupon Code
const addCouponCode = async (payload: any) => {
  const payloadData = {
    code: payload.couponCode, // store as "code"
  };

  const coupon = await CouponCode.create(payloadData);
  return coupon;
};

// Get All Coupon Codes
const getAllCouponCodes = async (
  keyword: string,
  page: number,
  limit: number
) => {
  const query: any = {};
  const skip = (page - 1) * limit;

  // Search filter
  if (keyword) {
    query.$or = [{ code: { $regex: keyword, $options: "i" } }];
  }

  const [data, total] = await Promise.all([
    CouponCode.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    CouponCode.countDocuments(query),
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

// Delete Coupon Code
const deleteCouponCode = async (couponCodeId: string) => {
  const coupon = await CouponCode.findByIdAndDelete(couponCodeId);
  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon code not found");
  }
  return coupon;
};

const validateCouponCode = async (code: string) => {
  const coupon = await CouponCode.findOne({ code });

  if (!coupon) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid coupon code");
  }

  return coupon;
};

export const CouponCodeService = {
  addCouponCode,
  getAllCouponCodes,
  deleteCouponCode,
  validateCouponCode,
};
