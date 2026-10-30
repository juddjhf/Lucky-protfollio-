import { Router } from "express";
import rateLimit from "express-rate-limit";
import Contact from "../models/Contact.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: true, legacyHeaders: false });

router.post("/", contactLimiter, async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (![name, email, subject, message].every((value) => typeof value === "string" && value.trim())) {
      return res.status(400).json({ message: "Name, email, subject, and message are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }
    const contact = await Contact.create({ name, email, subject, message });
    return res.status(201).json({ message: "Message sent successfully", id: contact.id });
  } catch (error) { return next(error); }
});

router.get("/", requireAdmin, async (req, res, next) => {
  try { return res.json(await Contact.find().sort({ createdAt: -1 })); }
  catch (error) { return next(error); }
});

router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    if (typeof req.body.read !== "boolean") return res.status(400).json({ message: "A boolean read value is required" });
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: req.body.read }, { new: true, runValidators: true });
    if (!contact) return res.status(404).json({ message: "Message not found" });
    return res.json(contact);
  } catch (error) { return next(error); }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Message not found" });
    return res.json({ message: "Message deleted" });
  } catch (error) { return next(error); }
});

export default router;
