import { Schema, model } from "mongoose";
import { TCourseLecture } from "./courseLecture.interface";

const CourseLectureSchema = new Schema<TCourseLecture>(
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
    videoUrl: {
      type: String,
      required: false,
    },
    videoPublicId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const CourseLecture = model<TCourseLecture>("CourseLecture", CourseLectureSchema);

export default CourseLecture;
