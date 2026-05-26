import { GoogleGenerativeAI } from '@google/generative-ai';
import { CODE_SYSTEM, codePrompt } from '../services/gemini.service.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const reviewCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    // Validate input
    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_CODE', message: 'No code provided' }
      });
    }

    if (!language || !language.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_LANGUAGE', message: 'No language specified' }
      });
    }

    if (code.length > 10000) {
      return res.status(400).json({
        success: false,
        error: { code: 'CODE_TOO_LONG', message: 'Code must be under 10,000 characters' }
      });
    }

    // Call Gemini
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: CODE_SYSTEM
    });

    const prompt = codePrompt(code, language);
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Parse JSON safely
    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: { code: 'PARSE_ERROR', message: 'AI response could not be parsed' }
      });
    }

    return res.status(200).json({ success: true, data: parsed });

  } catch (error) {
    console.error('Code review error:', error.message);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Something went wrong' }
    });
  }
};