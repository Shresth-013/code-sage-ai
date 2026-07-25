// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // True only during the initial "am I already logged in" check on page load —
  // lets ProtectedRoute/Navbar avoid flashing a logged-out state before the
  // cookie-based session has had a chance to resolve.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCurrentUser()
      .then((res) => setUser(res.data.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signup = async (email, password) => {
    const res = await api.signup({ email, password });
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}