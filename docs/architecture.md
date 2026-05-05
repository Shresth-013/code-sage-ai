# 🏗️ Code Sage AI — Architecture

## Overview
A full-stack AI-powered developer assistant built with React + Node.js + Gemini API.

## Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS
- Component-based architecture

### Backend
- Node.js + Express
- MVC Architecture (Models, Controllers, Routes, Services)
- Multer (file upload)
- pdf-parse (PDF text extraction)
- Google Generative AI SDK (Gemini 2.5 Flash)

### AI
- Gemini 2.5 Flash (free tier)
- Structured JSON prompt engineering
- ATS resume scoring system

## Project Structure

\`\`\`
code-sage-ai/
├── backend/
│   ├── controllers/
│   │   └── resume.controller.js   # Request handling + validation
│   ├── routes/
│   │   └── resume.route.js        # API route definitions
│   ├── services/
│   │   ├── geminiServices.js      # Gemini AI integration
│   │   └── pdf.service.js         # PDF text extraction
│   ├── .env                       # Environment variables
│   └── server.js                  # Express app entry point
├── frontend/
│   └── src/
│       ├── components/
│       │   └── ResumeUpload.jsx   # Resume analyzer UI
│       ├── App.jsx
│       └── main.jsx
└── docs/
    ├── architecture.md
    ├── progress.md
    └── todos.md
\`\`\`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/resume/analyze | Upload + analyze resume |
| GET | /api/health | Server health check |

## Data Flow

\`\`\`
User uploads PDF
    → Multer stores in memory
    → pdf-parse extracts text
    → Gemini 2.5 Flash analyzes
    → Structured JSON response
    → Frontend displays results
\`\`\`

## AI Response Structure

\`\`\`json
{
  "score": 78,
  "summary": "Overall assessment...",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "missingKeywords": ["..."],
  "suggestions": ["..."]
}
\`\`\`