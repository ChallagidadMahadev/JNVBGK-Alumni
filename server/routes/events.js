import express from "express";
import multer from "multer";
import { Event } from "../models/Event.js";
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

// Get all events with participation status
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const events = await Event.find()
      .sort({ startDate: 1 })
      .populate("createdBy", "name")
      .lean();

    // Convert registeredUsers to array of strings for easier checking
    const eventsWithStringIds = events.map((event) => ({
      ...event,
      registeredUsers: event.registeredUsers.map((id) => id.toString()),
    }));

    res.json(eventsWithStringIds);
  })
);

// Register for event
router.post(
  "/:id/register",
  auth,
  asyncHandler(async (req, res) => {
    const { attending } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const userIndex = event.registeredUsers.indexOf(req.user._id);

    if (attending && userIndex === -1) {
      // Add user to registered users if not already registered
      event.registeredUsers.push(req.user._id);
    } else if (!attending && userIndex !== -1) {
      // Remove user from registered users if registered
      event.registeredUsers.splice(userIndex, 1);
    }

    await event.save();

    // Convert registeredUsers to array of strings for consistency
    const updatedEvent = event.toObject();
    updatedEvent.registeredUsers = updatedEvent.registeredUsers.map((id) =>
      id.toString()
    );

    res.json(updatedEvent);
  })
);

// Get all events with participation status
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const events = await Event.find()
      .sort({ startDate: 1 })
      .populate("createdBy", "name")
      .lean();

    // Convert registeredUsers to array of strings for easier checking
    const eventsWithStringIds = events.map((event) => ({
      ...event,
      registeredUsers: event.registeredUsers.map((id) => id.toString()),
    }));

    res.json(eventsWithStringIds);
  })
);

// Create event (admin only)
router.post(
  "/",
  adminAuth,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const { title, description, startDate, endDate, location } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (end < start) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    const event = new Event({
      title,
      description,
      startDate: start,
      endDate: end,
      location,
      createdBy: req.user._id,
      registeredUsers: [],
    });

    if (req.file) {
      event.image = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
    }

    await event.save();
    res.status(201).json(event);
  })
);

// Update event (admin only)
router.put(
  "/:id",
  adminAuth,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const updates = { ...req.body };

    // Validate dates if provided
    if (updates.startDate) {
      updates.startDate = new Date(updates.startDate);
      if (isNaN(updates.startDate.getTime())) {
        return res.status(400).json({ message: "Invalid start date format" });
      }
    }

    if (updates.endDate) {
      updates.endDate = new Date(updates.endDate);
      if (isNaN(updates.endDate.getTime())) {
        return res.status(400).json({ message: "Invalid end date format" });
      }
    }

    if (
      updates.startDate &&
      updates.endDate &&
      updates.endDate < updates.startDate
    ) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    if (req.file) {
      updates.image = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  })
);

// Delete event (admin only)
router.delete(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  })
);

export default router;
