import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    contactNumber: {
      type: String,
      trim: true,
      match: [
        /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/,
        "Please enter a valid Indian phone number",
      ],
    },
    isCurrentlyTeaching: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Faculty = mongoose.model("Faculty", facultySchema);
