import { ObjectId } from "mongoose";

export type TCourseLecture = {
  courseId: ObjectId ;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  videoPublicId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
