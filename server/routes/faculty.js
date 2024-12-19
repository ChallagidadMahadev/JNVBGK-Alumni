import express from "express";
import { Faculty } from "../models/Faculty.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

// Get all faculty members
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const faculty = await Faculty.find().sort({ name: 1 });
    res.json(faculty);
  })
);

// Create faculty member
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, contactNumber, isCurrentlyTeaching, location } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const faculty = await Faculty.create({
      name,
      contactNumber,
      isCurrentlyTeaching,
      location,
    });

    res.status(201).json(faculty);
  })
);

// Update faculty member
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { name, contactNumber, isCurrentlyTeaching, location } = req.body;

    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    faculty.name = name || faculty.name;
    faculty.contactNumber = contactNumber || faculty.contactNumber;
    faculty.isCurrentlyTeaching =
      isCurrentlyTeaching ?? faculty.isCurrentlyTeaching;
    faculty.location = location || faculty.location;

    await faculty.save();
    res.json(faculty);
  })
);

// Delete faculty member
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    res.json({ message: "Faculty member deleted successfully" });
  })
);

export default router;
