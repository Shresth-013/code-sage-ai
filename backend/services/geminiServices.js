import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const analyzeResumeWithGemini = async (resumeText, maxRetries = 3) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer and career coach.

Analyze the following resume text and return a JSON object with EXACTLY this structure.
Return ONLY the JSON. No explanation, no markdown, no code blocks — just raw JSON.

{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>", "<suggestion 4>"]
}

Scoring guide:
- 80-100: Excellent ATS optimization
- 60-79: Good, minor improvements needed
- 40-59: Average, missing key elements
- 0-39:  Poor ATS compatibility

Be specific and actionable. Only analyze what is actually in the resume.

Resume Text:

---
${resumeText}
---
`;

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

      // Retry only on 503 (overloaded) or 429 (rate limited)
      const isRetryable = error.status === 503 || error.status === 429;

      if (isRetryable && attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt); // 2s → 4s → 8s
        console.warn(`Gemini ${error.status} on attempt ${attempt}/${maxRetries}. Retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }

      // Non-retryable error or retries exhausted — throw a clean error
      if (error.status === 503) {
        throw new Error("AI service is temporarily busy. Please try again in a moment.");
      }
      if (error.status === 429) {
        throw new Error("Rate limit reached. Please wait a moment and try again.");
      }
      if (error instanceof SyntaxError) {
        throw new Error("Failed to parse AI response. Please try again.");
      }

      throw error; // Re-throw anything unexpected
    }
  }

  throw lastError;
};
export const CODE_SYSTEM = `You are a senior software engineer specializing in code quality.
Review the provided code and respond ONLY with valid JSON.
No explanation, no markdown, no preamble outside the JSON.`;

export const reviewCodeWithGemini = async (code, language, maxRetries = 3) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
        console.warn(`Gemini ${error.status} on attempt ${attempt}/${maxRetries}. Retrying in ${delay}ms...`);
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