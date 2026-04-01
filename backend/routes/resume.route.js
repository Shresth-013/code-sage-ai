import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resume.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/analyze", upload.single("resume"), analyzeResume);

export default router;