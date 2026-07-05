// frontend/src/components/HintGenerator.jsx
import { useState, useRef, useEffect } from "react";
import { startHint, nextHint } from "../services/api";

const DIFFICULTIES = ["easy", "medium", "hard"];

function ChatBubble({ role, content }) {
  const isModel = role === "model";
  return (
    <div style={{ display: "flex", justifyContent: isModel ? "flex-start" : "flex-end" }}>
      <div style={{
        maxWidth: "80%",
        background: isModel ? "var(--surface-2)" : "var(--accent-2)",
        color: isModel ? "var(--text-bright)" : "#0a0a0f",
        border: isModel ? "1px solid var(--border)" : "none",
        borderRadius: 14,
        padding: "12px 16px",
        fontSize: "0.88rem",
        lineHeight: 1.6,
        whiteSpace: "pre-wrap",
      }}>
        {content}
      </div>
    </div>
  );
}

export default function HintGenerator() {
  const [problem, setProblem]       = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [sessionId, setSessionId]   = useState(null);
  const [messages, setMessages]     = useState([]); // [{role, content}]
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
    <div style={{
      minHeight: "100svh", display: "flex", flexDirection: "column",
      alignItems: "center", padding: "48px 16px 64px", background: "var(--bg)",
    }}>
      <div style={{ width: "100%", maxWidth: 640 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", color: "var(--text-bright)", margin: 0 }}>
            LeetCode Hint Generator
          </h1>
          <p style={{ color: "var(--text)", fontSize: "0.88rem", marginTop: 6 }}>
            Progressive hints — no spoilers, just nudges in the right direction.
          </p>
        </div>

        {!sessionId ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Paste the problem statement here..."
              rows={6}
              style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 12, padding: 14, color: "var(--text-bright)",
                fontSize: "0.88rem", fontFamily: "'DM Sans', sans-serif", resize: "vertical",
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid var(--border)",
                    background: difficulty === d ? "var(--accent)" : "var(--surface-2)",
                    color: difficulty === d ? "#0a0a0f" : "var(--text)",
                    fontSize: "0.8rem", fontWeight: 600, textTransform: "capitalize", cursor: "pointer",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              onClick={handleStart}
              disabled={loading}
              style={{
                background: "var(--accent)", color: "#0a0a0f", border: "none",
                borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: "0.9rem",
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Thinking..." : "Get first hint"}
            </button>
            {error && <p style={{ color: "var(--danger)", fontSize: "0.82rem", margin: 0 }}>{error}</p>}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              display: "flex", flexDirection: "column", gap: 10,
              maxHeight: 420, overflowY: "auto", padding: "4px 2px",
            }}>
              {messages.map((m, i) => <ChatBubble key={i} role={m.role} content={m.content} />)}
              {loading && <ChatBubble role="model" content="..." />}
              <div ref={bottomRef} />
            </div>

            {error && <p style={{ color: "var(--danger)", fontSize: "0.82rem", margin: 0 }}>{error}</p>}

            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskFollowUp()}
                placeholder="Ask a follow-up question..."
                disabled={loading}
                style={{
                  flex: 1, background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "10px 14px", color: "var(--text-bright)", fontSize: "0.85rem",
                }}
              />
              <button
                onClick={handleAskFollowUp}
                disabled={loading}
                style={{
                  background: "var(--surface-2)", color: "var(--text-bright)", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "10px 16px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                }}
              >
                Ask
              </button>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleNextHint}
                disabled={loading}
                style={{
                  flex: 1, background: "var(--accent)", color: "#0a0a0f", border: "none",
                  borderRadius: 10, padding: "10px 0", fontWeight: 700, fontSize: "0.85rem",
                  cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
                }}
              >
                Next hint
              </button>
              <button
                onClick={handleReset}
                style={{
                  background: "transparent", color: "var(--text)", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "10px 16px", fontSize: "0.85rem", cursor: "pointer",
                }}
              >
                New problem
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}