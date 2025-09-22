/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../../errors/AppError";
import httpStatus from "http-status";
import { CourseOrder } from "./courseOrder.model";
import { razorpay } from "../../../utils/razorpay";
import { User } from "../../auth/auth.model";
import { ActivityServices } from "../../activities/activities.services";
import Course from "../../admin/course/course.model";
import { Types } from "mongoose";

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
const createCourseOrder = async (
  user: any,
  payload: {
    courses: { courseId: Types.ObjectId }[];
    totalAmount: number;
    orderType: "single" | "bundle";
  }
) => {
  if (!payload.courses || payload.courses.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "No courses provided");
  }

  const userData = await User.findById(user?._id);
  if (!userData) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  // Extract course IDs from payload
  const courseIds = payload.courses.map((c) => c.courseId);

  // Fetching all courses by ids
  const courses = await Course.find({ _id: { $in: courseIds } });

  if (!courses || courses.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Courses not found");
  }

  const orderId = generateOrderId();

  // Map courses to objects for DB
  const coursesData = courses.map((c) => ({
    courseId: c._id,
    courseTitle: c.title,
    coursePrice: c.discountedPrice,
  }));

  const orderData = {
    orderId,
    userId: user._id,
    userCustomId: user.userId,
    name: userData.name,
    email: userData.email,
    phoneNumber: userData.phoneNumber,
    courses: coursesData,
    totalAmount: payload.totalAmount,
    orderType: payload.orderType,
  };

  const order = await CourseOrder.create(orderData);

   // Update purchasedCourses in User
  for (const course of coursesData) {
    const alreadyPurchased = userData.purchasedCourses!.some(
      (p) => p.courseId.toString() === course.courseId.toString()
    );

    if (!alreadyPurchased) {
      userData.purchasedCourses!.push({
        courseId: course.courseId,
        isAttendedOnExam: false,
        isPassed: false,
        examLimitLeft: 3,
        score: 0,
      });
    }
  }

  await userData.save();

  // Add activity for each course
  for (const course of coursesData) {
    await ActivityServices.addActivity({
      userId: user._id,
      title: `Purchased Course`,
      description: `You've purchased ${course.courseTitle} course for ₹${course.coursePrice}`,
    });
  }

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
const getMyCourseOrders = async (
  userId: string,
  keyword?: string,
  status?: string,
  page = 1,
  limit = 10
) => {
  const query: any = { userId };

  if (keyword) {
    query.$or = [{ orderId: { $regex: keyword, $options: "i" } }];
  }

  if (status && status !== "all") {
    query.status = { $regex: status, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    CourseOrder.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("courses.courseId", "imageUrl tagline subtitle"),
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

export const CourseOrderService = {
  checkout,
  verifyPayment,
  createCourseOrder,
  getAllCourseOrders,
  getSingleCourseOrderById,
  getCourseOrdersByUserId,
  getMyCourseOrders,
};
