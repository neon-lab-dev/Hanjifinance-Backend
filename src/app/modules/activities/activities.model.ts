import { Schema, model } from "mongoose";
import { TActivity } from "./activities.interface";

const ActivitySchema = new Schema<TActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const Activity = model<TActivity>("Activity", ActivitySchema);
export default Activity;
