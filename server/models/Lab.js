const mongoose = require("mongoose");

const labSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    capacity: { type: Number, default: 1 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lab", labSchema);