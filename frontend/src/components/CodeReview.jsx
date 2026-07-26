// frontend/src/components/CodeReview.jsx
import { useState } from "react";
import {
  Code2, AlertTriangle, Loader2, Bug, Zap, BookOpen, CheckCircle2, ChevronDown,
} from "lucide-react";
import { reviewCode } from "../services/api";
import PageHeader from "./PageHeader";

const LANGUAGES = [
  "JavaScript", "Python", "Java", "C++", "C",
  "TypeScript", "Go", "Rust", "PHP", "Ruby",
];

const WHAT_WE_CHECK = [
  { icon: Bug, label: "Bugs", desc: "Logic errors and edge cases the code doesn't handle." },
  { icon: Zap, label: "Performance", desc: "Inefficient patterns and avoidable overhead." },
  { icon: BookOpen, label: "Readability", desc: "Naming, structure, and clarity for the next reader." },
  { icon: CheckCircle2, label: "Best Practices", desc: "Idioms and conventions for the language you picked." },
];

function WhatWeCheck() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h2 className="font-display font-semibold text-sm text-text-bright mb-4">What we check</h2>
      <div className="flex flex-col gap-4">
        {WHAT_WE_CHECK.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-2/10 text-accent-2 flex items-center justify-center shrink-0">
              <Icon size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-bright">{label}</p>
              <p className="text-xs text-text mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        <span className="text-[10px] uppercase tracking-wider" style={{ color, opacity: 0.85 }}>score</span>
      </div>
      <span className="text-sm font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

function Section({ title, items, accentClass, Icon }) {
  if (!items?.length) return null;
  return (
    <div className="bg-surface-2 border border-border rounded-xl p-5 h-full">
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

function BugCard({ bug }) {
  return (
    <div className="bg-danger/10 border border-danger/25 rounded-xl p-4 flex flex-col gap-1.5">
      <div className="flex justify-between items-center gap-2">
        <span className="text-sm text-danger font-semibold">{bug.issue}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-danger/15 border border-danger/30 text-danger whitespace-nowrap shrink-0">
          line {bug.line}
        </span>
      </div>
      <p className="text-sm text-text leading-relaxed">
        <span className="text-success font-medium">Fix: </span>
        {bug.fix}
      </p>
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
    <div className="min-h-screen px-4 md:px-10 py-10 md:py-14">
      <div className="w-full max-w-5xl mx-auto">
        <PageHeader
          eyebrow=" code_reviewer"
          title="Code Reviewer"
          subtitle="Paste your code and get AI-powered feedback on bugs, performance, and readability."
          accent="accent-2"
        />

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-5">
          <div>
            <div className="bg-surface border border-border rounded-2xl p-5 mb-3">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text">
                  <Code2 size={14} />
                  Language
                </span>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="appearance-none bg-surface-2 border border-border rounded-lg pl-3 pr-8 py-1.5 text-sm text-text-bright cursor-pointer outline-none focus:border-accent-2 transition-colors"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text/60" />
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                rows={16}
                className="w-full font-mono text-[13px] leading-relaxed bg-surface-2 border border-border rounded-xl p-4 text-text-bright placeholder:text-text/40 resize-vertical outline-none focus:border-accent-2 transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-danger/10 border border-danger/25 rounded-lg px-3.5 py-2.5 text-sm text-danger mb-3">
                <AlertTriangle size={15} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleReview}
              disabled={loading || !code.trim()}
              className={`w-full py-3.5 rounded-xl font-display font-bold text-sm tracking-wide transition-opacity mb-3 ${
                loading || !code.trim()
                  ? "bg-surface-2 text-text/40 cursor-not-allowed"
                  : "bg-accent-2 text-[#06120a] hover:opacity-90 cursor-pointer"
              }`}
            >
              {loading ? "Reviewing…" : "Review Code"}
            </button>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-accent-2 text-sm">
                <Loader2 size={14} className="animate-spin" />
                Gemini is reviewing your code
              </div>
            )}
          </div>

          <WhatWeCheck />
        </div>

        {result && (
          <div className="mt-5 flex flex-col gap-4">
            <div className="bg-surface border border-border rounded-2xl p-7 flex flex-col items-center gap-4">
              <ScoreRing score={result.overallScore} />
              <p className="text-center text-sm text-text max-w-xl leading-relaxed">{result.summary}</p>
            </div>

            {result.bugs?.length > 0 && (
              <div className="bg-surface border border-border rounded-2xl p-5">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3 text-danger">
                  <Bug size={14} />
                  Bugs
                </h3>
                <div className="flex flex-col gap-2.5">
                  {result.bugs.map((bug, i) => <BugCard key={i} bug={bug} />)}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <Section title="Performance"     items={result.performance}   accentClass="text-warn"     Icon={Zap} />
              <Section title="Readability"     items={result.readability}   accentClass="text-accent-4" Icon={BookOpen} />
            </div>
            <Section title="Best Practices" items={result.bestPractices} accentClass="text-success" Icon={CheckCircle2} />
          </div>
        )}
      </div>
    </div>
  );
}
