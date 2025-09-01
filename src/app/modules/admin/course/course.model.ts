import { Schema, model } from "mongoose";
import { TCourse } from "./course.interface";

const CourseSchema = new Schema<TCourse>(
  {
    imageUrl: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      required: true,
    },
    benefits: {
      type: [String],
      required: true,
    },
    accessType: {
      type: String,
      required: true,
      enum: ["lifetime", "limited"],
    },
    accessValidity: {
      type: Date,
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
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = model<TCourse>("Course", CourseSchema);

export default Course;
