// backend/routes/user.route.js
import express from "express";
import { getHistory } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/history", protect, getHistory);

export default router;