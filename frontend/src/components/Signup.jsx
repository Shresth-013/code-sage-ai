// frontend/src/components/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, UserPlus, AlertTriangle, FileClock, Map, Sparkles, Terminal } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MIN_PASSWORD_LENGTH = 8;

const BENEFITS = [
  { icon: FileClock, text: "Pick up hint sessions and analyses right where you left off" },
  { icon: Map, text: "Save every roadmap and revisit it anytime, from any device" },
  { icon: Sparkles, text: "Build a running history of your interview prep" },
];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signup(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Network error. Is the backend running?");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel — desktop only */}
      <div
        className="hidden md:flex md:w-1/2 flex-col justify-center px-14 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, var(--surface) 0%, var(--bg) 100%)" }}
      >
        <div
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "var(--accent)" }}
        />
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider rounded-full border border-accent/20 bg-accent/10 text-accent px-2.5 py-1 mb-4 relative">
  <Terminal size={12} strokeWidth={2.5} />
  get_started
</span>
        <h1 className="font-display font-bold text-3xl lg:text-4xl text-text-bright mb-4 relative max-w-sm">
          Save your progress as you build.
        </h1>
        <p className="text-sm text-text mb-8 relative max-w-sm leading-relaxed">
          Create an account to keep everything tied to you, across sessions and devices.
        </p>
        <div className="flex flex-col gap-4 relative">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Icon size={15} />
              </div>
              <p className="text-sm text-text leading-relaxed pt-1">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="font-display font-semibold text-2xl text-text-bright">Create an account</h2>
            <p className="text-sm text-text mt-1.5">Save your roadmaps and hint sessions to come back to later.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-text block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full bg-surface border border-border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-text-bright placeholder:text-text/40 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                  autoComplete="new-password"
                  className="w-full bg-surface border border-border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-text-bright placeholder:text-text/40 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg font-display font-bold text-sm transition-opacity ${
                loading ? "bg-surface-2 text-text/40 cursor-not-allowed" : "bg-accent text-white hover:opacity-90"
              }`}
            >
              <UserPlus size={16} />
              {loading ? "Creating account…" : "Sign up"}
            </button>

            {error && (
              <div className="flex items-center gap-2 bg-danger/10 border border-danger/25 rounded-lg px-3.5 py-2.5 text-sm text-danger">
                <AlertTriangle size={15} className="shrink-0" />
                {error}
              </div>
            )}

            <p className="text-sm text-text text-center mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-accent font-semibold hover:underline">Log in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
