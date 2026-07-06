// backend/services/gemini.service.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HINTS_SYSTEM } from "../prompts/prompts.js";
import { ROADMAP_SYSTEM, roadmapPrompt } from "../prompts/prompts.js";
import {
  RESUME_SYSTEM,
  resumePrompt,
  CODE_REVIEW_SYSTEM,
  codeReviewPrompt,
} from "../prompts/prompts.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Shared retry + JSON-parse wrapper — every feature reuses this.
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
  const prompt = `${RESUME_SYSTEM}\n\n${resumePrompt(resumeText)}`;
  return callGemini(prompt);
};

// ─── Code Reviewer ───
export const reviewCodeWithGemini = async (code, language) => {
  const prompt = `${CODE_REVIEW_SYSTEM}\n\n${codeReviewPrompt(code, language)}`;
  return callGemini(prompt);
};

export { callGemini };

// ─── LeetCode Hint Generator (multi-turn) ───
// `history` = prior messages from Conversation.messages ([{role, content}, ...])
// `userMessage` = the new thing being sent (first hint request, "next hint", or a follow-up question)
export const getHintResponse = async (history, userMessage, maxRetries = 3) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: HINTS_SYSTEM,
  });

  const chat = model.startChat({
    history: history.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
  });

  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await chat.sendMessage(userMessage);
      return result.response.text().trim();
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
      throw error;
    }
  }
  throw lastError;
};

export const generateRoadmapWithGemini = async (goal, level, weeks, hoursPerWeek) => {
  const prompt = `${ROADMAP_SYSTEM}\n\n${roadmapPrompt(goal, level, weeks, hoursPerWeek)}`;
  return callGemini(prompt);
};