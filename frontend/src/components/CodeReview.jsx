import { useState } from "react";
import { reviewCode } from "../services/api";

const LANGUAGES = [
  "JavaScript", "Python", "Java", "C++", "C",
  "TypeScript", "Go", "Rust", "PHP", "Ruby"
];

export default function CodeReview() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReview = async () => {
    if (!code.trim()) {
      setError("Please paste some code first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Code Reviewer</h1>
          <p className="text-gray-500 mt-1">
            Paste your code and get AI-powered feedback instantly.
          </p>
        </div>

        {/* Input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            rows={14}
            className="w-full font-mono text-sm border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            onClick={handleReview}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Reviewing..." : "Review Code"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-5">

            {/* Score + Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start gap-6">
              <div className="flex-shrink-0 text-center">
                <div className={`text-5xl font-bold ${
                  result.overallScore >= 80 ? "text-green-500"
                  : result.overallScore >= 50 ? "text-yellow-500"
                  : "text-red-500"
                }`}>
                  {result.overallScore}
                </div>
                <div className="text-xs text-gray-400 mt-1">Score / 100</div>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800 mb-1">Summary</h2>
                <p className="text-gray-600 text-sm">{result.summary}</p>
              </div>
            </div>

            {/* Bugs */}
            {result.bugs?.length > 0 && (
              <Section title="🐛 Bugs" color="red">
                {result.bugs.map((bug, i) => (
                  <div key={i} className="mb-3 last:mb-0">
                    <p className="text-sm font-medium text-gray-800">
                      {bug.issue}{" "}
                      <span className="text-gray-400 font-normal">— line {bug.line}</span>
                    </p>
                    <p className="text-sm text-green-700 mt-0.5">Fix: {bug.fix}</p>
                  </div>
                ))}
              </Section>
            )}

            <ResultList title="⚡ Performance" items={result.performance} color="yellow" />
            <ResultList title="📖 Readability" items={result.readability} color="blue" />
            <ResultList title="✅ Best Practices" items={result.bestPractices} color="green" />

          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  const colors = {
    red:    "border-red-200 bg-red-50",
    yellow: "border-yellow-200 bg-yellow-50",
    blue:   "border-blue-200 bg-blue-50",
    green:  "border-green-200 bg-green-50",
  };
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function ResultList({ title, items, color }) {
  if (!items?.length) return null;
  return (
    <Section title={title} color={color}>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-700">• {item}</li>
        ))}
      </ul>
    </Section>
  );
}