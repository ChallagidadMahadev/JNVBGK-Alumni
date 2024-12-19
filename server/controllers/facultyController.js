import { Faculty } from "../models/Faculty.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Get all faculty members
export const getAllFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.find().sort({ name: 1 });
  res.json(faculty);
});

// Get single faculty member
export const getFacultyById = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id);
  if (!faculty) {
    return res.status(404).json({ message: "Faculty member not found" });
  }
  res.json(faculty);
});

// Create faculty member (admin only)
export const createFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.create(req.body);
  res.status(201).json(faculty);
});

// Update faculty member (admin only)
export const updateFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!faculty) {
    return res.status(404).json({ message: "Faculty member not found" });
  }

  res.json(faculty);
});

// Delete faculty member (admin only)
export const deleteFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findByIdAndDelete(req.params.id);

  if (!faculty) {
    return res.status(404).json({ message: "Faculty member not found" });
  }

  res.json({ message: "Faculty member deleted successfully" });
});
