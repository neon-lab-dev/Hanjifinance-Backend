import { ObjectId } from "mongoose";

export type THelpDesk = {
  userId:ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  status: "pending" | "resolved";
  createdAt?: Date;
  updatedAt?: Date;
};
