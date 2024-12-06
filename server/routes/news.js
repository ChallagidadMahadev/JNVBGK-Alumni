import express from "express";
import { News } from "../models/News.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

// Get all news
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const news = await News.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(news);
  })
);

// Create news (admin only)
router.post(
  "/",
  adminAuth,
  asyncHandler(async (req, res) => {
    const news = new News({
      ...req.body,
      author: req.user._id,
      viewCount: 0,
    });
    await news.save();
    const populatedNews = await News.findById(news._id).populate(
      "author",
      "name"
    );
    res.status(201).json(populatedNews);
  })
);

// Update news (admin only)
router.put(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("author", "name");

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(news);
  })
);

// Delete news (admin only)
router.delete(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json({ message: "News deleted successfully" });
  })
);

// Increment view count
router.post(
  "/:id/view",
  asyncHandler(async (req, res) => {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json({ viewCount: news.viewCount });
  })
);

export default router;
