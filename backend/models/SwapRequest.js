const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    currentFaculty: {
      type: String,
      required: true,
    },
    currentSlot: {
      type: String,
      required: true,
    },
    desiredFaculty: {
      type: String,
      required: true,
    },
    desiredSlot: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "matched", "completed"],
      default: "open",
    },
    matchedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    // Contact info from THIS student (who confirmed the swap)
    studentPhone: {
      type: String,
      default: null,
    },
    studentEmail: {
      type: String,
      default: null,
    },
    studentName: {
      type: String,
      default: null,
    },
    studentContactName: {
      type: String,
      default: null,
    },
    bargainingNotes: {
      type: String,
      default: "",
    },
    // Contact info from MATCHED student (the other person)
    matchedStudentPhone: {
      type: String,
      default: null,
    },
    matchedStudentName: {
      type: String,
      default: null,
    },
    matchedStudentEmail: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SwapRequest", swapRequestSchema);