"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FinancialAdvisorySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: String,
        required: true,
    },
    income: {
        type: String,
        required: true,
    },
    liabilities: {
        type: String,
        required: true,
    },
    stockHoldings: {
        type: Number,
        default: 0,
    },
    financialGoals: {
        type: String,
        required: true,
    },
    financialGoalDate: {
        type: String,
    },
    marketVolatilityComfortLevel: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const FinancialAdvisory = (0, mongoose_1.model)("FinancialAdvisory", FinancialAdvisorySchema);
exports.default = FinancialAdvisory;
