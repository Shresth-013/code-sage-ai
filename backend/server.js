import "dotenv/config";

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import resumeRouter from "./routes/resume.route.js";
import codeRouter from './routes/code.route.js';



const app = express();
const PORT = process.env.PORT || 5000;

connectDB();


// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/resume", resumeRouter);
app.use('/api/code', codeRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});