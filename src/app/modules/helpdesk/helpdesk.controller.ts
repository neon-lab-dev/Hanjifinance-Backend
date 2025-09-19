import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { HelpDeskServices } from "./helpdesk.services";

// Raise Query
const raiseQuery = catchAsync(async (req, res) => {
  const result = await HelpDeskServices.raiseQuery(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Query raised successfully",
    data: result,
  });
});

// Get All Queries
const getAllQueries = catchAsync(async (req, res) => {
  const { page = "1", limit = "10", keyword, status } = req.query;

  const result = await HelpDeskServices.getAllQueries(
    keyword as string,
    status as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Queries retrieved successfully",
    data: {
      queries: result.data,
      pagination: result.meta,
    },
  });
});

// Get Single Query by ID
const getSingleQueryById = catchAsync(async (req, res) => {
  const { queryId } = req.params;
  const result = await HelpDeskServices.getSingleQueryById(queryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Query retrieved successfully",
    data: result,
  });
});

// Get My Queries (only queries raised by logged-in user)
const getMyQueries = catchAsync(async (req, res) => {
  const { page = "1", limit = "10" } = req.query;
  const userId = req.user?._id;

  const result = await HelpDeskServices.getMyQueries(
    userId,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My queries retrieved successfully",
    data: {
      queries: result.data,
      pagination: result.meta,
    },
  });
});


// Update Query Status
const updateQueryStatus = catchAsync(async (req, res) => {
  const { queryId } = req.params;

  const result = await HelpDeskServices.updateQueryStatus(queryId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Query status updated successfully",
    data: result,
  });
});

// Delete Query
const deleteQuery = catchAsync(async (req, res) => {
  const { queryId } = req.params;
  const result = await HelpDeskServices.deleteQuery(queryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Query deleted successfully",
    data: result,
  });
});

export const HelpDeskControllers = {
  raiseQuery,
  getAllQueries,
  getSingleQueryById,
  getMyQueries,
  updateQueryStatus,
  deleteQuery,
};
