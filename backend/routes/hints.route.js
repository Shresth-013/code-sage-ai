// backend/routes/hints.route.js
import express from "express";
import { startHint, nextHint } from "../controllers/hints.controller.js";

const router = express.Router();

router.post("/start", startHint);
router.post("/next", nextHint);

export default router;