# ✅ Code Sage AI — TODO Tracker

---

## 🔴 High Priority (Next Up)





---

## 🟡 Medium Priority

- [ ] **Phase 6 — Roadmap Generator**
  - [ ] Input: career goal + current skills + time available
  - [ ] Output: week-by-week plan with topics, resources, mini-projects
  - [ ] Frontend: visual timeline component

- [ ] **Phase 7 — Auth + History**
  - [ ] JWT registration + login (PostgreSQL via Prisma)
  - [ ] Save analysis results to MongoDB per user
  - [ ] `GET /api/history` endpoint
  - [ ] History page — table of past analyses with "View" link

- [ ] Navigation bar linking all four features
- [ ] Mobile responsive design
- [ ] Loading skeletons

- [ ] Persist sessionId in HintGenerator (localStorage or URL param) so a page refresh doesn't lose the conversation

---

## 🟢 Low Priority / Future

- [ ] Streaming AI responses (SSE)
- [ ] Multi-turn conversation for Hints feature
- [ ] Export resume report as PDF
- [ ] Dark/light mode toggle
- [ ] Zod input validation on all request bodies
- [ ] **Phase 4.5 — Code Reviewer Polish (optional)**
  - [ ] Empty state messages when arrays are empty
  - [ ] Copy-fix button on each bug card
  - [ ] Language auto-detect from pasted code

---

## 🚀 Phase 8 — Deployment Checklist

- [ ] Backend → Render (free tier, always-on)
- [ ] Frontend → Vercel (auto-deploy on push)
- [ ] MongoDB → Atlas (free M0 cluster)
- [ ] PostgreSQL → Supabase (free tier)
- [ ] Environment variables configured on all platforms
- [ ] CORS updated for production Vercel URL
- [ ] Final Postman test on live URLs

---

## ✅ Completed

- [x] Project setup — monorepo, Git, MVC structure (Day 1)
- [x] Express backend with health check (Day 1)
- [x] PDF upload with Multer memory storage (Day 2)
- [x] PDF text extraction with pdf-parse (Day 2)
- [x] Resume analysis API + frontend connected (Day 2)
- [x] Gemini 2.5 Flash integration (Day 3)
- [x] Structured ATS prompt engineering (Day 3)
- [x] File validation — PDF only, 5MB (Day 3)
- [x] Production-level error handling (Day 3)
- [x] UI upgrade — score ring, drag & drop, sections (Day 3)
- [x] Refactored geminiServices.js — shared callGemini() helper (Day 4)
- [x] Code Reviewer — backend route + controller + prompt (Day 4)
- [x] Code Reviewer — frontend UI + light theme (Day 4)
- [x] End-to-end test — Code Reviewer working (Day 4)
- [x] Architecture cleanup — split gemini.service.js + prompts.js (Day 5)
- [x] Fixed broken frontend api.js, added real axios instance (Day 5)
- [x] Corrected docs — removed incorrect Tailwind claim (Day 5)
- [x] Phase 5 — LeetCode Hint Generator, multi-turn, MongoDB-backed (Day 6)