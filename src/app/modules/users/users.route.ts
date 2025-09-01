// users.route.ts
import express from "express";
import { UserControllers } from "./users.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";
// import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.get("/", auth(UserRole.admin), UserControllers.getAllUser);
router.get(
  "/me",
  auth(
    UserRole.user,
    UserRole.admin,
    UserRole.moderator,
    UserRole["super-admin"]
  ),
  UserControllers.getMe
);
router.get("/:userId", UserControllers.getSingleUserById);
// UserControllers.updateProfile);

router.delete(
  "/remove-user/:userId",
  auth("admin"),
  UserControllers.deleteUser
);
router.put(
  "/make-admin/:userId",
  auth("admin"),
  UserControllers.changeUserRoleToAdmin
);
router.put(
  "/make-user/:userId",
  auth("admin"),
  UserControllers.changeUserRoleToUser
);

export const userRoutes = router;
