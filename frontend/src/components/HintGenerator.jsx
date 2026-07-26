// frontend/src/components/HintGenerator.jsx
import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw, ArrowRight, AlertTriangle } from "lucide-react";
import { startHint, nextHint } from "../services/api";
import PageHeader from "./PageHeader";

const DIFFICULTIES = ["easy", "medium", "hard"];

const HOW_IT_WORKS = [
  { step: "Paste the problem", desc: "Drop in the full statement, constraints included." },
  { step: "Get a nudge, not the answer", desc: "Each hint moves you one step closer without spoiling it." },
  { step: "Ask follow-ups anytime", desc: "Stuck on a specific part? Ask about just that." },
];

function ChatBubble({ role, content }) {
  const isModel = role === "model";
  return (
    <div className={`flex ${isModel ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isModel
            ? "bg-surface-2 border border-border text-text-bright"
            : "bg-accent-3 text-white"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default function HintGenerator() {
  const [problem, setProblem]       = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [sessionId, setSessionId]   = useState(null);
  const [messages, setMessages]     = useState([]);
  const [followUp, setFollowUp]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStart = async () => {
    if (!problem.trim()) { setError("Paste the problem statement first."); return; }
    setLoading(true); setError(""); setMessages([]);
    try {
      const res = await startHint({ problem, difficulty });
      setSessionId(res.data.data.sessionId);
      setMessages([{ role: "model", content: res.data.data.hint }]);
    } catch (err) {
      setError(err.response?.data?.error || "Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message) => {
    if (!sessionId || !message.trim()) return;
    setLoading(true); setError("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    try {
      const res = await nextHint({ sessionId, message });
      setMessages((prev) => [...prev, { role: "model", content: res.data.data.hint }]);
    } catch (err) {
      setError(err.response?.data?.error || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextHint = () => sendMessage("Give me the next hint.");
  const handleAskFollowUp = () => {
    if (!followUp.trim()) return;
    sendMessage(followUp);
    setFollowUp("");
  };
  const handleReset = () => {
    setSessionId(null); setMessages([]); setProblem(""); setError("");
  };

  return (
    <div className="min-h-screen px-4 md:px-10 py-10 md:py-14">
      <div className="w-full max-w-5xl mx-auto">
        <PageHeader
          eyebrow=" hint_generator"
          title="LeetCode Hint Generator"
          subtitle="Progressive hints — no spoilers, just nudges in the right direction."
          accent="accent-3"
        />

        {!sessionId ? (
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-5">
            <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4">
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Paste the problem statement here..."
                rows={10}
                className="w-full bg-surface-2 border border-border rounded-xl p-4 text-sm text-text-bright placeholder:text-text/40 resize-vertical outline-none focus:border-accent-3 transition-colors"
              />

              <div>
                <p className="text-xs font-medium text-text mb-2">Difficulty</p>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 rounded-lg border border-border text-sm font-semibold capitalize transition-colors ${
                        difficulty === d ? "bg-accent-3 text-white border-accent-3" : "bg-surface-2 text-text hover:text-text-bright"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-danger/10 border border-danger/25 rounded-lg px-3.5 py-2.5 text-sm text-danger">
                  <AlertTriangle size={15} className="shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleStart}
                disabled={loading}
                className={`py-3.5 rounded-xl font-display font-bold text-sm tracking-wide transition-opacity ${
                  loading ? "bg-surface-2 text-text/40 cursor-not-allowed" : "bg-accent-3 text-white hover:opacity-90 cursor-pointer"
                }`}
              >
                {loading ? "Thinking…" : "Get first hint"}
              </button>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="font-display font-semibold text-sm text-text-bright mb-4">How it works</h2>
              <div className="flex flex-col gap-4">
                {HOW_IT_WORKS.map(({ step, desc }, i) => (
                  <div key={step} className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent-3/10 text-accent-3 flex items-center justify-center shrink-0 font-mono text-xs font-semibold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-bright">{step}</p>
                      <p className="text-xs text-text mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4 max-w-3xl">
            <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto px-1">
              {messages.map((m, i) => <ChatBubble key={i} role={m.role} content={m.content} />)}
              {loading && <ChatBubble role="model" content="…" />}
              <div ref={bottomRef} />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-danger/10 border border-danger/25 rounded-lg px-3.5 py-2.5 text-sm text-danger">
                <AlertTriangle size={15} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <input
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskFollowUp()}
                placeholder="Ask a follow-up question…"
                disabled={loading}
                className="flex-1 bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-bright placeholder:text-text/40 outline-none focus:border-accent-3 transition-colors"
              />
              <button
                onClick={handleAskFollowUp}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-2 border border-border text-text-bright text-sm font-semibold hover:bg-border transition-colors"
              >
                <Send size={14} />
                Ask
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleNextHint}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-display font-semibold text-sm transition-opacity ${
                  loading ? "bg-surface-2 text-text/40 cursor-not-allowed" : "bg-accent-3 text-white hover:opacity-90"
                }`}
              >
                Next hint
                <ArrowRight size={14} />
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-text text-sm font-medium hover:text-text-bright transition-colors"
              >
                <RotateCcw size={14} />
                New problem
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
