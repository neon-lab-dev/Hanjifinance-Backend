import { ObjectId } from "mongoose";

export type TCourseLecture = {
  courseId: ObjectId ;
  title: string;
  description: string;
  duration: string;
  createdAt?: Date;
  updatedAt?: Date;
};
