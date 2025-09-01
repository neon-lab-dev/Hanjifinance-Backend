import { Schema, model } from "mongoose";
import { TCourseLecture } from "./courseLecture.interface";

const CourseSchema = new Schema<TCourseLecture>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CourseLecture = model<TCourseLecture>("CourseLecture", CourseSchema);

export default CourseLecture;
