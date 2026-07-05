// frontend/src/services/api.js
import axios from "axios";

// Single source of truth for backend base URL.
// VITE_API_URL is set in frontend/.env for prod; falls back to local dev.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 30000,
});

// ─── Resume Analyzer ───
// formData must contain a "resume" field with the PDF File object.
export const analyzeResume = (formData) =>
  api.post("/api/resume/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ─── Code Reviewer ───
export const reviewCode = (data) => api.post("/api/code/review", data);

export default api;