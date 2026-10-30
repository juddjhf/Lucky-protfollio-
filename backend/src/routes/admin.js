import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import Admin from "../models/Admin.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ sub: admin.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });
    return res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (error) { return next(error); }
});

router.get("/me", requireAdmin, (req, res) => {
  res.json({ admin: { id: req.admin.id, name: req.admin.name, email: req.admin.email } });
});

export default router;
