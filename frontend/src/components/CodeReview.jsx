import { useState } from "react";
import { reviewCode } from "../services/api";

const LANGUAGES = [
  "JavaScript", "Python", "Java", "C++", "C",
  "TypeScript", "Go", "Rust", "PHP", "Ruby"
];

function Section({ title, items, accent }) {
  return (
    <div style={{
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: 12, padding: "16px 20px",
    }}>
      <h3 style={{
        margin: "0 0 12px", fontSize: "0.78rem", fontWeight: 600,
        letterSpacing: "0.08em", textTransform: "uppercase", color: accent,
        fontFamily: "'DM Sans', sans-serif",
      }}>{title}</h3>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <li key={i} style={{
            display: "flex", gap: 8, fontSize: "0.85rem",
            color: "#475569", lineHeight: 1.6,
          }}>
            <span style={{ color: accent, marginTop: 1, flexShrink: 0 }}>›</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BugCard({ bug }) {
  return (
    <div style={{
      background: "#fff5f5",
      border: "1px solid #fecaca",
      borderRadius: 10, padding: "12px 16px",
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "0.82rem", color: "#dc2626", fontWeight: 600 }}>
          {bug.issue}
        </span>
        <span style={{
          fontSize: "0.7rem", padding: "2px 8px", borderRadius: 100,
          background: "#fee2e2", border: "1px solid #fecaca",
          color: "#dc2626", whiteSpace: "nowrap", flexShrink: 0,
        }}>line {bug.line}</span>
      </div>
      <p style={{ margin: 0, fontSize: "0.82rem", color: "#475569", lineHeight: 1.5 }}>
        <span style={{ color: "#16a34a", fontWeight: 500 }}>Fix: </span>
        {bug.fix}
      </p>
    </div>
  );
}

function ScoreRing({ score }) {
  const color =
    score >= 80 ? "#16a34a" :
    score >= 60 ? "#d97706" :
    score >= 40 ? "#ea580c" : "#dc2626";

  const label =
    score >= 80 ? "Excellent" :
    score >= 60 ? "Good" :
    score >= 40 ? "Average" : "Poor";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 110, height: 110, borderRadius: "50%",
        border: `5px solid ${color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column",
        background: `${color}10`,
      }}>
        <span style={{ fontSize: "2rem", fontWeight: 800,
          fontFamily: "'DM Sans', sans-serif", color }}>{score}</span>
        <span style={{ fontSize: "0.58rem", color, opacity: 0.7,
          letterSpacing: "0.1em", textTransform: "uppercase" }}>score</span>
      </div>
      <span style={{ fontSize: "0.75rem", fontWeight: 600, color }}>{label}</span>
    </div>
  );
}

export default function CodeReview() {
  const [code, setCode]         = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleReview = async () => {
    if (!code.trim()) { setError("Please paste some code first."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await reviewCode({ code, language });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100svh",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "48px 16px 64px",
      background: "#f1f5f9",
    }}>
      <div style={{ width: "100%", maxWidth: 580 }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 800, fontSize: "1.7rem",
            letterSpacing: "-0.02em",
            color: "#0f172a",
            margin: "0 0 4px",
          }}>Code Reviewer</h1>
          <p style={{
            margin: 0, fontSize: "0.85rem",
            color: "#94a3b8",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Paste your code and get AI-powered feedback instantly.
          </p>
        </div>

        {/* Input Card */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 16, padding: "24px",
          marginBottom: 12,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          {/* Language Selector */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 14,
          }}>
            <span style={{
              fontSize: "0.78rem", fontWeight: 600,
              color: "#94a3b8",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 8, padding: "5px 10px",
                color: "#0f172a",
                fontSize: "0.82rem",
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer", outline: "none",
              }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Code Textarea */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            rows={14}
            style={{
              width: "100%", boxSizing: "border-box",
              fontFamily: "'Courier New', monospace",
              fontSize: "0.82rem", lineHeight: 1.6,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 10, padding: "12px 14px",
              color: "#1e293b",
              resize: "vertical", outline: "none",
              transition: "border 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#93c5fd"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#fff5f5",
            border: "1px solid #fecaca",
            borderRadius: 10, padding: "10px 14px",
            fontSize: "0.82rem", color: "#dc2626",
            marginBottom: 12,
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Review Button */}
        <button
          onClick={handleReview}
          disabled={loading || !code.trim()}
          style={{
            width: "100%", padding: "13px",
            borderRadius: 12, border: "none",
            background: loading || !code.trim()
              ? "#e2e8f0"
              : "linear-gradient(100deg, #3b82f6, #6366f1)",
            color: loading || !code.trim() ? "#94a3b8" : "#ffffff",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: "0.95rem",
            letterSpacing: "0.02em",
            cursor: loading || !code.trim() ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            marginBottom: 12,
          }}
        >
          {loading ? "Reviewing…" : "Review Code"}
        </button>

        {/* Loading */}
        {loading && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, color: "#6366f1", fontSize: "0.82rem",
            marginBottom: 16,
          }}>
            <svg style={{ animation: "spin 1s linear infinite", width: 14, height: 14 }}
              fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor"
                strokeWidth="4" strokeOpacity="0.2"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Gemini is reviewing your code
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>

            {/* Score Card */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 16, padding: "28px 24px",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 14,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <ScoreRing score={result.overallScore} />
              <p style={{
                margin: 0, textAlign: "center", fontSize: "0.85rem",
                color: "#475569", maxWidth: 400, lineHeight: 1.7,
              }}>{result.summary}</p>
            </div>

            {/* Bugs */}
            {result.bugs?.length > 0 && (
              <div style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 12, padding: "16px 20px",
              }}>
                <h3 style={{
                  margin: "0 0 12px", fontSize: "0.78rem", fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "#dc2626", fontFamily: "'DM Sans', sans-serif",
                }}>🐛 Bugs</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.bugs.map((bug, i) => <BugCard key={i} bug={bug} />)}
                </div>
              </div>
            )}

            <Section title="⚡ Performance"   items={result.performance}   accent="#d97706" />
            <Section title="📖 Readability"   items={result.readability}   accent="#6366f1" />
            <Section title="✅ Best Practices" items={result.bestPractices} accent="#16a34a" />

          </div>
        )}
      </div>
    </div>
  );
}