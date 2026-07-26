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

const NAV_ITEMS = [
  { to: "/", label: "Resume Analyzer", icon: FileText, end: true },
  { to: "/code", label: "Code Reviewer", icon: Code2 },
  { to: "/hints", label: "Hint Generator", icon: Lightbulb },
  { to: "/roadmap", label: "Roadmap", icon: Map, end: true },
];

// Shared active/inactive styling so the desktop rail and mobile bar
// read as one system, not two designs bolted together.
function navLinkClasses({ isActive }, { compact } = {}) {
  const base = compact
    ? "flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
    : "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors";
  return `${base} ${
    isActive
      ? "bg-accent/12 text-accent"
      : "text-text hover:text-text-bright hover:bg-surface-2"
  }`;
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
            <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
              <span className="font-display font-bold text-accent text-sm">CS</span>
            </div>
            <span className="font-display font-semibold text-text-bright text-base">
              Code Sage AI
            </span>
          </div>
          <p className="font-mono text-[11px] text-text/70 mt-2">// dev_intelligence</p>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={(state) => navLinkClasses(state, {})}>
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-5 pt-3 border-t border-border flex flex-col gap-1">
          {user ? (
            <>
              <NavLink to="/history" className={(state) => navLinkClasses(state, {})}>
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
              <NavLink to="/login" className={(state) => navLinkClasses(state, {})}>
                <LogIn size={17} strokeWidth={2} />
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-accent text-bg hover:opacity-90 transition-opacity mt-1"
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
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={(state) => navLinkClasses(state, { compact: true })}>
            <Icon size={18} strokeWidth={2} />
            <span className="leading-none">{label.split(" ")[0]}</span>
          </NavLink>
        ))}
        {user ? (
          <NavLink to="/history" className={(state) => navLinkClasses(state, { compact: true })}>
            <Clock size={18} strokeWidth={2} />
            <span className="leading-none">History</span>
          </NavLink>
        ) : (
          <NavLink to="/login" className={(state) => navLinkClasses(state, { compact: true })}>
            <LogIn size={18} strokeWidth={2} />
            <span className="leading-none">Log in</span>
          </NavLink>
        )}
      </nav>
    </>
  );
}