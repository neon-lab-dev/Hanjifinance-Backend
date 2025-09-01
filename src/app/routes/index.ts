import { Router } from "express";
import { AuthRoute } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/users/users.route";
import { CourseRoutes } from "../modules/admin/course/course.route";
import { CourseLectureRoutes } from "../modules/admin/courseLecture/courseLecture.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/course",
    route: CourseRoutes,
  },
  {
    path: "/course-lecture",
    route: CourseLectureRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;