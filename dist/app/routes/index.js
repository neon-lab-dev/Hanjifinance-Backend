"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const users_route_1 = require("../modules/users/users.route");
const course_route_1 = require("../modules/admin/course/course.route");
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
        path: "/admin/course",
        route: course_route_1.CourseRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
