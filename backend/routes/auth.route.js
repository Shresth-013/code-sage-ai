// backend/routes/auth.route.js
import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// GET /me is added in Step 2, once the `protect` middleware exists to populate req.userId.

export default router;