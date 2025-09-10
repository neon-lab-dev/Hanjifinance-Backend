"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AreaSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
}, {
    timestamps: true,
});
const Newsletter = (0, mongoose_1.model)("Newsletter", AreaSchema);
exports.default = Newsletter;
