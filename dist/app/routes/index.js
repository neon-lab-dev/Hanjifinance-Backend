"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const users_route_1 = require("../modules/users/users.route");
const course_route_1 = require("../modules/admin/course/course.route");
const courseLecture_route_1 = require("../modules/admin/courseLecture/courseLecture.route");
const product_route_1 = require("../modules/admin/product/product.route");
const boardroomBanter_route_1 = require("../modules/boardroomBanter/boardroomBanter.route");
const productOrder_route_1 = require("../modules/order/productOrder/productOrder.route");
const chatAndChill_route_1 = require("../modules/chatAndChill/chatAndChill.route");
const availability_route_1 = require("../modules/admin/availability/availability.route");
const courseOrder_route_1 = require("../modules/order/courseOrder/courseOrder.route");
const newsletter_route_1 = require("../modules/newsletter/newsletter.route");
const couponCode_route_1 = require("../modules/admin/couponCode/couponCode.route");
const category_route_1 = require("../modules/category/category.route");
const activities_route_1 = require("../modules/activities/activities.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: users_route_1.userRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoute,
    },
    {
        path: "/course",
        route: course_route_1.CourseRoutes,
    },
    {
        path: "/course-lecture",
        route: courseLecture_route_1.CourseLectureRoutes,
    },
    {
        path: "/category",
        route: category_route_1.CategoryRoutes,
    },
    {
        path: "/product",
        route: product_route_1.ProductRoutes,
    },
    {
        path: "/product-order",
        route: productOrder_route_1.ProductOrderRoutes,
    },
    {
        path: "/course-order",
        route: courseOrder_route_1.CourseOrderRoutes,
    },
    {
        path: "/coupon-code",
        route: couponCode_route_1.CouponCodeRoutes,
    },
    {
        path: "/boardroom-banter-subscription",
        route: boardroomBanter_route_1.BoardRoomBanterSubscriptionRoutes,
    },
    {
        path: "/availability",
        route: availability_route_1.AvailabilityRoutes,
    },
    {
        path: "/chat-and-chill",
        route: chatAndChill_route_1.ChatAndChillRoutes,
    },
    {
        path: "/newsletter",
        route: newsletter_route_1.NewsletterRoutes,
    },
    {
        path: "/activity",
        route: activities_route_1.ActivityRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
