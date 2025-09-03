"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const router = (0, express_1.Router)();
router.post("/create", order_controller_1.OrderControllers.createOrder);
router.post("/verify", order_controller_1.OrderControllers.verifyPayment);
exports.OrderRoutes = router;
