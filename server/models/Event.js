import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  image: String,
  registeredUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add validation for end date
eventSchema.pre("validate", function (next) {
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    this.invalidate("endDate", "End date must be after start date");
  }
  next();
});

// Format dates before saving
eventSchema.pre("save", function (next) {
  if (this.startDate) {
    this.startDate = new Date(this.startDate);
  }
  if (this.endDate) {
    this.endDate = new Date(this.endDate);
  }
  next();
});

export const Event = mongoose.model("Event", eventSchema);
