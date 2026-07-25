// backend/controllers/auth.controller.js
import User from "../models/user.model.js";
import {
  hashPassword,
  comparePassword,
  signToken,
  AUTH_COOKIE_NAME,
  authCookieOptions,
} from "../services/auth.service.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

// POST /api/auth/signup
// Body: { email: string, password: string }
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, error: "A valid email is required." });
    }
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, error: "An account with this email already exists." });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ email: normalizedEmail, passwordHash });

    const token = signToken(user._id.toString());
    res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());

    res.status(201).json({ success: true, data: { user } });
  } catch (err) {
    console.error("signup error:", err.message);
    res.status(500).json({ success: false, error: "Failed to create account." });
  }
};

// POST /api/auth/login
// Body: { email: string, password: string }
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Same error for "no such user" and "wrong password" — don't leak which one it was.
    const invalidCredsError = { success: false, error: "Invalid email or password." };
    if (!user) {
      return res.status(401).json(invalidCredsError);
    }

    const passwordMatches = await comparePassword(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json(invalidCredsError);
    }

    const token = signToken(user._id.toString());
    res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());

    res.json({ success: true, data: { user } });
  } catch (err) {
    console.error("login error:", err.message);
    res.status(500).json({ success: false, error: "Failed to log in." });
  }
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, { ...authCookieOptions(), maxAge: undefined });
  res.json({ success: true, data: { message: "Logged out." } });
};

// GET /api/auth/me
// Requires the `protect` middleware (added in Step 2) to have run first.
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    res.json({ success: true, data: { user } });
  } catch (err) {
    console.error("getCurrentUser error:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch current user." });
  }
};