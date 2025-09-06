import { Router } from "express";
import { AuthRoute } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/users/users.route";
import { CourseRoutes } from "../modules/admin/course/course.route";
import { CourseLectureRoutes } from "../modules/admin/courseLecture/courseLecture.route";
import { ProductRoutes } from "../modules/admin/product/product.route";
import { OrderRoutes } from "../modules/order/order.route";
import { BoardRoomBanterSubscriptionRoutes } from "../modules/boardroomBanter/boardroomBanter.route";
import { PaymentRoutes } from "../modules/payment/payment.route";

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
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/boardroom-banter-subscription",
    route: BoardRoomBanterSubscriptionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;