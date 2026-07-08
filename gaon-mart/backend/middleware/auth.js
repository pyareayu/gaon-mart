const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "gaonmart_super_secret_change_me";

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Not authenticated. Please log in." });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only." });
  }
  next();
}

module.exports = { requireAuth, requireAdmin, JWT_SECRET };
