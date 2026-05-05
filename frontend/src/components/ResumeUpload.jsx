import { useState } from "react";

const API_URL = "http://localhost:5000/api/resume/analyze";

function ScoreRing({ score }) {
  const color =
    score >= 80 ? "#22c55e" :
    score >= 60 ? "#f59e0b" :
    score >= 40 ? "#f97316" : "#ef4444";

  const label =
    score >= 80 ? "Excellent" :
    score >= 60 ? "Good" :
    score >= 40 ? "Average" : "Poor";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-36 h-36 rounded-full flex items-center justify-center text-5xl font-bold border-8"
        style={{ borderColor: color, color }}
      >
        {score}
      </div>
      <span className="text-sm font-semibold" style={{ color }}>
        {label} ATS Score
      </span>
    </div>
  );
}

function Section({ title, items, color }) {
  return (
    <div className="bg-gray-800 rounded-xl p-5">
      <h3 className={`text-lg font-semibold mb-3 ${color}`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
            <span className="mt-0.5 text-gray-500">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function KeywordBadges({ keywords }) {
  return (
    <div className="bg-gray-800 rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-3 text-purple-400">🔍 Missing Keywords</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-purple-900/60 text-purple-200 rounded-full text-xs font-medium border border-purple-700"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    setError("");
    setResult(null);
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(API_URL, { method: "POST", body: formData });
      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Analysis failed. Please try again.");
      } else {
        setResult(json.data);
      }
    } catch (err) {
      setError("Network error. Is the backend running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-400">📄 Resume Analyzer</h1>
          <p className="text-gray-400 mt-2 text-sm">
            AI-powered ATS scoring — Gemini 1.5 Flash
          </p>
        </div>

        {/* Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
            dragOver
              ? "border-blue-400 bg-blue-900/20"
              : "border-gray-600 bg-gray-800 hover:border-gray-400"
          }`}
        >
          <div className="text-4xl mb-3">📁</div>
          <p className="text-gray-300 text-sm mb-4">
            {file
              ? <span className="text-green-400 font-medium">✅ {file.name}</span>
              : "Drag & drop your resume here, or click below"
            }
          </p>
          <input
            type="file"
            accept=".pdf"
            id="fileInput"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            Select PDF
          </label>
          <p className="text-xs text-gray-500 mt-3">PDF only · Max 5MB</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-lg transition"
        >
          {loading ? "Analyzing..." : "🔍 Analyze Resume"}
        </button>

        {/* Spinner */}
        {loading && (
          <div className="flex justify-center items-center gap-3 text-blue-400">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm">Gemini is analyzing your resume...</span>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center gap-4 border border-gray-700">
              <ScoreRing score={result.score} />
              <p className="text-gray-300 text-center text-sm max-w-md leading-relaxed">
                {result.summary}
              </p>
            </div>
            <Section title="✅ Strengths"   items={result.strengths}   color="text-green-400" />
            <Section title="❌ Weaknesses"  items={result.weaknesses}  color="text-red-400" />
            <KeywordBadges keywords={result.missingKeywords} />
            <Section title="💡 Suggestions" items={result.suggestions} color="text-yellow-400" />
          </div>
        )}

      </div>
    </div>
  );
}