import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "Gender is required"],
  },
  batchYear: {
    type: Number,
    required: [true, "Batch year is required"],
    min: [1980, "Batch year must be 1980 or later"],
    max: [new Date().getFullYear(), "Batch year cannot be in the future"],
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(\+91[\-\s]?)?[0]?(91)?[56789]\d{9}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid Indian phone number!`,
    },
  },
  showPhoneNumber: {
    type: Boolean,
    default: false,
  },
  house: {
    type: String,
    enum: ["ARAVALI", "NILGIRI", "SHIVALIK", "UDAIGIRI"],
  },
  address: String,
  profilePicture: String,
  occupation: {
    type: String,
    enum: [
      "Engineering",
      "Medicine",
      "Teaching",
      "Business",
      "Government Service",
      "Armed Forces",
      "Law",
      "Arts & Entertainment",
      "Agriculture",
      "Research & Academia",
      "Architecture",
      "Others",
    ],
  },
  occupationSubField: String,
  participation: [
    {
      type: String,
      enum: [
        "Education",
        "Sports",
        "Music",
        "Dance",
        "Drama",
        "Debate",
        "Science & Technology",
        "Social Service",
        "Others",
      ],
    },
  ],
  customParticipation: String,
  role: {
    type: String,
    enum: ["alumni", "admin"],
    default: "alumni",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", userSchema);
