import { Router } from "express";
import { AuthRoute } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/users/users.route";
import { CourseRoutes } from "../modules/admin/course/course.route";
import { CourseLectureRoutes } from "../modules/admin/courseLecture/courseLecture.route";
import { ProductRoutes } from "../modules/admin/product/product.route";
import { BoardRoomBanterSubscriptionRoutes } from "../modules/boardroomBanter/boardroomBanter.route";
import { ProductOrderRoutes } from "../modules/order/productOrder/productOrder.route";
import { ChatAndChillRoutes } from "../modules/chatAndChill/chatAndChill.route";
import { AvailabilityRoutes } from "../modules/admin/availability/availability.route";
import { CourseOrderRoutes } from "../modules/order/courseOrder/courseOrder.route";
import { NewsletterRoutes } from "../modules/newsletter/newsletter.route";

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
    path: "/product-order",
    route: ProductOrderRoutes,
  },
  {
    path: "/course-order",
    route: CourseOrderRoutes,
  },
  {
    path: "/boardroom-banter-subscription",
    route: BoardRoomBanterSubscriptionRoutes,
  },
  {
    path: "/availability",
    route: AvailabilityRoutes,
  },
  {
    path: "/chat-and-chill",
    route: ChatAndChillRoutes,
  },
  {
    path: "/newsletter",
    route: NewsletterRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;