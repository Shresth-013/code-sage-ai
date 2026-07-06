// frontend/src/components/RoadmapGenerator.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generateRoadmap, getRoadmap } from "../services/api";

const LEVELS = ["beginner", "intermediate", "advanced"];

function WeekCard({ week }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: 18,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.85rem" }}>
          WEEK {week.week}
        </span>
        <span style={{ color: "var(--text-bright)", fontWeight: 600, fontSize: "0.9rem" }}>
          {week.focus}
        </span>
      </div>
      <ul style={{ margin: "8px 0", paddingLeft: 18, color: "var(--text)", fontSize: "0.85rem" }}>
        {week.topics.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
      {week.resources?.length > 0 && (
        <p style={{ fontSize: "0.8rem", color: "var(--text)", margin: "8px 0 0" }}>
          <strong style={{ color: "var(--accent-2)" }}>Practice:</strong> {week.resources.join(", ")}
        </p>
      )}
      <p style={{ fontSize: "0.8rem", color: "var(--success)", margin: "8px 0 0" }}>
        ✓ Milestone: {week.milestone}
      </p>
    </div>
  );
}

export default function RoadmapGenerator() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("intermediate");
  const [weeks, setWeeks] = useState(8);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If we land on /roadmap/:id, fetch the saved roadmap instead of showing the form.
  useEffect(() => {
    if (!id) { setRoadmap(null); return; }
    setLoading(true); setError("");
    getRoadmap(id)
      .then((res) => setRoadmap(res.data.data))
      .catch((err) => setError(err.response?.data?.error || "Roadmap not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleGenerate = async () => {
    if (!goal.trim()) { setError("Describe your goal first."); return; }
    setLoading(true); setError("");
    try {
      const res = await generateRoadmap({ goal, level, weeks: Number(weeks), hoursPerWeek: Number(hoursPerWeek) });
      navigate(`/roadmap/${res.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Network error. Is the backend running?");
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: "100svh", display: "flex", flexDirection: "column",
    alignItems: "center", padding: "48px 16px 64px", background: "var(--bg)",
  };

  // ─── View mode: /roadmap/:id ───
  if (id) {
    if (loading) return <div style={containerStyle}><p style={{ color: "var(--text)" }}>Loading roadmap...</p></div>;
    if (error) return (
      <div style={containerStyle}>
        <p style={{ color: "var(--danger)" }}>{error}</p>
        <button onClick={() => navigate("/roadmap")} style={{ marginTop: 12, background: "var(--surface-2)", color: "var(--text-bright)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>
          Create a new roadmap
        </button>
      </div>
    );
    if (!roadmap) return null;

    return (
      <div style={containerStyle}>
        <div style={{ width: "100%", maxWidth: 680 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", color: "var(--text-bright)", marginBottom: 6 }}>
            {roadmap.title}
          </h1>
          <p style={{ color: "var(--text)", fontSize: "0.88rem", marginBottom: 24 }}>{roadmap.summary}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {roadmap.weeks.map((w) => <WeekCard key={w.week} week={w} />)}
          </div>

          <div style={{
            marginTop: 24, background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: 12, padding: 16, fontSize: "0.85rem", color: "var(--text-bright)",
          }}>
            <strong style={{ color: "var(--accent)" }}>Final advice:</strong> {roadmap.finalAdvice}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); }}
              style={{ flex: 1, background: "var(--surface-2)", color: "var(--text-bright)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 0", fontSize: "0.85rem", cursor: "pointer" }}
            >
              Copy shareable link
            </button>
            <button
              onClick={() => navigate("/roadmap")}
              style={{ background: "var(--accent)", color: "#0a0a0f", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
            >
              New roadmap
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Form mode: /roadmap ───
  return (
    <div style={containerStyle}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", color: "var(--text-bright)", margin: 0 }}>
            Roadmap Generator
          </h1>
          <p style={{ color: "var(--text)", fontSize: "0.88rem", marginTop: 6 }}>
            A week-by-week plan built around your actual goal and time.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder='e.g. "Crack SDE-1 interviews at product companies"'
            rows={3}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 12, padding: 14, color: "var(--text-bright)",
              fontSize: "0.88rem", fontFamily: "'DM Sans', sans-serif", resize: "vertical",
            }}
          />

          <div>
            <label style={{ fontSize: "0.8rem", color: "var(--text)", display: "block", marginBottom: 6 }}>Current level</label>
            <div style={{ display: "flex", gap: 8 }}>
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid var(--border)",
                    background: level === l ? "var(--accent)" : "var(--surface-2)",
                    color: level === l ? "#0a0a0f" : "var(--text)",
                    fontSize: "0.8rem", fontWeight: 600, textTransform: "capitalize", cursor: "pointer",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.8rem", color: "var(--text)", display: "block", marginBottom: 6 }}>Weeks</label>
              <input
                type="number" min={1} max={52} value={weeks}
                onChange={(e) => setWeeks(e.target.value)}
                style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", color: "var(--text-bright)", fontSize: "0.85rem", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.8rem", color: "var(--text)", display: "block", marginBottom: 6 }}>Hours/week</label>
              <input
                type="number" min={1} max={80} value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", color: "var(--text-bright)", fontSize: "0.85rem", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              background: "var(--accent)", color: "#0a0a0f", border: "none",
              borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: "0.9rem",
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Building your roadmap..." : "Generate roadmap"}
          </button>
          {error && <p style={{ color: "var(--danger)", fontSize: "0.82rem", margin: 0 }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}