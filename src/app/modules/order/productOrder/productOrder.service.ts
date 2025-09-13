/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../../errors/AppError";
import httpStatus from "http-status";
import { TProductOrder } from "./productOrder.interface";
import Product from "../../admin/product/product.model";
import { ProductOrder } from "./productOrder.model";
import { razorpay } from "../../../utils/razorpay";
import crypto from "crypto";

const generateOrderId = () => {
  return "HFPO-" + Math.floor(1000 + Math.random() * 9000);
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
const verifyPayment = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<string> => {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return `${process.env.PAYMENT_REDIRECT_URL}/failed`;
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return `${process.env.PAYMENT_REDIRECT_URL}/failed`;
  }

  // Success
  return `${process.env.PAYMENT_REDIRECT_URL}/success?orderId=${razorpayOrderId}`;
};

// Create Razorpay order
const createProductOrder = async (user: any, payload: TProductOrder) => {
  const productIds = payload.orderedItems.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== payload.orderedItems.length) {
    throw new Error("Some products not found");
  }
  const orderId = generateOrderId();

  const payloadData = {
    orderId,
    userId: user?._id,
    userCustomId: user?.userId,
    orderedItems: payload.orderedItems,
    totalAmount: payload.totalAmount,
    status: "pending",
  };

  const order = await ProductOrder.create(payloadData);

  return order;
};

// Get all orders
const getAllProductOrders = async (
  keyword?: string,
  status?: string,
  page = 1,
  limit = 10
) => {
  const query: any = {};

  // Status filter
  if (status && status !== "all") {
    query.status = { $regex: status, $options: "i" };
  }

  // Pagination
  const skip = (page - 1) * limit;

  // Base query
  let mongooseQuery = ProductOrder.find(query)
    .populate("userId", "name email phoneNumber")
    .skip(skip)
    .limit(limit);

  // Apply keyword search (orderId + user fields)
  if (keyword) {
    mongooseQuery = mongooseQuery.find({
      $or: [
        { orderId: { $regex: keyword, $options: "i" } },
        { "userId.name": { $regex: keyword, $options: "i" } },
        { "userId.email": { $regex: keyword, $options: "i" } },
        { "userId.phoneNumber": { $regex: keyword, $options: "i" } },
      ],
    });
  }

  const [orders, total] = await Promise.all([
    mongooseQuery.sort({ createdAt: -1 }),
    ProductOrder.countDocuments(query),
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
const getSingleProductOrderById = async (orderId: string) => {
  const result = await ProductOrder.findOne({ orderId });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  return result;
};

// Get all orders for a particular user
const getProductOrdersByUserId = async (userCustomId: string) => {
  const result = await ProductOrder.find({ userCustomId });
  if (!result || result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No orders found for this user");
  }
  return result;
};

// Get my orders (user)
const getMyProductOrders = async (userId: string) => {
  const result = await ProductOrder.find({ userId });
  return result;
};

// Get my orders (user)
const updateDeliveryStatus = async (payload: {
  orderId: string;
  status: string;
}) => {
  const result = await ProductOrder.findOneAndUpdate(
    { orderId: payload.orderId },
    { status: payload.status },
    { new: true }
  );
  return result;
};

export const ProductOrderService = {
  checkout,
  verifyPayment,
  createProductOrder,
  getAllProductOrders,
  getSingleProductOrderById,
  getProductOrdersByUserId,
  getMyProductOrders,
  updateDeliveryStatus,
};
