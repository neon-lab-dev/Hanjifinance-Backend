import { Router } from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "../../auth/auth.constants";
import { ProductOrderControllers } from "./productOrder.controller";

const router = Router();

router.post("/checkout", auth(UserRole.admin, UserRole.moderator, UserRole.user), ProductOrderControllers.checkout);
router.post("/verify-payment", ProductOrderControllers.verifyPayment);
router.post("/create", auth(UserRole.admin, UserRole.moderator, UserRole.user), ProductOrderControllers.createProductOrder);
router.get("/my-orders", auth(UserRole.admin, UserRole.moderator, UserRole.user), ProductOrderControllers.getMyProductOrders);

// For admin/moderator only
router.get("/", auth(UserRole.admin, UserRole.moderator), ProductOrderControllers.getAllProductOrders);
router.get("/:orderId", auth(UserRole.admin, UserRole.moderator), ProductOrderControllers.getSingleProductOrderById);
router.get("/user/:userCustomId", auth(UserRole.admin, UserRole.moderator), ProductOrderControllers.getProductOrdersByUserId);
router.put("/update-status", auth(UserRole.admin, UserRole.moderator), ProductOrderControllers.updateDeliveryStatus);

export const ProductOrderRoutes = router;