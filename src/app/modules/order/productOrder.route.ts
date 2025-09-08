import { Router } from "express";
import { OrderControllers } from "./productOrder.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = Router();

router.post("/create", auth(UserRole.admin, UserRole.moderator, UserRole.user), OrderControllers.createProductOrder);
router.get("/my-orders", auth(UserRole.admin, UserRole.moderator, UserRole.user), OrderControllers.getMyProductOrders);

// For admin/moderator only
router.get("/", auth(UserRole.admin, UserRole.moderator), OrderControllers.getAllProductOrders);
router.get("/:orderId", auth(UserRole.admin, UserRole.moderator), OrderControllers.getSingleProductOrderById);
router.get("/user/:userCustomId", auth(UserRole.admin, UserRole.moderator), OrderControllers.getProductOrdersByUserId);
router.put("/update-status", auth(UserRole.admin, UserRole.moderator), OrderControllers.updateDeliveryStatus);

export const ProductOrderRoutes = router;