// frontend/src/components/RoadmapGenerator.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Map, Copy, Plus, AlertTriangle, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { generateRoadmap, getRoadmap } from "../services/api";
import PageHeader from "./PageHeader";

const LEVELS = ["beginner", "intermediate", "advanced"];

const WHAT_YOU_GET = [
  { label: "Week-by-week plan", desc: "Focus areas and topics sized to your timeline." },
  { label: "Practice pointers", desc: "What to actually work on each week, not just theory." },
  { label: "Clear milestones", desc: "A concrete checkpoint to know you're on track." },
];

function WeekCard({ week }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex justify-between items-baseline mb-2 gap-3">
        <span className="text-accent-4 font-mono font-semibold text-xs uppercase tracking-wider shrink-0">
          Week {week.week}
        </span>
        <span className="text-text-bright font-semibold text-sm text-right">{week.focus}</span>
      </div>
      <ul className="list-disc list-inside space-y-1 text-sm text-text mb-2">
        {week.topics.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
      {week.resources?.length > 0 && (
        <p className="text-sm text-text mt-2">
          <span className="text-accent-2 font-medium">Practice: </span>
          {week.resources.join(", ")}
        </p>
      )}
      <p className="flex items-center gap-1.5 text-sm text-success mt-2">
        <CheckCircle2 size={14} className="shrink-0" />
        {week.milestone}
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
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // ─── View mode: /roadmap/:id ───
  if (id) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center gap-2 text-text">
          <Loader2 size={16} className="animate-spin" />
          Loading roadmap…
        </div>
      );
    }
    if (error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
          <div className="flex items-center gap-2 text-danger text-sm">
            <AlertTriangle size={15} />
            {error}
          </div>
          <button
            onClick={() => navigate("/roadmap")}
            className="px-4 py-2 rounded-lg bg-surface-2 border border-border text-text-bright text-sm font-medium hover:bg-border transition-colors"
          >
            Create a new roadmap
          </button>
        </div>
      );
    }
    if (!roadmap) return null;

    return (
      <div className="min-h-screen px-4 md:px-10 py-10 md:py-14">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader eyebrow="roadmap" title={roadmap.title} subtitle={roadmap.summary} accent="accent-4" />

          <div className="flex flex-col gap-4">
            {roadmap.weeks.map((w) => <WeekCard key={w.week} week={w} />)}
          </div>

          <div className="mt-5 bg-surface-2 border border-border rounded-xl p-5 text-sm text-text-bright leading-relaxed">
            <span className="text-accent-4 font-semibold">Final advice: </span>
            {roadmap.finalAdvice}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-2 border border-border text-text-bright text-sm font-medium hover:bg-border transition-colors"
            >
              <Copy size={15} />
              {copied ? "Link copied!" : "Copy shareable link"}
            </button>
            <button
              onClick={() => navigate("/roadmap")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-4 text-[#04141c] text-sm font-display font-bold hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              New roadmap
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Form mode: /roadmap ───
  return (
    <div className="min-h-screen px-4 md:px-10 py-10 md:py-14">
      <div className="w-full max-w-5xl mx-auto">
        <PageHeader
          eyebrow="roadmap_generator"
          title="Roadmap Generator"
          subtitle="A week-by-week plan built around your actual goal and time."
          accent="accent-4"
        />

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-5">
          <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-text block mb-1.5">Your goal</label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder='e.g. "Crack SDE-1 interviews at product companies"'
                rows={4}
                className="w-full bg-surface-2 border border-border rounded-xl p-4 text-sm text-text-bright placeholder:text-text/40 resize-vertical outline-none focus:border-accent-4 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-text block mb-2">Current level</label>
              <div className="flex gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`flex-1 py-2 rounded-lg border border-border text-sm font-semibold capitalize transition-colors ${
                      level === l ? "bg-accent-4 text-[#04141c] border-accent-4" : "bg-surface-2 text-text hover:text-text-bright"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-text block mb-1.5">Weeks</label>
                <input
                  type="number" min={1} max={52} value={weeks}
                  onChange={(e) => setWeeks(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-bright outline-none focus:border-accent-4 transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-text block mb-1.5">Hours/week</label>
                <input
                  type="number" min={1} max={80} value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-bright outline-none focus:border-accent-4 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-danger/10 border border-danger/25 rounded-lg px-3.5 py-2.5 text-sm text-danger">
                <AlertTriangle size={15} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`py-3.5 rounded-xl font-display font-bold text-sm tracking-wide transition-opacity ${
                loading ? "bg-surface-2 text-text/40 cursor-not-allowed" : "bg-accent-4 text-[#04141c] hover:opacity-90 cursor-pointer"
              }`}
            >
              {loading ? "Building your roadmap…" : "Generate roadmap"}
            </button>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="font-display font-semibold text-sm text-text-bright mb-4 flex items-center gap-2">
              <Map size={15} className="text-accent-4" />
              What you get
            </h2>
            <div className="flex flex-col gap-4">
              {WHAT_YOU_GET.map(({ label, desc }) => (
                <div key={label} className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent-4/10 text-accent-4 flex items-center justify-center shrink-0">
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-bright">{label}</p>
                    <p className="text-xs text-text mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
