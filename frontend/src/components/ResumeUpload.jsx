// frontend/src/components/ResumeUpload.jsx
import { useState } from "react";
import { UploadCloud, FileCheck2, AlertTriangle, Loader2, CheckCircle2, XCircle, Lightbulb, Tag } from "lucide-react";
import { analyzeResume } from "../services/api";

// ── Page header — mono eyebrow + title, reused pattern across every page ──
function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-8 text-center">
      <p className="font-mono text-xs text-accent mb-2">{eyebrow}</p>
      <h1 className="font-display font-semibold text-2xl md:text-3xl text-text-bright">{title}</h1>
      {subtitle && <p className="text-sm text-text mt-2 max-w-md mx-auto">{subtitle}</p>}
    </div>
  );
}

// ── Score Ring ──────────────────────────────────────────────
function ScoreRing({ score }) {
  const color =
    score >= 80 ? "var(--success)" :
    score >= 60 ? "var(--warn)" :
    score >= 40 ? "#e08a3f" : "var(--danger)";

  const label =
    score >= 80 ? "Excellent" :
    score >= 60 ? "Good" :
    score >= 40 ? "Average" : "Poor";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-28 h-28 rounded-full flex flex-col items-center justify-center"
        style={{ border: `6px solid ${color}`, boxShadow: `0 0 24px ${color}33`, background: `${color}10` }}
      >
        <span className="font-display font-bold text-3xl" style={{ color }}>{score}</span>
        <span className="text-[10px] uppercase tracking-wider" style={{ color, opacity: 0.85 }}>ATS</span>
      </div>
      <span className="text-sm font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

// ── Section card ────────────────────────────────────────────
function Section({ title, items, accentClass, Icon }) {
  return (
    <div className="bg-surface-2 border border-border rounded-xl p-5">
      <h3 className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3 ${accentClass}`}>
        <Icon size={14} />
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-text leading-relaxed">
            <span className={`mt-0.5 shrink-0 ${accentClass}`}>›</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Keyword badges ──────────────────────────────────────────
function KeywordBadges({ keywords }) {
  return (
    <div className="bg-surface-2 border border-border rounded-xl p-5">
      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3 text-accent-2">
        <Tag size={14} />
        Missing Keywords
      </h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, i) => (
          <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent-2/10 border border-accent-2/20 text-accent-2">
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────
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
    <div className="min-h-screen px-4 md:px-8 py-10 md:py-14">
      <div className="w-full max-w-xl mx-auto">
        <PageHeader
          eyebrow="// resume_analyzer"
          title="Resume Analyzer"
          subtitle="Upload your resume as a PDF and get an ATS score with specific, actionable feedback."
        />

        {/* Upload Card */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`rounded-2xl border-2 border-dashed p-9 text-center transition-colors mb-3 ${
            dragOver
              ? "border-accent bg-accent/5"
              : file
              ? "border-accent/40 bg-surface"
              : "border-border bg-surface"
          }`}
        >
          <div className="flex justify-center mb-3 text-accent">
            {file ? <FileCheck2 size={30} /> : <UploadCloud size={30} />}
          </div>
          <p className={`mb-4 text-sm ${file ? "text-accent font-medium" : "text-text"}`}>
            {file ? file.name : "Drop your resume here, or browse"}
          </p>
          <input type="file" accept=".pdf" id="fileInput" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          <label
            htmlFor="fileInput"
            className="inline-block px-5 py-2 rounded-lg bg-surface-2 border border-border text-text-bright text-sm font-medium cursor-pointer hover:bg-border transition-colors"
          >
            Select PDF
          </label>
          <p className="mt-3 text-xs text-text/50">PDF only · Max 5MB</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-danger/10 border border-danger/25 rounded-lg px-3.5 py-2.5 text-sm text-danger mb-3">
            <AlertTriangle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className={`w-full py-3.5 rounded-xl font-display font-bold text-sm tracking-wide transition-opacity mb-3 ${
            loading || !file
              ? "bg-surface-2 text-text/40 cursor-not-allowed"
              : "bg-accent text-bg hover:opacity-90 cursor-pointer"
          }`}
        >
          {loading ? "Analyzing…" : "Analyze Resume"}
        </button>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-accent text-sm mb-4">
            <Loader2 size={14} className="animate-spin" />
            Gemini is reading your resume
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="flex flex-col gap-3 mt-2">
            <div className="bg-surface border border-border rounded-2xl p-7 flex flex-col items-center gap-4">
              <ScoreRing score={result.score} />
              <p className="text-center text-sm text-text max-w-sm leading-relaxed">{result.summary}</p>
            </div>

            <Section title="Strengths" items={result.strengths} accentClass="text-success" Icon={CheckCircle2} />
            <Section title="Weaknesses" items={result.weaknesses} accentClass="text-danger" Icon={XCircle} />
            <KeywordBadges keywords={result.missingKeywords} />
            <Section title="Suggestions" items={result.suggestions} accentClass="text-warn" Icon={Lightbulb} />
          </div>
        )}
      </div>
    </div>
  );
}