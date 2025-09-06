import express from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

router.post("/create", auth(UserRole.admin, UserRole.moderator, UserRole.user), PaymentController.initiatePayment);
router.post("/verify", auth(UserRole.admin, UserRole.moderator, UserRole.user), PaymentController.verifyPayment);

export const PaymentRoutes = router;