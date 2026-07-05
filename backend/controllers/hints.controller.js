// backend/controllers/hints.controller.js
import crypto from "crypto";
import Conversation from "../models/conversation.model.js";
import { getHintResponse } from "../services/gemini.service.js";
import { startHintPrompt } from "../prompts/prompts.js";

// POST /api/hints/start
// Body: { problem: string, difficulty?: "easy"|"medium"|"hard" }
export const startHint = async (req, res) => {
  try {
    const { problem, difficulty = "medium" } = req.body;

    if (!problem || !problem.trim()) {
      return res.status(400).json({ success: false, error: "Problem statement is required." });
    }

    const sessionId = crypto.randomUUID();
    const firstPrompt = startHintPrompt(problem, difficulty);

    const hint = await getHintResponse([], firstPrompt);

    await Conversation.create({
      sessionId,
      problem,
      difficulty,
      messages: [
        { role: "user", content: firstPrompt },
        { role: "model", content: hint },
      ],
    });

    res.json({ success: true, data: { sessionId, hint } });
  } catch (err) {
    console.error("startHint error:", err.message);
    res.status(500).json({ success: false, error: err.message || "Failed to generate hint." });
  }
};

// POST /api/hints/next
// Body: { sessionId: string, message: string }  // message: "Give me the next hint" or a follow-up question
export const nextHint = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message || !message.trim()) {
      return res.status(400).json({ success: false, error: "sessionId and message are required." });
    }

    const conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      return res.status(404).json({ success: false, error: "Session not found. Start a new hint session." });
    }

    const hint = await getHintResponse(conversation.messages, message);

    conversation.messages.push({ role: "user", content: message });
    conversation.messages.push({ role: "model", content: hint });
    await conversation.save();

    res.json({ success: true, data: { hint } });
  } catch (err) {
    console.error("nextHint error:", err.message);
    res.status(500).json({ success: false, error: err.message || "Failed to generate hint." });
  }
};