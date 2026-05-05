import "dotenv/config";

import express from "express";
import cors from "cors";
import resumeRouter from "./routes/resume.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/resume", resumeRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});