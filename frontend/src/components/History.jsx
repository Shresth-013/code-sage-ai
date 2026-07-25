// frontend/src/components/History.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getHistory } from "../services/api";

function HistoryCard({ item }) {
  const isRoadmap = item.type === "roadmap";

  const cardStyle = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 6,
  };

  const badgeStyle = {
    alignSelf: "flex-start", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.04em", padding: "3px 8px", borderRadius: 6,
    background: isRoadmap ? "rgba(94,234,212,0.12)" : "rgba(129,140,248,0.12)",
    color: isRoadmap ? "var(--accent)" : "var(--accent-2)",
  };

  const content = (
    <div style={cardStyle}>
      <span style={badgeStyle}>{isRoadmap ? "Roadmap" : "Hint Session"}</span>
      <span style={{ color: "var(--text-bright)", fontWeight: 600, fontSize: "0.92rem" }}>
        {isRoadmap ? item.title : item.problem}
      </span>
      {isRoadmap ? (
        <span style={{ color: "var(--text)", fontSize: "0.8rem", textTransform: "capitalize" }}>
          Goal: {item.goal} · {item.level}
        </span>
      ) : (
        <span style={{ color: "var(--text)", fontSize: "0.8rem", textTransform: "capitalize" }}>
          Difficulty: {item.difficulty}
        </span>
      )}
      <span style={{ color: "var(--text)", fontSize: "0.75rem", opacity: 0.7 }}>
        {new Date(item.createdAt).toLocaleString()}
      </span>
    </div>
  );

  // Roadmaps already have a working detail page. Hint sessions don't yet —
  // wire this up to `/hints/${item.sessionId}` once HintGenerator supports
  // resuming a session from a URL param (see docs/todos.md).
  if (isRoadmap) {
    return (
      <Link to={`/roadmap/${item.id}`} style={{ textDecoration: "none" }}>
        {content}
      </Link>
    );
  }
  return content;
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getHistory()
      .then((res) => setHistory(res.data.data.history))
      .catch((err) => setError(err.response?.data?.error || "Failed to load history."))
      .finally(() => setLoading(false));
  }, []);

  const containerStyle = {
    minHeight: "100svh", display: "flex", flexDirection: "column",
    alignItems: "center", padding: "48px 16px 64px", background: "var(--bg)",
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: "100%", maxWidth: 680 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", color: "var(--text-bright)", margin: 0 }}>
            Your History
          </h1>
          <p style={{ color: "var(--text)", fontSize: "0.88rem", marginTop: 6 }}>
            Roadmaps and hint sessions saved to your account.
          </p>
        </div>

        {loading && <p style={{ color: "var(--text)", textAlign: "center" }}>Loading...</p>}
        {error && <p style={{ color: "var(--danger)", textAlign: "center" }}>{error}</p>}
        {!loading && !error && history.length === 0 && (
          <p style={{ color: "var(--text)", textAlign: "center" }}>
            Nothing saved yet — generate a roadmap or start a hint session to see it here.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {history.map((item) => (
            <HistoryCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}