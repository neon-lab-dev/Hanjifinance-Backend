import { Router } from "express";
import { OrderControllers } from "./order.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = Router();

router.post("/create", auth(UserRole.admin, UserRole.moderator, UserRole.user), OrderControllers.createOrder);
router.post("/verify", auth(UserRole.admin, UserRole.moderator, UserRole.user), OrderControllers.verifyPayment);
// For admin/moderator only
router.get("/", auth(UserRole.admin, UserRole.moderator), OrderControllers.getAllOrders);
router.get("/:orderId", auth(UserRole.admin, UserRole.moderator), OrderControllers.getSingleOrderById);

export const OrderRoutes = router;
