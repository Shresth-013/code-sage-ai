<div align="center">

# 🧠 Code Sage AI

### AI-powered developer assistant for resumes, code, and learning

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## ✨ Features

| Feature | Status | Description |
|---------|--------|-------------|
| 📄 Resume Analyzer | ✅ Live | ATS scoring, strengths, keywords, suggestions |
| 🔍 Code Reviewer | 🔜 Coming | AI-powered code review and best practices |
| 💡 LeetCode Hints | 🔜 Coming | Step-by-step hints without spoilers |
| 🗺️ Roadmap Generator | 🔜 Coming | Personalized learning roadmaps |

---

## 🛠 Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS
- Component-based architecture

### Backend
- Node.js + Express
- MVC Architecture
- Multer (file uploads)
- pdf-parse (PDF extraction)

### AI
- Google Gemini 2.5 Flash API
- Structured prompt engineering
- JSON response parsing

---

## 📁 Project Structure

\`\`\`
code-sage-ai/
├── backend/
│   ├── controllers/        # Request handling + validation
│   ├── routes/             # API route definitions
│   ├── services/           # Gemini AI + PDF services
│   └── server.js           # Express entry point
├── frontend/
│   └── src/
│       ├── components/     # React components
│       ├── App.jsx
│       └── main.jsx
└── docs/                   # Architecture + progress docs
\`\`\`

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Gemini API key → [Get it here](https://aistudio.google.com/app/apikey)

### Installation

\`\`\`bash
# Clone the repo
git clone https://github.com/Shresth-013/code-sage-ai.git
cd code-sage-ai
\`\`\`

\`\`\`bash
# Setup backend
cd backend
npm install
\`\`\`

\`\`\`bash
# Setup frontend
cd ../frontend
npm install
\`\`\`

### Environment Variables

Create `backend/.env`:
\`\`\`env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
\`\`\`

### Run Locally

\`\`\`bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
\`\`\`

Open **http://localhost:5173** in your browser.

---

## 📊 Progress

- [x] Day 1 — Project setup + Express server
- [x] Day 2 — Resume Analyzer core (PDF upload + extraction)
- [x] Day 3 — Gemini AI integration + UI upgrade
- [ ] Day 4 — Code Reviewer
- [ ] Day 5 — LeetCode Hint Generator
- [ ] Day 6 — Roadmap Generator
- [ ] Day 7 — UI Polish + Navigation
- [ ] Day 8 — Deployment (Render + Vercel)

---

## 📸 Demo

> Resume Analyzer — Upload your PDF resume and get instant AI-powered ATS analysis

![Demo coming soon]

---

## 🤝 Contributing

This is a personal learning project built day by day.
Feel free to star ⭐ the repo if you find it useful!

---

<div align="center">
Built with ❤️ by <a href="https://github.com/Shresth-013">Shresth</a>
</div>
