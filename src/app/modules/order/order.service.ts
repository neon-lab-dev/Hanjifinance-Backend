/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TOrder } from "./order.interface";
import { Order } from "./order.model";
import { razorpay } from "../../utils/razorpay";
import Product from "../admin/product/product.model";

const generateOrderId = () => {
  return "HFP-" + Math.floor(1000 + Math.random() * 9000);
};

// Create Razorpay order

export const createOrder = async (payload: TOrder) => {
  const productIds = payload.orderedItems.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== payload.orderedItems.length) {
    throw new Error("Some products not found");
  }
  const orderId = generateOrderId();

  // Creating Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: payload.totalAmount * 100, // in paisa
    currency: "INR",
  });

  const payloadData = {
    orderId,
    userId: payload.userId,
    items: payload.orderedItems,
    totalAmount: payload.totalAmount,
    status: "pending",
    razorpayOrderId: razorpayOrder.id,
  };

  const order = await Order.create(payloadData);

  return { order };
};

// Verify payment
export const verifyPayment = async (razorpayOrderId: string) => {
  if (!razorpayOrderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Razorpay order id");
  }

  const order = await Order.findOneAndUpdate(
    { razorpayOrderId },
    { status: "paid" },
    { new: true }
  );

  if (!order) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Order not found for this Razorpay order id"
    );
  }

  return order;
};

// Get all orders
const getAllOrders = async (
  keyword?: string,
  status?: string,
  page = 1,
  limit = 10
) => {
  const query: any = {};

  // Search filter
  if (keyword) {
    query.$or = [{ orderId: { $regex: keyword, $options: "i" } }];
  }

  // Status filter
  if (status && status !== "all") {
    query.status = { $regex: status, $options: "i" };
  }

  // Pagination
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query).skip(skip).limit(limit),
    Order.countDocuments(query),
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

// Get single order by ID
const getSingleOrderById = async (orderId: string) => {
  const result = await Order.findOne({orderId});
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  return result;
};

export const OrderService = {
  createOrder,
  verifyPayment,
  getAllOrders,
  getSingleOrderById,
};
