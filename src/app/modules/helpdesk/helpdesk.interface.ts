import { ObjectId } from "mongoose";

export type THelpDesk = {
  imageUrl?: string;
  userId:ObjectId;
  userCustomId: string;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  status: "pending" | "resolved";
  createdAt?: Date;
  updatedAt?: Date;
};
