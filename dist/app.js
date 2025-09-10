"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notFoundHandeler_1 = __importDefault(require("./app/middlewares/notFoundHandeler"));
const globalErrorHandeler_1 = __importDefault(require("./app/middlewares/globalErrorHandeler"));
const config_1 = __importDefault(require("./app/config"));
const app = (0, express_1.default)();
// Enable cookie parsing
app.use((0, cookie_parser_1.default)());
// Middleware for parsing JSON bodies
app.use(express_1.default.json());
// app.use(express.static("./uploads"));
// Middleware for handling CORS with credentials
app.use((0, cors_1.default)({ origin: ['https://hanjifinance-web.vercel.app', 'http://localhost:5173',], credentials: true }));
// Root route
app.get('/', (req, res) => {
    res.send("Welcome onboard!");
});
app.get("/api/v1/get-key", (req, res) => res.status(200).json({ key: config_1.default.razorpay_api_key }));
// Application routes
app.use('/api/v1', routes_1.default);
app.use(notFoundHandeler_1.default);
// Global error handling middleware
app.use(globalErrorHandeler_1.default);
exports.default = app;
