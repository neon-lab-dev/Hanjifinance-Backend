/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TOrder } from "./order.interface";
import { Order } from "./order.model";
import Product from "../admin/product/product.model";

const generateOrderId = () => {
  return "HFP-" + Math.floor(1000 + Math.random() * 9000);
};

// Create Razorpay order
const createOrder = async (payload: TOrder) => {
  const productIds = payload.orderedItems.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== payload.orderedItems.length) {
    throw new Error("Some products not found");
  }
  const orderId = generateOrderId();

  const payloadData = {
    orderId,
    userId: payload.userId,
    userCustomId: payload.userCustomId,
    orderedItems: payload.orderedItems,
    totalAmount: payload.totalAmount,
    status: "paid",
  };

  const order = await Order.create(payloadData);

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
  const result = await Order.findOne({ orderId });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  return result;
};

// Get all orders for a particular user
const getOrdersByUserId = async (userCustomId: string) => {
  const result = await Order.find({ userCustomId });
  if (!result || result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No orders found for this user");
  }
  return result;
};


// Get my orders (user)
const getMyOrders = async (userId: string) => {
  const result = await Order.find({ userId }).populate("orderedItems.productId");
  return result;
};

// Get my orders (user)
const updateDeliveryStatus = async (payload: { orderId: string, status : string }) => {
  const result = await Order.findOneAndUpdate({ orderId : payload.orderId }, { status: payload.status }, { new: true });
  return result;
};


export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrderById,
  getOrdersByUserId,
  getMyOrders,
  updateDeliveryStatus,
};
