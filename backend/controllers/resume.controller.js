import { extractTextFromPDF } from "../services/pdf.service.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const text = await extractTextFromPDF(req.file.buffer);

    const mockResponse = {
      atsScore: 75,
      strengths: ["Good project experience", "Strong tech stack"],
      missingKeywords: ["Docker", "AWS"],
      suggestions: ["Add cloud experience", "Improve formatting"]
    };

    res.json({
      extractedText: text.substring(0, 500),
      analysis: mockResponse
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};