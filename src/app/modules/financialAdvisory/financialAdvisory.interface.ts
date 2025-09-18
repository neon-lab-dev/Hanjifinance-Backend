import { Types } from "mongoose";

export type TFinancialAdvisory = {
  user: Types.ObjectId;
  name: string;
  email : string;
  phoneNumber: string;
  age:string;
  income: string;
  liabilities: string;
  stockHoldings?: number;
  financialGoals: string;
  financialGoalDate?: string;
  marketVolatilityComfortLevel: string;
  createdAt?: Date;
  updatedAt?: Date;
};