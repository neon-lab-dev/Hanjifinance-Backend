"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityRoutes = void 0;
const express_1 = __importDefault(require("express"));
const availability_controller_1 = require("./availability.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const auth_constants_1 = require("../../auth/auth.constants");
const router = express_1.default.Router();
// Create availability
router.post("/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), availability_controller_1.AvailabilityControllers.addAvailability);
// Get all availability slots
router.get("/", availability_controller_1.AvailabilityControllers.getAllAvailabilities);
// Get single availability by ID
router.get("/:availabilityId", availability_controller_1.AvailabilityControllers.getSingleAvailabilityById);
// Delete availability
router.delete("/:availabilityId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), availability_controller_1.AvailabilityControllers.deleteAvailability);
exports.AvailabilityRoutes = router;
