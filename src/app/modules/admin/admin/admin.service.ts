import { BoardRoomBanterSubscription } from "../../boardroomBanter/boardroomBanter.model";
import Category from "../../category/category.model";
import ChatAndChill from "../../chatAndChill/chatAndChill.model";
import HelpDesk from "../../helpdesk/helpdesk.model";
import Newsletter from "../../newsletter/newsletter.model";
import { CourseOrder } from "../../order/courseOrder/courseOrder.model";
import { ProductOrder } from "../../order/productOrder/productOrder.model";
import CouponCode from "../couponCode/couponCode.model";
import Course from "../course/course.model";
import Product from "../product/product.model";

const getPlatformOverview = async () => {
  const [
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
  ] = await Promise.all([
    Newsletter.countDocuments(),
    Category.countDocuments(),
    Product.countDocuments(),
    ProductOrder.countDocuments(),
    Course.countDocuments(),
    CourseOrder.countDocuments(),
    ChatAndChill.countDocuments(),
    BoardRoomBanterSubscription.countDocuments(),
    CouponCode.countDocuments(),
    HelpDesk.countDocuments({ status: "pending" }),
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
};

export const AdminStatsService = {
  getPlatformOverview,
};
