import { Types } from "mongoose";

export type TAvailability = {
  date: Date;
  slot?: string;
  isBooked: boolean;
  isAvailable?: boolean;
  user?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};
