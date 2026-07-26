// frontend/src/components/History.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Map, Lightbulb, Loader2, AlertTriangle, Inbox } from "lucide-react";
import { getHistory } from "../services/api";
import PageHeader from "./PageHeader";

function HistoryCard({ item }) {
  const isRoadmap = item.type === "roadmap";
  const Icon = isRoadmap ? Map : Lightbulb;
  const accentClass = isRoadmap ? "text-accent-4" : "text-accent-3";
  const badgeClass = isRoadmap ? "bg-accent-4/10 border-accent-4/25 text-accent-4" : "bg-accent-3/10 border-accent-3/25 text-accent-3";

  const inner = (
    <div className="bg-surface border border-border rounded-xl p-4 flex gap-3 hover:border-text/20 transition-colors">
      <div className={`w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center shrink-0 ${accentClass}`}>
        <Icon size={16} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className={`self-start text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeClass}`}>
          {isRoadmap ? "Roadmap" : "Hint Session"}
        </span>
        <span className="text-text-bright font-semibold text-sm truncate">
          {isRoadmap ? item.title : item.problem}
        </span>
        <span className="text-text text-xs capitalize">
          {isRoadmap ? `Goal: ${item.goal} · ${item.level}` : `Difficulty: ${item.difficulty}`}
        </span>
        <span className="text-text/60 text-xs">{new Date(item.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );

  // Roadmaps already have a working detail page. Hint sessions don't yet —
  // wire this up to `/hints/${item.sessionId}` once HintGenerator supports
  // resuming a session from a URL param (see docs/todos.md).
  if (isRoadmap) {
    return <Link to={`/roadmap/${item.id}`} className="no-underline">{inner}</Link>;
  }
  return inner;
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

  return (
    <div className="min-h-screen px-4 md:px-10 py-10 md:py-14">
      <div className="w-full max-w-3xl mx-auto">
        <PageHeader
          eyebrow=" history"
          title="Your History"
          subtitle="Roadmaps and hint sessions saved to your account."
        />

        {loading && (
          <div className="flex items-center gap-2 text-text text-sm">
            <Loader2 size={15} className="animate-spin" />
            Loading…
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-danger/10 border border-danger/25 rounded-lg px-3.5 py-2.5 text-sm text-danger">
            <AlertTriangle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center text-text/50">
              <Inbox size={22} />
            </div>
            <p className="text-text text-sm max-w-xs">
              Nothing saved yet — generate a roadmap or start a hint session to see it here.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-3">
          {history.map((item) => (
            <HistoryCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
