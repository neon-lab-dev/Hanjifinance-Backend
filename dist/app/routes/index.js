"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const users_route_1 = require("../modules/users/users.route");
const course_route_1 = require("../modules/admin/course/course.route");
const courseLecture_route_1 = require("../modules/admin/courseLecture/courseLecture.route");
const product_route_1 = require("../modules/admin/product/product.route");
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
        path: "/product",
        route: product_route_1.ProductRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
