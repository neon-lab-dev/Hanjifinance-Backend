import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ChatAndChillService } from "./chatAndChill.service";

// Checkout
const checkout = catchAsync(async (req, res) => {
  const { amount } = req.body;
  const razorpayOrder = await ChatAndChillService.checkout(amount);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiated successfully",
    data: razorpayOrder,
  });
});

// Verify payment
const verifyPayment = catchAsync(async (req, res) => {
  const {
    //  razorpay_order_id,
    razorpay_payment_id,
    // razorpay_signature
  } = req.body;

  const redirectUrl = await ChatAndChillService.verifyPayment(
    // razorpay_order_id,
    razorpay_payment_id
    // razorpay_signature
  );

  return res.redirect(redirectUrl);
});

// Book a Chat & Chill session
const bookChatAndChill = catchAsync(async (req, res) => {
  const result = await ChatAndChillService.bookChatAndChill(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Chat & Chill booked successfully. Please wait for admin to schedule a meeting.",
    data: result,
  });
});

// Get all bookings (Admin/Moderator)
const getAllBookings = catchAsync(async (req, res) => {
  const { keyword, status, page = "1", limit = "10" } = req.query;

  const result = await ChatAndChillService.getAllBookings(
    keyword as string,
    status as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All bookings fetched successfully",
    data: {
      bookings: result.data,
      pagination: result.meta,
    },
  });
});

// Get single booking by ID
const getSingleBookingById = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const result = await ChatAndChillService.getSingleBookingById(bookingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking fetched successfully",
    data: result,
  });
});

// Get all bookings for a particular user
const getBookingsByUserId = catchAsync(async (req, res) => {
  const { userCustomId } = req.params;
  const result = await ChatAndChillService.getBookingsByUserId(userCustomId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings fetched successfully",
    data: result,
  });
});

// Get logged-in user's bookings (user)
const getMyBookings = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { page = "1", limit = "5" } = req.query;

  const result = await ChatAndChillService.getMyBookings(
    userId,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My bookings fetched successfully",
    data: {
      bookings: result.data,
      pagination: result.meta,
    },
  });
});

// Update booking status (pending, booked, scheduled)
const updateBookingStatus = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const result = await ChatAndChillService.updateBookingStatus(
    bookingId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking status updated successfully",
    data: result,
  });
});

// Schedule a meeting (update scheduledAt + mark as scheduled)
const scheduleMeeting = catchAsync(async (req, res) => {
  const { bookingId, meetingLink } = req.body;

  const result = await ChatAndChillService.scheduleMeeting(
    bookingId,
    meetingLink
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meeting scheduled successfully",
    data: result,
  });
});

export const ChatAndChillControllers = {
  checkout,
  verifyPayment,
  bookChatAndChill,
  getAllBookings,
  getSingleBookingById,
  getBookingsByUserId,
  getMyBookings,
  updateBookingStatus,
  scheduleMeeting,
};
