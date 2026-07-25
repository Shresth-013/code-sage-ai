import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import resumeRouter from "./routes/resume.route.js";
import codeRouter from './routes/code.route.js';
import hintsRouter from "./routes/hints.route.js";
import roadmapRouter from "./routes/roadmap.route.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middlewares
// credentials: true + an explicit origin (never "*") is required for the browser
// to send/receive the httpOnly auth cookie cross-origin (localhost:5173 -> :5000).
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/resume", resumeRouter);
app.use('/api/code', codeRouter);
app.use("/api/hints", hintsRouter);
app.use("/api/roadmap", roadmapRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});