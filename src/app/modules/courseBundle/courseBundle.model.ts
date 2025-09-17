import { Schema, model } from "mongoose";
import { TCourseBundle } from "./courseBundle.interface";

const CourseBundleSchema = new Schema<TCourseBundle>(
  {
    courseId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: false,
      },
    ],
    imageUrl: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CourseBundle = model<TCourseBundle>("CourseBundle", CourseBundleSchema);

export default CourseBundle;
