# ✅ Code Sage AI — TODO Tracker

---

## 🔴 High Priority (Next Up)

- [ ] Phase 7 — `protect` middleware + attach `userId` to Conversation/Roadmap + `GET /api/auth/me` + `GET /api/user/history`
- [ ] Phase 7 — Frontend: Login.jsx, Signup.jsx, auth context, protected route wrapper, History.jsx

---

## 🟡 Medium Priority

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
- [x] Phase 6 — Roadmap Generator, saved + shareable via MongoDB (Day 7)

---

## 🧪 Test Authentication

```bash
curl -i -c cookies.txt -X POST http://localhost:5000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"password123"}'
```