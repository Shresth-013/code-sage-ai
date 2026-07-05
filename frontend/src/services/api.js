// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 30000,
});

// ─── Resume Analyzer ───
export const analyzeResume = (formData) =>
  api.post("/api/resume/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ─── Code Reviewer ───
export const reviewCode = (data) => api.post("/api/code/review", data);

// ─── LeetCode Hint Generator ───
export const startHint = (data) => api.post("/api/hints/start", data);
export const nextHint = (data) => api.post("/api/hints/next", data);

export default api;