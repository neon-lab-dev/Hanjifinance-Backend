import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";
import { BoardRoomBanterSubscriptionController } from "./boardroomBanter.controller";

const router = express.Router();

router.post(
  "/join-waitlist",
  auth(UserRole.user),
  BoardRoomBanterSubscriptionController.joinWaitlist
);

router.put(
  "/send-coupon-code",
  auth(UserRole.admin, UserRole.moderator),
  BoardRoomBanterSubscriptionController.sendCouponCode
);

router.post(
  "/create",
  auth(UserRole.user),
  BoardRoomBanterSubscriptionController.createSubscription
);

router.post(
  "/verify-payment",
  BoardRoomBanterSubscriptionController.verifySubscription
);

router.post(
  "/pause",
  auth(UserRole.user),
  BoardRoomBanterSubscriptionController.pauseSubscription
);

router.post(
  "/resume",
  auth(UserRole.user),
  BoardRoomBanterSubscriptionController.resumeSubscription
);

router.post(
  "/cancel",
  auth(UserRole.user),
  BoardRoomBanterSubscriptionController.cancelSubscription
);

router.get(
  "/",
  auth(UserRole.admin, UserRole.moderator),
  BoardRoomBanterSubscriptionController.getAllSubscriptions
);
router.get(
  "/:id",
  auth(UserRole.admin, UserRole.moderator),
  BoardRoomBanterSubscriptionController.getSingleSubscriptionById
);



router.get(
  "/my-subscription",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  BoardRoomBanterSubscriptionController.getMySubscription
);

router.put(
  "/update-whatsapp-status",
  auth(UserRole.admin, UserRole.moderator),
  BoardRoomBanterSubscriptionController.updateWhatsappGroupStatus
);

router.put(
  "/suspend/:userId",
  auth(UserRole.admin, UserRole.moderator),
  BoardRoomBanterSubscriptionController.suspendUser
);

router.put(
  "/withdraw-suspension/:userId",
  auth(UserRole.admin, UserRole.moderator),
  BoardRoomBanterSubscriptionController.withdrawSuspension
);

router.put(
  "/remove/:userId",
  auth(UserRole.admin, UserRole.moderator),
  BoardRoomBanterSubscriptionController.removeUser
);

router.put(
  "/re-add/:userId",
  auth(UserRole.admin, UserRole.moderator),
  BoardRoomBanterSubscriptionController.reAddUser
);

export const BoardRoomBanterSubscriptionRoutes = router;
