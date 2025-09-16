import { Schema, model } from "mongoose";
import { TNewsletter } from "./newsletter.interface";

const CategorySchema = new Schema<TNewsletter>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const Newsletter = model<TNewsletter>("Newsletter", CategorySchema);
export default Newsletter;
