import { Types } from "mongoose";

export type TCourseBundle = {
  courseId?: Types.ObjectId[];
  imageUrl?: string;
  name: string;
  price: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
