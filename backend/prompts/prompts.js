// backend/prompts/prompts.js
//
// All Gemini prompts live here — one place to version, debug, and iterate.
// Rule: only gemini.service.js imports from this file. Controllers never see raw prompt text.

// ─── Resume Analyzer ───
export const RESUME_SYSTEM = `You are an expert ATS resume analyzer and career coach.
Return ONLY raw JSON. No explanation, no markdown, no code blocks.`;

export const resumePrompt = (resumeText) => `
Return EXACTLY this JSON structure:
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

// ─── Code Reviewer ───
export const CODE_REVIEW_SYSTEM = `You are a senior software engineer doing a code review.
Return ONLY raw JSON. No explanation, no markdown, no code blocks.`;

export const codeReviewPrompt = (code, language) => `
LANGUAGE: ${language}

CODE:
${code}

Return EXACTLY this JSON structure:
{
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "bugs": [{ "issue": "<description>", "line": "<line number or range>", "fix": "<how to fix>" }],
  "performance": ["<suggestion>"],
  "readability": ["<suggestion>"],
  "bestPractices": ["<suggestion>"]
}`;