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
      validate: {
        validator: function (this: TCourse, value: Date | null) {
          if (this.accessType === "limited" && !value) {
            return false;
          }
          return true;
        },
        message: "Access Validity is required",
      },
    },
    category: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    discountedPrice: {
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
