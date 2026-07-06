// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 30000,
});

export const analyzeResume = (formData) =>
  api.post("/api/resume/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const reviewCode = (data) => api.post("/api/code/review", data);

export const startHint = (data) => api.post("/api/hints/start", data);
export const nextHint = (data) => api.post("/api/hints/next", data);

export const generateRoadmap = (data) => api.post("/api/roadmap/generate", data);
export const getRoadmap = (id) => api.get(`/api/roadmap/${id}`);

export default api;