import { Schema, model } from "mongoose";
import { TCourse } from "./course.interface";

const CourseSchema = new Schema<TCourse>(
  {
    imageUrl: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = model<TCourse>("Course", CourseSchema);

export default Course;
