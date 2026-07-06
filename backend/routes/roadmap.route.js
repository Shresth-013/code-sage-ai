// backend/routes/roadmap.route.js
import express from "express";
import { generateRoadmap, getRoadmap } from "../controllers/roadmap.controller.js";

const router = express.Router();

router.post("/generate", generateRoadmap);
router.get("/:id", getRoadmap);

export default router;