import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resume.controller.js";

const router = express.Router();

// Updated multer with file filter + size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);  // ✅ Accept
    } else {
      cb(new Error("Only PDF files are allowed"), false); // ❌ Reject
    }
  },
});

router.post("/analyze", upload.single("resume"), analyzeResume);

export default router;