import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    batchNumber: {
      type: Number,
      required: [true, "Batch number is required"],
      min: [1, "Batch number must be positive"],
    },
    title: {
      type: String,
      required: [true, "Batch title is required"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [2008, "Year must be 2008 or later"],
    },
    students: [
      {
        name: {
          type: String,
          required: [true, "Student name is required"],
          trim: true,
        },
        rollNumber: {
          type: String,
          trim: true,
        },
        house: {
          type: String,
          enum: ["ARAVALI", "NILGIRI", "SHIVALIK", "UDAIGIRI"],
        },
        achievements: String,
        currentStatus: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
batchSchema.index({ batchNumber: 1 });
batchSchema.index({ year: 1 });
batchSchema.index({ "students.rollNumber": 1 });

export const Batch = mongoose.model("Batch", batchSchema);
