"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamRoutes = void 0;
const express_1 = __importDefault(require("express"));
const exam_controller_1 = require("./exam.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
// Create a new exam
router.post("/create", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), exam_controller_1.ExamControllers.createExam);
// Get all exams
router.get("/", exam_controller_1.ExamControllers.getAllExams);
// Get single exam by ID
router.get("/:courseId", exam_controller_1.ExamControllers.getSingleExamByCourseId);
router.get("/:examId", exam_controller_1.ExamControllers.getSingleExamById);
// Update an exam
router.put("/update/:examId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), exam_controller_1.ExamControllers.updateExam);
// Delete an exam
router.delete("/delete/:examId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), exam_controller_1.ExamControllers.deleteExam);
exports.ExamRoutes = router;
