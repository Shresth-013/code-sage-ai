// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ResumeUpload from "./components/ResumeUpload";
import CodeReview from "./components/CodeReview";
import HintGenerator from "./components/HintGenerator";
import RoadmapGenerator from "./components/RoadmapGenerator";
import Login from "./components/Login";
import Signup from "./components/Signup";
import History from "./components/History";


function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const linkStyle = {
    color: "var(--text)", fontSize: "0.85rem", fontWeight: 500,
    textDecoration: "none", background: "none", border: "none", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", padding: 0,
  };

  return (
    <nav style={{
      background: "var(--surface)", borderBottom: "1px solid var(--border)",
      padding: "16px 24px", display: "flex", alignItems: "center", gap: 24,
    }}>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "var(--accent)", fontSize: "1.1rem" }}>
        Code Sage AI
      </span>
      {[
        { to: "/", label: "Resume Analyzer" },
        { to: "/code", label: "Code Reviewer" },
        { to: "/hints", label: "Hint Generator" },
        { to: "/roadmap", label: "Roadmap" },
      ].map(({ to, label }) => (
        <Link key={to} to={to} style={linkStyle}>
          {label}
        </Link>
      ))}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
        {user ? (
          <>
            <Link to="/history" style={linkStyle}>History</Link>
            <span style={{ color: "var(--text)", fontSize: "0.8rem", opacity: 0.7 }}>{user.email}</span>
            <button onClick={handleLogout} style={{ ...linkStyle, color: "var(--danger)" }}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Log in</Link>
            <Link
              to="/signup"
              style={{
                background: "var(--accent)", color: "#0a0a0f", borderRadius: 8,
                padding: "6px 14px", fontSize: "0.82rem", fontWeight: 700, textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ minHeight: "100svh", background: "var(--bg)" }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<ResumeUpload />} />
            <Route path="/code" element={<CodeReview />} />
            <Route path="/hints" element={<HintGenerator />} />
            <Route path="/roadmap" element={<RoadmapGenerator />} />
            <Route path="/roadmap/:id" element={<RoadmapGenerator />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;