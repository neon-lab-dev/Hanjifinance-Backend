import { Schema, model } from "mongoose";
import { THelpDesk } from "./helpdesk.interface";

const HelpDeskSchema = new Schema<THelpDesk>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
