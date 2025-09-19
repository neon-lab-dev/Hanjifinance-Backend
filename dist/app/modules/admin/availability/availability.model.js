"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AvailabilitySchema = new mongoose_1.Schema({
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
        default: false
    },
    isAvailable: {
        type: Boolean,
        required: false,
        default: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
}, {
    timestamps: true,
});
const Availability = (0, mongoose_1.model)("Availability", AvailabilitySchema);
exports.default = Availability;
