import { useState } from "react";

import { analyzeResume } from "../services/api";

// ── Logo ──────────────────────────────────────────────────
function Logo() {
  return (
    <div className="flex flex-col items-center gap-3 mb-2">
      {/* Icon mark */}
      <div style={{
        width: 56, height: 56,
        borderRadius: 16,
        background: "linear-gradient(135deg, #5eead4 0%, #818cf8 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 32px rgba(94,234,212,0.25), 0 0 64px rgba(129,140,248,0.15)",
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M7 9l-4 5 4 5M21 9l4 5-4 5M16 6l-4 16"
            stroke="#0a0a0f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "2rem",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          background: "linear-gradient(100deg, #5eead4 0%, #a5b4fc 50%, #f0f0ff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          CodeSage<span style={{
            background: "linear-gradient(100deg, #818cf8, #5eead4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}> AI</span>
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "0.7rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(160,160,184,0.6)",
          marginTop: 4,
        }}>
          Developer Intelligence
        </div>
      </div>
    </div>
  );
}

// ── Nav pills ─────────────────────────────────────────────
const FEATURES = [
  { label: "Resume Analyzer", icon: "◈", live: true },
  { label: "Code Reviewer",   icon: "⟨/⟩", live: false },
  { label: "LeetCode Hints",  icon: "⌬", live: false },
  { label: "Roadmap",         icon: "⊕", live: false },
];

function FeatureNav({ active }) {
  return (
    <div style={{
      display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center",
      marginBottom: 28,
    }}>
      {FEATURES.map((f) => (
        <div key={f.label} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 12px",
          borderRadius: 100,
          fontSize: "0.75rem",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          border: f.label === active
            ? "1px solid rgba(94,234,212,0.5)"
            : "1px solid rgba(255,255,255,0.07)",
          background: f.label === active
            ? "rgba(94,234,212,0.08)"
            : "rgba(255,255,255,0.03)",
          color: f.label === active ? "#5eead4" : "rgba(160,160,184,0.5)",
          cursor: f.live ? "pointer" : "default",
        }}>
          <span>{f.icon}</span>
          <span>{f.label}</span>
          {!f.live && (
            <span style={{
              fontSize: "0.6rem", padding: "1px 6px",
              background: "rgba(129,140,248,0.12)",
              border: "1px solid rgba(129,140,248,0.2)",
              borderRadius: 100, color: "#818cf8",
            }}>soon</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Score Ring ────────────────────────────────────────────
function ScoreRing({ score }) {
  const color =
    score >= 80 ? "#4ade80" :
    score >= 60 ? "#fbbf24" :
    score >= 40 ? "#fb923c" : "#f87171";

  const label =
    score >= 80 ? "Excellent" :
    score >= 60 ? "Good" :
    score >= 40 ? "Average" : "Poor";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 120, height: 120, borderRadius: "50%",
        border: `6px solid ${color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column",
        boxShadow: `0 0 24px ${color}33`,
        background: `${color}08`,
      }}>
        <span style={{ fontSize: "2.2rem", fontWeight: 800,
          fontFamily: "'Syne', sans-serif", color }}>{score}</span>
        <span style={{ fontSize: "0.6rem", color, opacity: 0.8,
          letterSpacing: "0.1em", textTransform: "uppercase" }}>ATS</span>
      </div>
      <span style={{ fontSize: "0.75rem", fontWeight: 600, color }}>{label}</span>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────
function Section({ title, items, accent }) {
  return (
    <div style={{
      background: "var(--surface-2)",
      border: "1px solid var(--border)",
      borderRadius: 12, padding: "16px 20px",
    }}>
      <h3 style={{
        margin: "0 0 12px", fontSize: "0.8rem", fontWeight: 600,
        letterSpacing: "0.08em", textTransform: "uppercase", color: accent,
        fontFamily: "'DM Sans', sans-serif",
      }}>{title}</h3>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <li key={i} style={{
            display: "flex", gap: 8, fontSize: "0.85rem",
            color: "var(--text)", lineHeight: 1.5,
          }}>
            <span style={{ color: accent, marginTop: 1, flexShrink: 0 }}>›</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Keywords ──────────────────────────────────────────────
function KeywordBadges({ keywords }) {
  return (
    <div style={{
      background: "var(--surface-2)",
      border: "1px solid var(--border)",
      borderRadius: 12, padding: "16px 20px",
    }}>
      <h3 style={{
        margin: "0 0 12px", fontSize: "0.8rem", fontWeight: 600,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: "var(--accent-2)", fontFamily: "'DM Sans', sans-serif",
      }}>Missing Keywords</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {keywords.map((kw, i) => (
          <span key={i} style={{
            padding: "3px 10px", borderRadius: 100, fontSize: "0.75rem",
            background: "rgba(129,140,248,0.1)",
            border: "1px solid rgba(129,140,248,0.2)",
            color: "#a5b4fc", fontWeight: 500,
          }}>{kw}</span>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function ResumeUpload() {
  const [file, setFile]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    setError(""); setResult(null);
    if (!f) return;
    if (f.type !== "application/pdf") { setError("Only PDF files are accepted."); return; }
    if (f.size > 5 * 1024 * 1024)    { setError("File size must be under 5MB."); return; }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
  if (!file) { setError("Please select a PDF file first."); return; }
  const formData = new FormData();
  formData.append("resume", file);
  setLoading(true); setError(""); setResult(null);
  try {
    const res = await analyzeResume(formData);
    if (!res.data.success) setError(res.data.error || "Analysis failed.");
    else setResult(res.data.data);
  } catch (err) {
    setError(err.response?.data?.error || "Network error. Is the backend running on port 5000?");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{
      minHeight: "100svh",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "48px 16px 64px",
      background: "var(--bg)",
    }}>
      <div style={{ width: "100%", maxWidth: 580 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo />
        </div>

        {/* Feature Nav */}
        <FeatureNav active="Resume Analyzer" />

        {/* Upload Card */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          style={{
            border: `1.5px dashed ${dragOver ? "var(--accent)" : file ? "rgba(94,234,212,0.3)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 16,
            background: dragOver ? "rgba(94,234,212,0.04)" : "var(--surface)",
            padding: "36px 24px",
            textAlign: "center",
            transition: "all 0.2s ease",
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: 10 }}>
            {file ? "✦" : "⊹"}
          </div>
          <p style={{
            margin: "0 0 16px",
            fontSize: "0.9rem",
            color: file ? "var(--accent)" : "var(--text)",
            fontWeight: file ? 500 : 400,
          }}>
            {file ? file.name : "Drop your resume here, or browse"}
          </p>
          <input type="file" accept=".pdf" id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])} />
          <label htmlFor="fileInput" style={{
            display: "inline-block",
            padding: "8px 20px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--text-bright)",
            fontSize: "0.8rem", fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.2s",
          }}>
            Select PDF
          </label>
          <p style={{ margin: "12px 0 0", fontSize: "0.7rem", color: "rgba(160,160,184,0.4)" }}>
            PDF only · Max 5MB
          </p>
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

        {/* Analyze Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          style={{
            width: "100%", padding: "13px",
            borderRadius: 12, border: "none",
            background: loading || !file
              ? "rgba(255,255,255,0.05)"
              : "linear-gradient(100deg, #5eead4, #818cf8)",
            color: loading || !file ? "rgba(160,160,184,0.4)" : "#0a0a0f",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700, fontSize: "0.95rem",
            letterSpacing: "0.02em",
            cursor: loading || !file ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            marginBottom: 12,
          }}
        >
          {loading ? "Analyzing…" : "Analyze Resume"}
        </button>

        {/* Loading state */}
        {loading && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, color: "var(--accent)", fontSize: "0.82rem",
            marginBottom: 16,
          }}>
            <svg style={{ animation: "spin 1s linear infinite", width: 14, height: 14 }}
              fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor"
                strokeWidth="4" strokeOpacity="0.2"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Gemini is reading your resume
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {/* Score card */}
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16, padding: "28px 24px",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 14,
            }}>
              <ScoreRing score={result.score} />
              <p style={{
                margin: 0, textAlign: "center", fontSize: "0.85rem",
                color: "var(--text)", maxWidth: 400, lineHeight: 1.7,
              }}>{result.summary}</p>
            </div>

            <Section title="Strengths"   items={result.strengths}   accent="var(--success)" />
            <Section title="Weaknesses"  items={result.weaknesses}  accent="var(--danger)" />
            <KeywordBadges keywords={result.missingKeywords} />
            <Section title="Suggestions" items={result.suggestions} accent="var(--warn)" />
          </div>
        )}
      </div>
    </div>
  );
}