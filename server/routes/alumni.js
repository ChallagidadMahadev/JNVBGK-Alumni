import express from "express";
import multer from "multer";
import { User } from "../models/User.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// Get all alumni
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const alumni = await User.find({ role: "alumni" })
      .select("-password")
      .sort({ name: 1 });
    res.json(alumni);
  })
);

// Update profile with file upload support
router.put(
  "/profile",
  auth,
  upload.single("profilePicture"),
  asyncHandler(async (req, res) => {
    const updates = { ...req.body };
    delete updates.password;
    delete updates.role;

    // Handle array fields
    if (req.body["participation[]"]) {
      updates.participation = Array.isArray(req.body["participation[]"])
        ? req.body["participation[]"]
        : [req.body["participation[]"]];
      delete updates["participation[]"];
    }

    // Handle boolean fields
    updates.showPhoneNumber = req.body.showPhoneNumber === "true";

    // Handle file upload
    if (req.file) {
      // Here you would typically upload to a cloud storage service
      // For now, we'll store the base64 string
      updates.profilePicture = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  })
);

export default router;
