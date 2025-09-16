import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";
import { ActivityControllers } from "./activities.controller";

const router = express.Router();

router.post(
  "/add",
  auth(UserRole.admin, UserRole.moderator, UserRole.user),
  ActivityControllers.addActivity
);

router.get("/", auth(UserRole.admin, UserRole.moderator), ActivityControllers.getAllActivities);

router.get("/my-activities", auth(UserRole.admin, UserRole.moderator, UserRole.user), ActivityControllers.getActivitiesByUserId);

export const ActivityRoutes = router;
