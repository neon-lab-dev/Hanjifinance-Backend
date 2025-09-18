import { Schema, model } from "mongoose";
import { TFinancialAdvisory } from "./financialAdvisory.interface";

const FinancialAdvisorySchema = new Schema<TFinancialAdvisory>(
  {
    user: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

const FinancialAdvisory = model<TFinancialAdvisory>(
  "FinancialAdvisory",
  FinancialAdvisorySchema
);

export default FinancialAdvisory;
