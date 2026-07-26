// frontend/src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  FileText,
  Code2,
  Lightbulb,
  Map,
  Clock,
  LogOut,
  LogIn,
  UserPlus,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Logo from "./Logo";

const COLOR_CLASSES = {
  accent:   { bg: "bg-accent/14",   text: "text-accent" },
  "accent-2": { bg: "bg-accent-2/14", text: "text-accent-2" },
  "accent-3": { bg: "bg-accent-3/14", text: "text-accent-3" },
  "accent-4": { bg: "bg-accent-4/14", text: "text-accent-4" },
};

const NAV_ITEMS = [
  { to: "/", label: "Resume Analyzer", icon: FileText, end: true, color: "accent" },
  { to: "/code", label: "Code Reviewer", icon: Code2, color: "accent-2" },
  { to: "/hints", label: "Hint Generator", icon: Lightbulb, color: "accent-3" },
  { to: "/roadmap", label: "Roadmap", icon: Map, end: true, color: "accent-4" },
];

function navLinkClasses({ isActive }, colorKey, { compact } = {}) {
  const base = compact
    ? "flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
    : "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors";
  if (!isActive) {
    return `${base} text-text hover:text-text-bright hover:bg-surface-2`;
  }
  const { bg, text } = COLOR_CLASSES[colorKey];
  return `${base} ${bg} ${text}`;
}

// Brand lockup — "Code Sage" carries the weight, "AI" sits in its own
// accent badge so it reads as a suffix, not a third word competing for
// attention. This is the one thing in the rail that should look the
// most considered.
function Wordmark() {
  return (
    <div className="flex items-center gap-2 leading-none">
      <span className="font-display font-bold text-text-bright text-[18px] tracking-tight">
        Code <span className="text-accent">Sage</span>
      </span>
      <span className="relative inline-flex items-center gap-1 font-mono text-[10px] font-bold tracking-[0.14em] text-accent bg-gradient-to-b from-accent/20 to-accent/5 border border-accent/30 rounded-md px-1.5 py-[3px] shadow-[0_0_10px_-2px_var(--accent)]">
        <span className="w-1 h-1 rounded-full bg-accent" />
        AI
      </span>
    </div>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-60 bg-surface border-r border-border z-20">
        <div className="px-5 py-6">
          <div className="flex items-center gap-2.5">
            <Logo size={38} />
            <Wordmark />
          </div>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end, color }) => (
            <NavLink key={to} to={to} end={end} className={(state) => navLinkClasses(state, color, {})}>
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-5 pt-3 border-t border-border flex flex-col gap-1">
          {user ? (
            <>
              <NavLink to="/history" className={(state) => navLinkClasses(state, "accent", {})}>
                <Clock size={17} strokeWidth={2} />
                History
              </NavLink>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text hover:text-text-bright hover:bg-surface-2 transition-colors"
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
              <div className="flex items-center justify-between px-3 pt-2 mt-1">
                <span className="text-xs text-text/70 truncate" title={user.email}>
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-text hover:text-danger transition-colors shrink-0 ml-2"
                  title="Log out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text hover:text-text-bright hover:bg-surface-2 transition-colors"
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
              <NavLink to="/login" className={(state) => navLinkClasses(state, "accent", {})}>
                <LogIn size={17} strokeWidth={2} />
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-accent hover:bg-accent-hover transition-colors mt-1"
              >
                <UserPlus size={16} strokeWidth={2.5} />
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-surface border-t border-border flex items-center justify-around px-1 z-20">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end, color }) => (
          <NavLink key={to} to={to} end={end} className={(state) => navLinkClasses(state, color, { compact: true })}>
            <Icon size={18} strokeWidth={2} />
            <span className="leading-none">{label.split(" ")[0]}</span>
          </NavLink>
        ))}
        {user ? (
          <NavLink to="/history" className={(state) => navLinkClasses(state, "accent", { compact: true })}>
            <Clock size={18} strokeWidth={2} />
            <span className="leading-none">History</span>
          </NavLink>
        ) : (
          <NavLink to="/login" className={(state) => navLinkClasses(state, "accent", { compact: true })}>
            <LogIn size={18} strokeWidth={2} />
            <span className="leading-none">Log in</span>
          </NavLink>
        )}
      </nav>
    </>
  );
}