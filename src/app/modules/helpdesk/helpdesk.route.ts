import express from "express";
import { HelpDeskControllers } from "./helpdesk.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.post(
  "/raise-query",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  multerUpload.single("file"),
  HelpDeskControllers.raiseQuery
);

router.get("/", auth(UserRole.admin, UserRole.moderator), HelpDeskControllers.getAllQueries);


router.get(
  "/my-queries",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  HelpDeskControllers.getMyQueries
);


router.get("/:queryId", auth(UserRole.admin, UserRole.moderator, UserRole.user), HelpDeskControllers.getSingleQueryById);

router.patch(
  "/update-status/:queryId",
  auth(UserRole.admin, UserRole.moderator),
  HelpDeskControllers.updateQueryStatus
);

router.delete(
  "/delete/:queryId",
  auth(UserRole.admin, UserRole.moderator, UserRole.user),
  HelpDeskControllers.deleteQuery
);

export const HelpDeskRoutes = router;
