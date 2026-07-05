import { reviewCodeWithGemini } from "../services/gemini.service.js";

export const reviewCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: "MISSING_CODE", message: "No code provided" }
      });
    }

    if (!language || !language.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: "MISSING_LANGUAGE", message: "No language specified" }
      });
    }

    if (code.length > 10000) {
      return res.status(400).json({
        success: false,
        error: { code: "CODE_TOO_LONG", message: "Code must be under 10,000 characters" }
      });
    }

    const data = await reviewCodeWithGemini(code, language);
    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error("Code review error:", error.message);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: error.message || "Something went wrong" }
    });
  }
};