// frontend/src/components/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If ProtectedRoute redirected here, send the user back where they were headed.
  const redirectTo = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Network error. Is the backend running?");
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: "100svh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", padding: "48px 16px", background: "var(--bg)",
  };

  const inputStyle = {
    width: "100%", background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 10, padding: "10px 14px", color: "var(--text-bright)",
    fontSize: "0.88rem", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", color: "var(--text-bright)", margin: 0 }}>
            Welcome back
          </h1>
          <p style={{ color: "var(--text)", fontSize: "0.88rem", marginTop: 6 }}>
            Log in to see your saved roadmaps and hint sessions.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: "0.8rem", color: "var(--text)", display: "block", marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", color: "var(--text)", display: "block", marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "var(--accent)", color: "#0a0a0f", border: "none",
              borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: "0.9rem",
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {error && <p style={{ color: "var(--danger)", fontSize: "0.82rem", margin: 0 }}>{error}</p>}

          <p style={{ color: "var(--text)", fontSize: "0.85rem", textAlign: "center", marginTop: 8 }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "var(--accent-2)", fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}