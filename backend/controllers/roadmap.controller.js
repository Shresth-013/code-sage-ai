// backend/controllers/roadmap.controller.js
import Roadmap from "../models/roadmap.model.js";
import { generateRoadmapWithGemini } from "../services/gemini.service.js";

const VALID_LEVELS = ["beginner", "intermediate", "advanced"];

// POST /api/roadmap/generate
// Body: { goal: string, level: "beginner"|"intermediate"|"advanced", weeks: number, hoursPerWeek: number }
export const generateRoadmap = async (req, res) => {
  try {
    const { goal, level, weeks, hoursPerWeek } = req.body;

    if (!goal || !goal.trim()) {
      return res.status(400).json({ success: false, error: "Goal is required." });
    }
    if (!VALID_LEVELS.includes(level)) {
      return res.status(400).json({ success: false, error: "Level must be beginner, intermediate, or advanced." });
    }
    const weeksNum = Number(weeks);
    const hoursNum = Number(hoursPerWeek);
    if (!Number.isInteger(weeksNum) || weeksNum < 1 || weeksNum > 52) {
      return res.status(400).json({ success: false, error: "Weeks must be an integer between 1 and 52." });
    }
    if (!Number.isFinite(hoursNum) || hoursNum <= 0 || hoursNum > 80) {
      return res.status(400).json({ success: false, error: "Hours per week must be a realistic positive number." });
    }

    const result = await generateRoadmapWithGemini(goal, level, weeksNum, hoursNum);

    const roadmap = await Roadmap.create({
      goal,
      level,
      weeksRequested: weeksNum,
      hoursPerWeek: hoursNum,
      title: result.title,
      summary: result.summary,
      weeks: result.weeks,
      finalAdvice: result.finalAdvice,
    });

    res.json({ success: true, data: { id: roadmap._id, ...result } });
  } catch (err) {
    console.error("generateRoadmap error:", err.message);
    res.status(500).json({ success: false, error: err.message || "Failed to generate roadmap." });
  }
};

// GET /api/roadmap/:id
export const getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ success: false, error: "Roadmap not found." });
    }
    res.json({ success: true, data: roadmap });
  } catch (err) {
    // Invalid ObjectId format lands here too — Mongoose throws a CastError
    res.status(404).json({ success: false, error: "Roadmap not found." });
  }
};