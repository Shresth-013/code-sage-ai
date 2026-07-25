// backend/controllers/user.controller.js
import Roadmap from "../models/roadmap.model.js";
import Conversation from "../models/conversation.model.js";

// GET /api/user/history
// Requires the `protect` middleware — req.userId is guaranteed to be set here.
// Returns the logged-in user's saved roadmaps + hint sessions, merged and
// sorted newest-first. Summary fields only — not full weeks[]/messages[].
export const getHistory = async (req, res) => {
  try {
    const [roadmaps, conversations] = await Promise.all([
      Roadmap.find({ userId: req.userId })
        .select("goal level title summary createdAt")
        .sort({ createdAt: -1 }),
      Conversation.find({ userId: req.userId })
        .select("problem difficulty createdAt")
        .sort({ createdAt: -1 }),
    ]);

    const roadmapItems = roadmaps.map((r) => ({
      type: "roadmap",
      id: r._id,
      title: r.title,
      goal: r.goal,
      level: r.level,
      createdAt: r.createdAt,
    }));

    const hintItems = conversations.map((c) => ({
      type: "hint",
      id: c._id,
      sessionId: c.sessionId,
      problem: c.problem,
      difficulty: c.difficulty,
      createdAt: c.createdAt,
    }));

    const history = [...roadmapItems, ...hintItems].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({ success: true, data: { history } });
  } catch (err) {
    console.error("getHistory error:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch history." });
  }
};