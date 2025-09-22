/* eslint-disable @typescript-eslint/no-explicit-any */
// exam.model.ts
import { Schema, model } from "mongoose";
import { TExam } from "./exam.interface";

const OptionSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const QuestionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [OptionSchema],
      validate: (val: any[]) => val.length >= 2,
      required: true,
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
    },
  }
);

const ExamSchema = new Schema<TExam>(
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
    questions: {
      type: [QuestionSchema],
      required: true,
    },
    duration: {
      type: Number,
    },
    passingMark: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

ExamSchema.pre('save', function (next) {
  const totalQuestions = this.questions.length;
  this.duration = totalQuestions;

  // 70% passing
  this.passingMark = Math.ceil(totalQuestions * 0.7);
  next();
});


const Exam = model<TExam>("Exam", ExamSchema);

export default Exam;
