"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpDeskControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const helpdesk_services_1 = require("./helpdesk.services");
// Raise Query
const raiseQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield helpdesk_services_1.HelpDeskServices.raiseQuery(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Query raised successfully",
        data: result,
    });
}));
// Get All Queries
const getAllQueries = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = "1", limit = "10", keyword, status } = req.query;
    const result = yield helpdesk_services_1.HelpDeskServices.getAllQueries(keyword, status, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Queries retrieved successfully",
        data: {
            queries: result.data,
            pagination: result.meta,
        },
    });
}));
// Get Single Query by ID
const getSingleQueryById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { queryId } = req.params;
    const result = yield helpdesk_services_1.HelpDeskServices.getSingleQueryById(queryId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Query retrieved successfully",
        data: result,
    });
}));
// Get My Queries (only queries raised by logged-in user)
const getMyQueries = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page = "1", limit = "10" } = req.query;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const result = yield helpdesk_services_1.HelpDeskServices.getMyQueries(userId, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My queries retrieved successfully",
        data: {
            queries: result.data,
            pagination: result.meta,
        },
    });
}));
// Update Query Status
const updateQueryStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { queryId } = req.params;
    const result = yield helpdesk_services_1.HelpDeskServices.updateQueryStatus(queryId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Query status updated successfully",
        data: result,
    });
}));
// Delete Query
const deleteQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { queryId } = req.params;
    const result = yield helpdesk_services_1.HelpDeskServices.deleteQuery(queryId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Query deleted successfully",
        data: result,
    });
}));
exports.HelpDeskControllers = {
    raiseQuery,
    getAllQueries,
    getSingleQueryById,
    getMyQueries,
    updateQueryStatus,
    deleteQuery,
};
