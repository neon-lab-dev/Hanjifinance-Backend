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
exports.NewsletterControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const newsletter_services_1 = require("./newsletter.services");
// Add Newsletter
const subscribeNewsletter = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield newsletter_services_1.NewsletterServices.subscribeNewsletter(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Newsletter subscribed successfully",
        data: result,
    });
}));
// Get all Newsletters
const getAllNewsletters = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, page = "1", limit = "10" } = req.query;
    const result = yield newsletter_services_1.NewsletterServices.getAllNewsletters(keyword, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Newsletters retrieved successfully",
        data: {
            newsletters: result.data,
            pagination: result.meta,
        },
    });
}));
// Get single Newsletter
const getSingleNewsletterById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield newsletter_services_1.NewsletterServices.getSingleNewsletterById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Newsletter retrieved successfully",
        data: result,
    });
}));
// Update Newsletter
const updateNewsletter = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield newsletter_services_1.NewsletterServices.updateNewsletter(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Newsletter updated successfully",
        data: result,
    });
}));
// Delete Newsletter
const deleteNewsletter = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield newsletter_services_1.NewsletterServices.deleteNewsletter(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Newsletter deleted successfully",
        data: result,
    });
}));
exports.NewsletterControllers = {
    subscribeNewsletter,
    getAllNewsletters,
    getSingleNewsletterById,
    updateNewsletter,
    deleteNewsletter,
};
