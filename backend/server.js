import express from "express";
import cors from "cors";
import resumeRouter from "./routes/resume.route.js";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdfParse = require("pdf-parse");

const app = express(); // ✅ MUST BE BEFORE USING app

app.use(cors());
app.use(express.json());

app.use("/api/resume", resumeRouter);

// Store file in memory (not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Resume Upload Route
app.post("/api/resume/analyze", upload.single("resume"), async (req, res) => {
  try {
    // 1. Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 2. Extract PDF text
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    // 3. Mock AI response
    const mockResponse = {
      atsScore: 75,
      strengths: ["Good project experience", "Strong tech stack"],
      missingKeywords: ["Docker", "AWS"],
      suggestions: ["Add cloud experience", "Improve formatting"]
    };

    // 4. Send response
    res.json({
      extractedText: text.substring(0, 500),
      analysis: mockResponse
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Health route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Start server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});