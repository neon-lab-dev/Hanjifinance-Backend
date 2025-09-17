"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseBundleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const courseBundle_controller_1 = require("./courseBundle.controller");
const auth_constants_1 = require("../auth/auth.constants");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
// Add Course Bundle (Admin/Moderator only)
router.post("/create", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), multer_config_1.multerUpload.single("file"), courseBundle_controller_1.CourseBundleControllers.addCourseBundle);
// Get All Course Bundles
router.get("/", courseBundle_controller_1.CourseBundleControllers.getAllCourseBundles);
// Get Single Course Bundle
router.get("/:bundleId", courseBundle_controller_1.CourseBundleControllers.getSingleCourseBundle);
// Update Course Bundle
router.put("/update/:bundleId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), multer_config_1.multerUpload.single("file"), courseBundle_controller_1.CourseBundleControllers.updateCourseBundle);
// Delete Course Bundle
router.delete("/delete/:bundleId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), courseBundle_controller_1.CourseBundleControllers.deleteCourseBundle);
exports.CourseBundleRoutes = router;
