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
exports.AdminStatsService = void 0;
const boardroomBanter_model_1 = require("../../boardroomBanter/boardroomBanter.model");
const category_model_1 = __importDefault(require("../../category/category.model"));
const chatAndChill_model_1 = __importDefault(require("../../chatAndChill/chatAndChill.model"));
const helpdesk_model_1 = __importDefault(require("../../helpdesk/helpdesk.model"));
const newsletter_model_1 = __importDefault(require("../../newsletter/newsletter.model"));
const courseOrder_model_1 = require("../../order/courseOrder/courseOrder.model");
const productOrder_model_1 = require("../../order/productOrder/productOrder.model");
const couponCode_model_1 = __importDefault(require("../couponCode/couponCode.model"));
const course_model_1 = __importDefault(require("../course/course.model"));
const product_model_1 = __importDefault(require("../product/product.model"));
const getPlatformOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalNewsletters, totalCategories, totalProducts, totalProductOrders, totalCourses, totalCourseOrders, totalConsultations, totalSubscriptions, totalCoupons, totalPendingQueries,] = yield Promise.all([
        newsletter_model_1.default.countDocuments(),
        category_model_1.default.countDocuments(),
        product_model_1.default.countDocuments(),
        productOrder_model_1.ProductOrder.countDocuments(),
        course_model_1.default.countDocuments(),
        courseOrder_model_1.CourseOrder.countDocuments(),
        chatAndChill_model_1.default.countDocuments(),
        boardroomBanter_model_1.BoardRoomBanterSubscription.countDocuments(),
        couponCode_model_1.default.countDocuments(),
        helpdesk_model_1.default.countDocuments({ status: "pending" }),
    ]);
    return {
        totalNewsletters,
        totalCategories,
        totalProducts,
        totalProductOrders,
        totalCourses,
        totalCourseOrders,
        totalConsultations,
        totalSubscriptions,
        totalCoupons,
        totalPendingQueries,
    };
});
exports.AdminStatsService = {
    getPlatformOverview,
};
