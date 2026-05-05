import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeResumeWithGemini = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  return JSON.parse(cleaned);
};