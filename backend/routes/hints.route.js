// backend/routes/hints.route.js
import express from "express";
import { startHint, nextHint } from "../controllers/hints.controller.js";
import { attachUserIfPresent } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/start", attachUserIfPresent, startHint);
router.post("/next", nextHint);

export default router;