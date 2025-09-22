"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamAnswerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const examAnswer_controller_1 = require("./examAnswer.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
// Student attends an exam
router.post("/attend", (0, auth_1.default)(auth_constants_1.UserRole.user, auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), examAnswer_controller_1.AnswerController.attendExam);
// Get all exam answers
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), examAnswer_controller_1.AnswerController.getAllExamAnswer);
// Get single exam answer
router.get("/:answerId", (0, auth_1.default)(auth_constants_1.UserRole.user, auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), examAnswer_controller_1.AnswerController.getSingleExamAnswerById);
exports.ExamAnswerRoutes = router;
