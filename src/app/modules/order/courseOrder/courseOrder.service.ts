/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../../errors/AppError";
import httpStatus from "http-status";
import { TCourseOrder } from "./courseOrder.interface";
import { CourseOrder } from "./courseOrder.model";
import { razorpay } from "../../../utils/razorpay";
import { User } from "../../auth/auth.model";
import Course from "../../admin/course/course.model";

const generateOrderId = () => {
  return "HFCO-" + Math.floor(1000 + Math.random() * 9000);
};

const checkout = async (amount: number) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: amount * 100, //in paisa
    currency: "INR",
  });

  return razorpayOrder;
};

// Verify payment
const verifyPayment = async (razorpayPaymentId: string) => {
  return `${process.env.PAYMENT_REDIRECT_URL}-success?type=course&orderId=${razorpayPaymentId}`;
};

// Create course order
const createCourseOrder = async (user: any, payload: TCourseOrder) => {
  const orderId = generateOrderId();
  const userData = await User.findById(user?._id);
  const courseData = await Course.findById(payload.courseId);

  const payloadData: Partial<TCourseOrder> = {
    orderId,
    userId: user?._id,
    name: userData?.name,
    email: userData?.email,
    phoneNumber: userData?.phoneNumber,
    userCustomId: user?.userId,
    courseId: payload.courseId,
    courseTitle: courseData?.title,
    coursePrice: courseData?.discountedPrice,
    totalAmount: payload.totalAmount,
  };

  const order = await CourseOrder.create(payloadData);
  return order;
};

// Get all course orders (Admin/Moderator)
const getAllCourseOrders = async (keyword?: string, page = 1, limit = 10) => {
  const query: any = {};

  if (keyword) {
    const regex = { $regex: keyword, $options: "i" };
    query.$or = [
      { orderId: regex },
      { name: regex },
      { email: regex },
      { phoneNumber: regex },
    ];
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    CourseOrder.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    CourseOrder.countDocuments(query),
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: orders,
  };
};

// Get single course
const getSingleCourseOrderById = async (orderId: string) => {
  const result = await CourseOrder.findOne({ orderId });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Course order not found");
  }
  return result;
};

// Get all course orders for a particular user
const getCourseOrdersByUserId = async (userCustomId: string) => {
  const result = await CourseOrder.find({ userCustomId });
  if (!result || result.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No course orders found for this user"
    );
  }
  return result;
};

// Get my course orders (logged-in user)
const getMyCourseOrders = async (userId: string) => {
  const result = await CourseOrder.find({ userId });
  return result;
};

export const CourseOrderService = {
  checkout,
  verifyPayment,
  createCourseOrder,
  getAllCourseOrders,
  getSingleCourseOrderById,
  getCourseOrdersByUserId,
  getMyCourseOrders,
};
