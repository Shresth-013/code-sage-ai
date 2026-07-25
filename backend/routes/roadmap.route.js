// backend/routes/roadmap.route.js
import express from "express";
import { generateRoadmap, getRoadmap } from "../controllers/roadmap.controller.js";
import { attachUserIfPresent } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", attachUserIfPresent, generateRoadmap);
router.get("/:id", getRoadmap);

export default router;