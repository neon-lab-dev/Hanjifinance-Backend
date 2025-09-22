import { Schema, model } from "mongoose";
import { THelpDesk } from "./helpdesk.interface";

const HelpDeskSchema = new Schema<THelpDesk>(
  {
    imageUrl: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userCustomId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "resolved"], required: true },
  },
  {
    timestamps: true,
  }
);

const HelpDesk = model<THelpDesk>("HelpDesk", HelpDeskSchema);
export default HelpDesk;
