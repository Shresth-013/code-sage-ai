# 📊 Code Sage AI — Progress Tracker

---

## Day 1 — Project Setup ✅

### Completed
- Created monorepo project structure (backend + frontend + docs)
- Setup React + Vite frontend
- Setup Node.js + Express backend
- Configured TailwindCSS
- Created health check API (`GET /api/health`)
- Initialized Git repository with MVC folder structure

---

## Day 2 — Resume Analyzer Core ✅

### Completed
- PDF upload using Multer (memory storage)
- Text extraction using pdf-parse
- Resume analysis API (mock response first)
- Frontend connected to backend via Axios
- Structured result display — ATS score, strengths, keywords, suggestions

### Notes
- End-to-end flow working: Upload → Extract → Analyze → Display
- Basic SaaS MVP functioning, ready for AI integration

---

## Day 3 — Gemini AI Integration + UI Upgrade ✅

### Completed
- Integrated Gemini 2.5 Flash for real resume analysis
- Structured ATS prompt engineering (JSON-only output)
- File validation — PDF only, 5MB limit
- Production-level error handling — API failures, invalid PDF, empty content
- Fixed pdf-parse ES Module compatibility bug
- Fixed dotenv loading issue
- UI upgrade — score ring, drag & drop, loading spinner, result sections

### Notes
- Real AI analysis working end-to-end
- Gemini 2.5 Flash selected as optimal free tier model

---

## Day 4 — Code Reviewer Feature ✅

### Completed
- `POST /api/code/review` backend endpoint
- Refactored `geminiServices.js` — extracted shared `callGemini()` helper, removed duplicated retry logic
- Code review Gemini prompt — bugs (with line numbers), performance, readability, best practices
- `code.controller.js` + `code.route.js` wired into `server.js`
- `reviewCode()` added to `frontend/src/services/api.js`
- `CodeReviewer.jsx` — textarea, language selector, score ring, bug cards, tabbed results
- Light theme UI for Code Reviewer
- End-to-end tested via Postman + browser

### Notes
- Retry logic now lives in one place — new features only need a new prompt
- Phase 4.5 (optional polish) identified but deprioritized

---
## Day 5 — Phase 4.5: Architecture Cleanup ✅

### Completed
- Split `geminiServices.js` into `services/gemini.service.js` (retry + call logic) and `prompts/prompts.js` (all prompt strings)
- Fixed broken `frontend/src/services/api.js` — was referencing an undefined `api` object, causing a runtime crash on every code review request
- Added real axios instance with `baseURL` from `VITE_API_URL`
- Removed hardcoded `fetch` + URL from `ResumeUpload.jsx`; now uses `analyzeResume()` from `api.js`
- Added `frontend/.env`, ignored `.env` in `frontend/.gitignore`
- Corrected docs — TailwindCSS was never actually installed; project uses a CSS custom-property design-token system

### Notes
- All HTTP calls (frontend) and all Gemini calls (backend) now go through exactly one shared module each
- Codebase is now consistent with the "service layer" and "single axios source" rules from the blueprint
- Ready for Phase 5 — LeetCode Hint Generator, with MongoDB-backed multi-turn conversation

## Day 6 — Phase 5: LeetCode Hint Generator ✅

### Completed
- `models/conversation.model.js` — sessionId, problem, difficulty, messages[] (Mongoose)
- `config/db.js` — connectDB(), wired into server.js startup
- `prompts.js` — HINTS_SYSTEM (socratic mentor rules) + startHintPrompt()
- `gemini.service.js` — getHintResponse() using Gemini's startChat() with Mongo-backed history replay
- `hints.controller.js` + `hints.route.js` — POST /api/hints/start, POST /api/hints/next
- `HintGenerator.jsx` — progressive hint reveal, free-text follow-up questions, chat-style UI
- Fixed Navbar in App.jsx — was using Tailwind classes that did nothing; replaced with inline styles

### Notes
- Hints are the first feature returning plain text instead of JSON — intentional, keeps mentor tone conversational
- Conversation history stored in MongoDB, not client state — session survives a page refresh if sessionId is persisted (not done yet, see Phase 6 notes)
- All three features (resume, code, hints) now share the same {success, data|error} response envelope and the same axios instance

## Day 7 — Phase 6: Roadmap Generator ✅

### Completed
- `models/roadmap.model.js` — goal, level, weeksRequested, hoursPerWeek, weeks[] (Mongoose)
- `prompts.js` — ROADMAP_SYSTEM + roadmapPrompt(goal, level, weeks, hoursPerWeek)
- `gemini.service.js` — generateRoadmapWithGemini(), reuses callGemini() (one-shot JSON, not chat)
- `roadmap.controller.js` + `roadmap.route.js` — POST /api/roadmap/generate (validates + saves), GET /api/roadmap/:id
- `RoadmapGenerator.jsx` — form at /roadmap, shareable saved view at /roadmap/:id
- Copy-shareable-link button; refreshing /roadmap/:id reloads from Mongo (confirmed persistence works, not just client state)

### Notes
- Server-side validation on weeks (1-52) and hoursPerWeek (1-80) — these numbers go straight into a prompt, so bad input isn't just a UX issue, it's a cost/reliability issue
- All four features (resume, code, hints, roadmap) now share the same {success, data|error} envelope and single axios instance
- No auth yet — roadmaps are shareable by ID only, not tied to a user account (planned for Phase 7)

## Upcoming

| Phase | Feature | Status |
|-------|---------|--------|
| 4.5 | Code Reviewer polish (copy fix, empty states) | Optional |
| 5 | LeetCode Hint Generator | Next |
| 6 | Roadmap Generator | Upcoming |
| 7 | Auth + History (JWT + PostgreSQL) | Upcoming |
| 8 | Deployment (Render + Vercel) | Final |