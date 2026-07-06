import { useState } from "react";
import { reviewCode } from "../services/api";

const LANGUAGES = [
  "JavaScript", "Python", "Java", "C++", "C",
  "TypeScript", "Go", "Rust", "PHP", "Ruby"
];

function Section({ title, items, accent }) {
  return (
    <div className="card" style={{ padding: "16px 20px" }}>
      <h3 style={{
        margin: "0 0 12px", fontSize: "0.78rem", fontWeight: 600,
        letterSpacing: "0.08em", textTransform: "uppercase", color: accent,
        fontFamily: "'DM Sans', sans-serif",
      }}>{title}</h3>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <li key={i} style={{
            display: "flex", gap: 8, fontSize: "0.85rem",
            color: "var(--text)", lineHeight: 1.6,
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
      background: "rgba(248,113,113,0.08)",
      border: "1px solid rgba(248,113,113,0.25)",
      borderRadius: 10, padding: "12px 16px",
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "0.82rem", color: "var(--danger)", fontWeight: 600 }}>
          {bug.issue}
        </span>
        <span style={{
          fontSize: "0.7rem", padding: "2px 8px", borderRadius: 100,
          background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)",
          color: "var(--danger)", whiteSpace: "nowrap", flexShrink: 0,
        }}>line {bug.line}</span>
      </div>
      <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text)", lineHeight: 1.5 }}>
        <span style={{ color: "var(--success)", fontWeight: 500 }}>Fix: </span>
        {bug.fix}
      </p>
    </div>
  );
}

function ScoreRing({ score }) {
  const color =
    score >= 80 ? "var(--success)" :
    score >= 60 ? "var(--warn)" :
    score >= 40 ? "#ea580c" : "var(--danger)";

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
        background: "var(--surface-2)",
      }}>
        <span style={{ fontSize: "2rem", fontWeight: 800,
          fontFamily: "'DM Sans', sans-serif", color }}>{score}</span>
        <span style={{ fontSize: "0.58rem", color, opacity: 0.8,
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
    <div className="fade-in" style={{
      minHeight: "100svh",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "48px 16px 64px",
    }}>
      <div style={{ width: "100%", maxWidth: 580 }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800, fontSize: "1.7rem",
            letterSpacing: "-0.02em",
            color: "var(--text-bright)",
            margin: "0 0 4px",
          }}>Code Reviewer</h1>
          <p style={{
            margin: 0, fontSize: "0.85rem",
            color: "var(--text)",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Paste your code and get AI-powered feedback instantly.
          </p>
        </div>

        {/* Input Card */}
        <div className="card" style={{ padding: "24px", marginBottom: 12 }}>
          {/* Language Selector */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 14,
          }}>
            <span style={{
              fontSize: "0.78rem", fontWeight: 600,
              color: "var(--text)",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 8, padding: "5px 10px",
                color: "var(--text-bright)",
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
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 10, padding: "12px 14px",
              color: "var(--text-bright)",
              resize: "vertical", outline: "none",
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.25)",
            borderRadius: 10, padding: "10px 14px",
            fontSize: "0.82rem", color: "var(--danger)",
            marginBottom: 12,
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Review Button */}
        <button
          className="btn-primary"
          onClick={handleReview}
          disabled={loading || !code.trim()}
          style={{
            width: "100%", padding: "13px",
            background: loading || !code.trim()
              ? "var(--surface-2)"
              : "linear-gradient(100deg, var(--accent), var(--accent-2))",
            color: loading || !code.trim() ? "var(--text)" : "#0a0a0f",
            fontSize: "0.95rem",
            letterSpacing: "0.02em",
            marginBottom: 12,
          }}
        >
          {loading ? "Reviewing…" : "Review Code"}
        </button>

        {/* Loading */}
        {loading && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, color: "var(--accent-2)", fontSize: "0.82rem",
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
            <div className="card" style={{
              padding: "28px 24px",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 14,
            }}>
              <ScoreRing score={result.overallScore} />
              <p style={{
                margin: 0, textAlign: "center", fontSize: "0.85rem",
                color: "var(--text)", maxWidth: 400, lineHeight: 1.7,
              }}>{result.summary}</p>
            </div>

            {/* Bugs */}
            {result.bugs?.length > 0 && (
              <div className="card" style={{ padding: "16px 20px" }}>
                <h3 style={{
                  margin: "0 0 12px", fontSize: "0.78rem", fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "var(--danger)", fontFamily: "'DM Sans', sans-serif",
                }}>🐛 Bugs</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.bugs.map((bug, i) => <BugCard key={i} bug={bug} />)}
                </div>
              </div>
            )}

            <Section title="⚡ Performance"   items={result.performance}   accent="var(--warn)" />
            <Section title="📖 Readability"   items={result.readability}   accent="var(--accent-2)" />
            <Section title="✅ Best Practices" items={result.bestPractices} accent="var(--success)" />

          </div>
        )}
      </div>
    </div>
  );
}