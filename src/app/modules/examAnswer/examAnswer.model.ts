// answer.model.ts
import { Schema, model } from "mongoose";
import { TAnswer } from "./examAnswer.interface";

const AnswerItemSchema = new Schema<TAnswer["answers"][0]>({
  questionId: { type: Schema.Types.ObjectId, required: true },
  selectedOptionIndex: { type: Number, required: true },
});

const AnswerSchema = new Schema<TAnswer>(
  {
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    answers: { type: [AnswerItemSchema], required: true },
    score: { type: Number, required: true },
    isPassed: { type: Boolean, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const ExamAnswer = model<TAnswer>("ExamAnswer", AnswerSchema);

export default ExamAnswer;
