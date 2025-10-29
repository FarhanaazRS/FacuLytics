const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    teaching: {
      type: Number,
      min: 1,
      max: 5,
    },
    marks: {
      type: Number,
      min: 1,
      max: 5,
    },
    quiz: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);