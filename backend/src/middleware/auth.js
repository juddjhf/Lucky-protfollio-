import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export async function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.sub).select("_id name email");
    if (!admin) return res.status(401).json({ message: "Admin account not found" });
    req.admin = admin;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    return next(error);
  }
}
