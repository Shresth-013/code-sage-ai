// backend/routes/auth.route.js
import express from "express";
import { signup, login, logout, getCurrentUser } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);

export default router;