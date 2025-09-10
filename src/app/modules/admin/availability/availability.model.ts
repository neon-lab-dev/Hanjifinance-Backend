import { Schema, model } from "mongoose";
import { TAvailability } from "./availability.interface";

const AvailabilitySchema = new Schema<TAvailability>(
  {
    date: {
      type: Date,
      required: true,
    },
    slot: {
      type: String,
      required: false,
    },
    isBooked: {
      type: Boolean,
      required: false,
      default : false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Availability = model<TAvailability>("Availability", AvailabilitySchema);

export default Availability;