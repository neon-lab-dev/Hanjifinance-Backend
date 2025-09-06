import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";
import { BoardRoomBanterSubscriptionController } from "./boardroomBanter.controller";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  BoardRoomBanterSubscriptionController.createSubscription
);

router.post(
  "/pause",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  BoardRoomBanterSubscriptionController.pauseSubscription
);

router.post(
  "/resume",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  BoardRoomBanterSubscriptionController.resumeSubscription
);

router.get(
  "/my-subscription",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  BoardRoomBanterSubscriptionController.getMySubscription
);

export const BoardRoomBanterSubscriptionRoutes = router;
