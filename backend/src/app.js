import express from "express";
import cors from "cors";
import helmet from "helmet";
import Project from "./models/Project.js";
import Skill from "./models/Skill.js";
import Service from "./models/Service.js";
import { requireAdmin } from "./middleware/auth.js";
import { createCrudRouter } from "./utils/crudRouter.js";
import adminRoutes from "./routes/admin.js";
import contactRoutes from "./routes/contact.js";
import uploadRoutes from "./routes/upload.js";
import { errorHandler, notFound } from "./middleware/errors.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(",").map((origin) => origin.trim()) || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/admin", adminRoutes);
app.use("/api/projects", (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer ")) return requireAdmin(req, res, next);
  return next();
}, createCrudRouter(Project, {
  publicFilter: { published: true },
  sort: { featured: -1, createdAt: -1 },
  fields: ["title", "slug", "description", "shortDescription", "image", "technologies", "liveUrl", "githubUrl", "featured", "published"]
}));
app.use("/api/skills", (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer ")) return requireAdmin(req, res, next);
  return next();
}, createCrudRouter(Skill, {
  publicFilter: { published: true },
  sort: { order: 1, name: 1 },
  fields: ["name", "category", "proficiency", "icon", "order", "published"]
}));
app.use("/api/services", (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer ")) return requireAdmin(req, res, next);
  return next();
}, createCrudRouter(Service, {
  publicFilter: { published: true },
  sort: { order: 1, createdAt: 1 },
  fields: ["title", "description", "icon", "order", "published"]
}));
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
