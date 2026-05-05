import pdfParse from "pdf-parse";
import { analyzeResumeWithGemini } from "../services/geminiService.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded. Please upload a PDF resume.",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        error: "Invalid file type. Only PDF files are accepted.",
      });
    }

    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum size is 5MB.",
      });
    }

    // Extract text from PDF
    let extractedText;
    try {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text?.trim();
    } catch (err) {
      return res.status(422).json({
        success: false,
        error: "Could not read PDF. Please upload a valid non-scanned PDF.",
      });
    }

    if (!extractedText || extractedText.length < 50) {
      return res.status(422).json({
        success: false,
        error: "Resume appears empty or is scanned. Upload a text-based PDF.",
      });
    }

    // Send to Gemini
    let analysisResult;
    try {
      analysisResult = await analyzeResumeWithGemini(extractedText);
    } catch (err) {
      console.error("Gemini API Error:", err.message);
      return res.status(502).json({
        success: false,
        error: "AI analysis failed. Please try again.",
      });
    }

    const { score, summary, strengths, weaknesses, missingKeywords, suggestions } = analysisResult;

    if (
      typeof score !== "number" ||
      !summary ||
      !Array.isArray(strengths) ||
      !Array.isArray(weaknesses) ||
      !Array.isArray(missingKeywords) ||
      !Array.isArray(suggestions)
    ) {
      return res.status(502).json({
        success: false,
        error: "AI returned unexpected data. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      data: { score, summary, strengths, weaknesses, missingKeywords, suggestions },
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({
      success: false,
      error: "An unexpected server error occurred.",
    });
  }
};