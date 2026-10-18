const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lab: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
    date: { type: String, required: true },       // example: 2026-10-20
    startTime: { type: String, required: true },  // example: 10:00
    endTime: { type: String, required: true },    // example: 11:00
    purpose: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);