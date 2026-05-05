const pdfParse = require("pdf-parse");
const { analyzeResumeWithGemini } = require("../services/geminiService");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const analyzeResume = async (req, res) => {
  try {
    // 1. Check file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded. Please upload a PDF resume.",
      });
    }

    // 2. Check file type
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        error: "Invalid file type. Only PDF files are accepted.",
      });
    }

    // 3. Check file size
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum size is 5MB.",
      });
    }

    // 4. Extract text from PDF
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

    // 5. Check if PDF has actual text
    if (!extractedText || extractedText.length < 50) {
      return res.status(422).json({
        success: false,
        error: "Resume appears empty or is a scanned image. Upload a text-based PDF.",
      });
    }

    // 6. Send to Gemini
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

    // 7. Validate Gemini response shape
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

    // 8. Send success response
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

module.exports = { analyzeResume };