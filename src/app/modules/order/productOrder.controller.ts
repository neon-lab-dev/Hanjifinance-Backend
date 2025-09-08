import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./productOrder.service";

// Create order (customer)
const createProductOrder = catchAsync(async (req, res) => {
  const result = await OrderService.createProductOrder(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

// Get all orders (Admin/Moderator)
const getAllProductOrders = catchAsync(async (req, res) => {
  const { keyword, status, page = "1", limit = "10" } = req.query;

  const result = await OrderService.getAllProductOrders(
    keyword as string,
    status as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Orders fetched successfully",
    data: {
      products: result.data,
      pagination: result.meta,
    },
  });
});

// Get single order by ID
const getSingleProductOrderById = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await OrderService.getSingleProductOrderById(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order fetched successfully",
    data: result,
  });
});

// Get all orders for a particular user
const getProductOrdersByUserId = catchAsync(async (req, res) => {
  const { userCustomId } = req.params;
  const result = await OrderService.getProductOrdersByUserId(userCustomId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders fetched successfully",
    data: result,
  });
});

// Get logged-in user's orders (user)
const getMyProductOrders = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await OrderService.getMyProductOrders(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My orders fetched successfully",
    data: result,
  });
});

// Update delivery status (Admin/Moderator)
const updateDeliveryStatus = catchAsync(async (req, res) => {
  const result = await OrderService.updateDeliveryStatus(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status changed successfully",
    data: result,
  });
});

export const OrderControllers = {
  createProductOrder,
  getAllProductOrders,
  getSingleProductOrderById,
  getProductOrdersByUserId,
  getMyProductOrders,
  updateDeliveryStatus,
};
