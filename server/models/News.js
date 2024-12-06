import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["announcement", "achievement", "event", "general"],
    default: "general",
  },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  image: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
newsSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const News = mongoose.model("News", newsSchema);
