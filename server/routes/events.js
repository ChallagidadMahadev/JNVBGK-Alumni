import express from "express";
import { Event } from "../models/Event.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

// Get all events
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  })
);

// Create event (admin only)
router.post(
  "/",
  adminAuth,
  asyncHandler(async (req, res) => {
    const event = new Event({
      ...req.body,
      createdBy: req.user._id,
    });
    await event.save();
    res.status(201).json(event);
  })
);

// Update event (admin only)
router.put(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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

// Register for event
router.post(
  "/:id/register",
  auth,
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.registeredUsers.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "Already registered for this event" });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();
    res.json(event);
  })
);

export default router;
