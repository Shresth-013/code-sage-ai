# 🏗️ Code Sage AI — Architecture

## Overview
A full-stack AI-powered developer assistant built with React + Node.js + Gemini API.
Four tools: Resume Analyzer · Code Reviewer · LeetCode Hints · Roadmap Generator

## Tech Stack

### Frontend
- React 18 + Vite
- Design-token CSS system (CSS custom properties in `index.css` — no Tailwind is installed; earlier notes claiming Tailwind were incorrect)
- Component-based architecture, inline styles per component
- Axios (single instance in `services/api.js`, shared across all features)

### Backend
- Node.js + Express
- MVC Architecture (Models, Controllers, Routes, Services)
- Multer (file upload + memory storage)
- pdf-parse (PDF text extraction)
- Google Generative AI SDK (Gemini 2.5 Flash)

### AI
- Gemini 2.5 Flash (free tier)
- Structured JSON prompt engineering
- Shared `callGemini()` helper with exponential backoff retry (503/429)
- All prompts centralized — easy to version and iterate

## Project Structure
code-sage-ai/
├── backend/
│   ├── controllers/
│   │   ├── resume.controller.js   # PDF upload → Gemini → response
│   │   └── code.controller.js     # Code input → Gemini → response
│   ├── routes/
│   │   ├── resume.route.js        # POST /api/resume/analyze
│   │   └── code.route.js          # POST /api/code/review
│   ├── services/
│   │   ├── gemini.service.js      # callGemini() + all AI functions
│   │   └── pdf.service.js         # PDF text extraction
│   ├── prompts/
│   │   └── prompts.js             # All Gemini prompts, versioned in one place
│   ├── .env                       # GEMINI_API_KEY, MONGO_URI etc.
│   └── server.js                  # Express entry point + route wiring
├── frontend/
│   ├── .env                       # VITE_API_URL
│   └── src/
│       ├── components/
│       │   ├── ResumeUpload.jsx
│       │   └── CodeReview.jsx
│       ├── services/
│       │   └── api.js             # Axios instance + all API calls — single source
│       ├── App.jsx
│       └── main.jsx
└── docs/
    ├── architecture.md
    ├── progress.md
    └── todos.md

## API Endpoints

| Method | Endpoint | Content-Type | Description |
|--------|----------|-------------|-------------|
| POST | /api/resume/analyze | multipart/form-data | Upload PDF + analyze |
| POST | /api/code/review | application/json | Code snippet → review |
| GET | /api/health | — | Server health check |

## Data Flow

### Resume Analyzer
User uploads PDF
→ Multer stores in memory (no disk write)
→ pdf-parse extracts raw text
→ callGemini() with ATS prompt
→ Structured JSON response
→ Frontend renders score ring + sections

### Code Reviewer
User pastes code + selects language
→ POST /api/code/review
→ callGemini() with code review prompt
→ Structured JSON response
→ Frontend renders score + bugs + tabs

## AI Response Structures

### Resume Analyzer
```json
{
  "score": 78,
  "summary": "Overall assessment...",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "missingKeywords": ["..."],
  "suggestions": ["..."]
}
```

### Code Reviewer
```json
{
  "overallScore": 72,
  "summary": "Overall assessment...",
  "bugs": [{ "line": 12, "issue": "...", "fix": "..." }],
  "performance": ["..."],
  "readability": ["..."],
  "bestPractices": ["..."]
}
```

## Key Engineering Decisions

| Decision | Rationale |
|----------|-----------|
| Shared `callGemini()` helper | Retry logic written once — all features reuse it |
| Prompts in one file | Easy to version, debug, and A/B test |
| Memory storage for PDFs | No disk I/O — faster and cleaner |
| Light theme for Code Reviewer | Readability priority for code-heavy UI |
| `prompts/prompts.js` separated from `gemini.service.js` | Prompts versioned and testable independent of retry/parsing logic |