"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpDeskRoutes = void 0;
const express_1 = __importDefault(require("express"));
const helpdesk_controller_1 = require("./helpdesk.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
router.post("/raise-query", (0, auth_1.default)(auth_constants_1.UserRole.user, auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), multer_config_1.multerUpload.single("file"), helpdesk_controller_1.HelpDeskControllers.raiseQuery);
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), helpdesk_controller_1.HelpDeskControllers.getAllQueries);
router.get("/my-queries", (0, auth_1.default)(auth_constants_1.UserRole.user, auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), helpdesk_controller_1.HelpDeskControllers.getMyQueries);
router.get("/:queryId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator, auth_constants_1.UserRole.user), helpdesk_controller_1.HelpDeskControllers.getSingleQueryById);
router.patch("/update-status/:queryId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), helpdesk_controller_1.HelpDeskControllers.updateQueryStatus);
router.delete("/delete/:queryId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator, auth_constants_1.UserRole.user), helpdesk_controller_1.HelpDeskControllers.deleteQuery);
exports.HelpDeskRoutes = router;
