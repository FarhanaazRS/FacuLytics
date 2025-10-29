const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    subjects: {
      type: Map,
      of: String,
      default: new Map(),
    },
    // Format: "MON-A1/L1" -> "Subject Name"
    // Easy to query and update specific slots
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);