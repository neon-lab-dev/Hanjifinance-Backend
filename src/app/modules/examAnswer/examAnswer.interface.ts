// answer.interface.ts
import { Types } from "mongoose";

export type TAnswerItem = {
  questionId: Types.ObjectId;
  selectedOptionIndex: number;
};

export type TAnswer = {
  _id?: Types.ObjectId;
  examId: Types.ObjectId;
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  answers: TAnswerItem[];
  score: number;
  isPassed: boolean;
  submittedAt?: Date;
};
