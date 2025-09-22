import { Types } from "mongoose";

export type TOption = {
  text: string;
};

export type TQuestion = {
  questionText: string;
  options: TOption[];
  correctAnswerIndex: number;
};

export type TExam = {
  _id?: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  questions: TQuestion[];
  duration?: number;
  createdAt?: Date;
};