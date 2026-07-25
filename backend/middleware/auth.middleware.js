// backend/middleware/auth.middleware.js
import { verifyToken, AUTH_COOKIE_NAME } from "../services/auth.service.js";

// Hard-blocks the request if there's no valid session. Use on routes that
// genuinely require a logged-in user (GET /api/auth/me, GET /api/user/history).
export const protect = (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ success: false, error: "You must be logged in." });
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Session expired or invalid. Please log in again." });
  }
};

// Never blocks the request. If a valid session cookie is present, attaches
// req.userId so the controller can tag the record as belonging to that user.
// If not (or the cookie is invalid/expired), the request proceeds anonymously —
// this is what keeps Hints/Roadmap usable without an account.
export const attachUserIfPresent = (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (token) {
    try {
      const decoded = verifyToken(token);
      req.userId = decoded.userId;
    } catch (err) {
      // Invalid/expired token on an optional-auth route — ignore and continue anonymously.
    }
  }

  next();
};