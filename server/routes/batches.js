import express from "express";
import multer from "multer";
import { parse } from "csv-parse";
import { Batch } from "../models/Batch.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

// Configure multer for CSV uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Please upload a CSV file"));
    }
  },
});

// Get all batches
router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const batches = await Batch.find()
      .sort({ batchNumber: 1 })
      .select("-createdBy");
    res.json(batches);
  })
);

// Upload new batch data (admin only)
router.post(
  "/upload",
  adminAuth,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a CSV file" });
    }

    const { batchNumber, title, year } = req.body;

    // Validate required fields
    if (!batchNumber || !title || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      // Parse CSV data
      const students = await new Promise((resolve, reject) => {
        const results = [];
        const parser = parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
        });

        parser.on("readable", () => {
          let record;
          while ((record = parser.read())) {
            // Validate and clean house name
            let house = record.house?.toUpperCase();
            if (
              house &&
              !["ARAVALI", "NILGIRI", "SHIVALIK", "UDAYAGIRI"].includes(house)
            ) {
              house = undefined;
            }

            if (record.name?.trim()) {
              results.push({
                name: record.name.trim(),
                rollNumber: record.rollNumber?.trim(),
                house,
                achievements: record.achievements?.trim(),
                currentStatus: record.currentStatus?.trim(),
              });
            }
          }
        });

        parser.on("error", (err) =>
          reject(new Error(`Error parsing CSV: ${err.message}`))
        );
        parser.on("end", () => resolve(results));

        parser.write(req.file.buffer.toString());
        parser.end();
      });

      if (students.length === 0) {
        return res
          .status(400)
          .json({ message: "No valid student records found in CSV" });
      }

      // Create and save batch
      const batch = new Batch({
        batchNumber: parseInt(batchNumber),
        title,
        year: parseInt(year),
        students,
        createdBy: req.user._id,
      });

      await batch.save();
      res.status(201).json(batch);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: "Duplicate batch number found" });
      } else {
        throw error;
      }
    }
  })
);

// Update batch (admin only)
router.put(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const { title, students } = req.body;

    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    if (title) batch.title = title;
    if (students) {
      // Validate student data
      students.forEach((student) => {
        if (!student.name?.trim()) {
          throw new Error("Student name is required");
        }
        if (
          student.house &&
          !["ARAVALI", "NILGIRI", "SHIVALIK", "UDAYAGIRI"].includes(
            student.house
          )
        ) {
          throw new Error("Invalid house name");
        }
      });
      batch.students = students;
    }

    await batch.save();
    res.json(batch);
  })
);

// Delete batch (admin only)
router.delete(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    await batch.deleteOne();
    res.json({ message: "Batch deleted successfully" });
  })
);

export default router;
