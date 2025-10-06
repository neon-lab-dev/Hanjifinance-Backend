import express from "express";
import { NewsletterControllers } from "./newsletter.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

router.post("/subscribe", NewsletterControllers.subscribeNewsletter);
router.get("/", auth(UserRole.admin, UserRole.moderator), NewsletterControllers.getAllNewsletters);
router.get("/:id", auth(UserRole.admin, UserRole.moderator), NewsletterControllers.getSingleNewsletterById);
router.put("/:id", auth(UserRole.admin, UserRole.moderator), NewsletterControllers.updateNewsletter);
router.delete("/:id", auth(UserRole.admin, UserRole.moderator), NewsletterControllers.deleteNewsletter);

export const NewsletterRoutes = router;