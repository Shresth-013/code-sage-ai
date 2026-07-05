// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ResumeUpload from "./components/ResumeUpload";
import CodeReview from "./components/CodeReview";
import HintGenerator from "./components/HintGenerator";

function Navbar() {
  return (
    <nav style={{
      background: "var(--surface)", borderBottom: "1px solid var(--border)",
      padding: "16px 24px", display: "flex", alignItems: "center", gap: 24,
    }}>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "var(--accent)", fontSize: "1.1rem" }}>
        Code Sage AI
      </span>
      {[
        { to: "/", label: "Resume Analyzer" },
        { to: "/code", label: "Code Reviewer" },
        { to: "/hints", label: "Hint Generator" },
      ].map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          style={{
            color: "var(--text)", fontSize: "0.85rem", fontWeight: 500,
            textDecoration: "none",
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100svh", background: "var(--bg)" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<ResumeUpload />} />
          <Route path="/code" element={<CodeReview />} />
          <Route path="/hints" element={<HintGenerator />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;