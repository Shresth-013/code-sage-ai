import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const callGemini = async (prompt, maxRetries = 3) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const cleaned = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      return JSON.parse(cleaned);

    } catch (error) {
      lastError = error;
      const isRetryable = error.status === 503 || error.status === 429;

      if (isRetryable && attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt);
        console.warn(`Gemini ${error.status} — attempt ${attempt}/${maxRetries}, retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }

      if (error.status === 503) throw new Error("AI service is temporarily busy. Please try again.");
      if (error.status === 429) throw new Error("Rate limit reached. Please wait and try again.");
      if (error instanceof SyntaxError) throw new Error("Failed to parse AI response. Please try again.");

      throw error;
    }
  }

  throw lastError;
};

// ─── Resume Analyzer ───
export const analyzeResumeWithGemini = async (resumeText) => {
  const prompt = `
You are an expert ATS resume analyzer and career coach.
Return ONLY raw JSON. No explanation, no markdown, no code blocks.

{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
}

Resume:
---
${resumeText}
---`;

  return callGemini(prompt);
};

// ─── Code Reviewer ───
export const reviewCodeWithGemini = async (code, language) => {
  const prompt = `
You are a senior software engineer doing a code review.
Return ONLY raw JSON. No explanation, no markdown, no code blocks.

LANGUAGE: ${language}

CODE:
${code}

{
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "bugs": [{ "issue": "<description>", "line": "<line number or range>", "fix": "<how to fix>" }],
  "performance": ["<suggestion>"],
  "readability": ["<suggestion>"],
  "bestPractices": ["<suggestion>"]
}`;

  return callGemini(prompt);
};