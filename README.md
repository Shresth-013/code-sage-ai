<div align="center">

# 🧠 Code Sage AI

### Your AI-powered developer companion — resumes, code, and career growth in one place

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-green)
![Stack](https://img.shields.io/badge/stack-MERN%20%2B%20GenAI-orange)

[Live Demo](#) · [Report Bug](https://github.com/Shresth-013/code-sage-ai/issues) · [Request Feature](https://github.com/Shresth-013/code-sage-ai/issues)

</div>

---

## 📖 About

**Code Sage AI** is a full-stack, AI-integrated developer assistant built on the **MERN stack** with a **Gemini 2.5 Flash** GenAI layer. It brings together four tools developers actually reach for — resume analysis, code review, algorithmic problem hints, and personalized learning roadmaps — behind a single account with saved history.

Every AI response is structured JSON, generated through a dedicated service layer, validated, and persisted — so results are consistent, explainable, and revisitable.

---

## ✨ Features

| Feature | Status | Description |
|---|:---:|---|
| 📄 **Resume Analyzer** | ✅ Live | ATS scoring, strengths/weaknesses, missing keywords, and tailored suggestions from a PDF resume |
| 🔍 **Code Reviewer** | ✅ Live | AI-powered bug detection, performance notes, and best-practice feedback with exact line references |
| 💡 **LeetCode Hints** | ✅ Live | Progressive, multi-turn hints for a problem — without ever spoiling the full solution |
| 🗺️ **Roadmap Generator** | ✅ Live | Personalized, week-by-week learning plans based on goal, timeline, and current skills — saved and shareable |
| 🔐 **Auth & History** | ✅ Live | Secure signup/login with httpOnly JWT cookies; every past analysis saved to your account |

---

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite
- TailwindCSS
- Axios · React Router
- Context API for auth state

**Backend**
- Node.js + Express (MVC + Service layer)
- Multer (in-memory PDF uploads) + pdf-parse
- JWT (httpOnly cookies) + bcrypt for auth

**Data Layer** — *polyglot persistence*
- **MongoDB + Mongoose** — flexible storage for AI outputs and multi-turn hint sessions
- **PostgreSQL** — structured, relational store for users, sessions, and auth

**AI**
- Google Gemini 2.5 Flash API
- Structured prompt engineering, JSON-only responses
- Shared `callGemini()` service helper across all four features

---

## 🏗 Architecture

```
CLIENT (React + Vite)
        │  HTTPS / REST
        ▼
SERVER (Express)
  Routes → Controllers → Services
  Middleware: CORS · Auth · Error Handler
        │
   ┌────┴─────┐
   ▼          ▼
Gemini API   MongoDB / PostgreSQL
```

Controllers never talk to Gemini or the databases directly — everything routes through the **service layer**, keeping AI logic testable, swappable, and isolated from HTTP concerns.

---

## 📁 Project Structure

```
code-sage-ai/
├── backend/
│   ├── controllers/        # Request handling + validation
│   ├── routes/             # API route definitions
│   ├── services/           # Gemini AI, PDF, and analysis services
│   ├── models/             # Mongoose schemas
│   ├── middleware/         # Auth, upload, rate limiting, error handling
│   ├── prompts/            # Centralized, versionable AI prompts
│   └── server.js           # Express entry point
├── frontend/
│   └── src/
│       ├── pages/          # Dashboard, ResumeAnalyzer, CodeReviewer, HintGenerator, RoadmapGenerator, History
│       ├── components/     # Navbar, FileUpload, ScoreRing, ResultSection, LoadingSpinner
│       ├── context/        # AuthContext
│       ├── hooks/          # useAnalysis, useAuth
│       ├── services/       # Axios instance (api.js)
│       ├── App.jsx
│       └── main.jsx
└── docs/                   # Architecture + progress docs
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB URI (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- PostgreSQL URI
- Gemini API key → [Get it here](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repo
git clone https://github.com/Shresth-013/code-sage-ai.git
cd code-sage-ai
```

```bash
# Setup backend
cd backend
npm install
```

```bash
# Setup frontend
cd ../frontend
npm install
```

### Environment Variables

Create `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=your_mongodb_connection_string
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Run Locally

```bash
# Terminal 1 — Backend
cd backend
node server.js

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔌 API Reference

| Endpoint | Content-Type | Description |
|---|---|---|
| `POST /api/resume/analyze` | `multipart/form-data` | Upload PDF + job description → ATS analysis |
| `POST /api/code/review` | `application/json` | Code snippet + language → review JSON |
| `POST /api/hints/generate` | `application/json` | Problem description → progressive hint session |
| `POST /api/roadmap/generate` | `application/json` | Goal + skills + time → weekly learning plan |
| `GET /api/history` | `application/json` | Fetch past analyses for the logged-in user |
| `POST /api/auth/signup` | `application/json` | Create account → sets httpOnly JWT cookie |
| `POST /api/auth/login` | `application/json` | Login → sets httpOnly JWT cookie |
| `GET /api/auth/me` | `application/json` | Get current authenticated user |
| `GET /api/health` | — | Server health check |

Every endpoint returns the same envelope shape:

```json
// Success
{ "success": true, "data": { } }

// Error
{ "success": false, "error": { "code": "INVALID_FILE", "message": "Only PDF allowed" } }
```

---

## 🗺 Roadmap

**Up next**
- RAG-powered Resume ↔ Job Description match analyzer (MongoDB Atlas Vector Search)
- Unified navigation bar across all four features
- Mobile-responsive layout + loading skeletons

**Looking ahead**
- Streaming AI responses (SSE) for a token-by-token feel
- PDF export for resume reports
- Dark/light mode toggle
- Zod validation across all request bodies
- Deployment: backend on Render, frontend on Vercel, MongoDB on Atlas

---

## 🔒 Security

- `GEMINI_API_KEY` lives only in the backend `.env` — the client never talks to Gemini directly
- File validation on MIME type + size (5MB PDF limit)
- Rate limiting via `express-rate-limit`
- Auth via httpOnly JWT cookies — not exposed to client-side JS
- All input sanitized before being injected into AI prompts

---

## 🤝 Contributing

This is a personal learning project, built and shipped day by day. Contributions, issues, and suggestions are welcome — feel free to open a PR or star ⭐ the repo if you find it useful!

---

<div align="center">

Built with ❤️ by <a href="https://github.com/Shresth-013">Shresth</a>

</div>
