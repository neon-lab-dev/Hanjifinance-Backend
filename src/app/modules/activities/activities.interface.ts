import { Types } from "mongoose";

export type TActivity = {
  userId : Types.ObjectId;
  title : string;
  description : string;
  createdAt?: Date;
  updatedAt?: Date;
};