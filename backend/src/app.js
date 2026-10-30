
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

import {
  errorHandler,
  notFound,
} from "./middleware/errors.js";

const app = express();

// ========================================
// 1. Allowed Frontend Origins
// ========================================

const allowedOrigins = [
  "https://lucky-protfollio.onrender.com",
  "http://localhost:5173",
];

// ========================================
// 2. Security Middleware
// ========================================

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (for example, server-to-server requests).
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked this origin: ${origin}`)
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

// ========================================
// 3. Health Check
// ========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    message: "Lucky Portfolio API is running",
  });
});

// ========================================
// 4. Admin Routes
// ========================================

app.use("/api/admin", adminRoutes);

// ========================================
// 5. Projects Routes
// ========================================

app.use(
  "/api/projects",

  (req, res, next) => {
    if (
      req.headers.authorization?.startsWith("Bearer ")
    ) {
      return requireAdmin(req, res, next);
    }

    return next();
  },

  createCrudRouter(Project, {
    publicFilter: {
      published: true,
    },

    sort: {
      featured: -1,
      createdAt: -1,
    },

    fields: [
      "title",
      "slug",
      "description",
      "shortDescription",
      "image",
      "technologies",
      "liveUrl",
      "githubUrl",
      "featured",
      "published",
    ],
  })
);

// ========================================
// 6. Skills Routes
// ========================================

app.use(
  "/api/skills",

  (req, res, next) => {
    if (
      req.headers.authorization?.startsWith("Bearer ")
    ) {
      return requireAdmin(req, res, next);
    }

    return next();
  },

  createCrudRouter(Skill, {
    publicFilter: {
      published: true,
    },

    sort: {
      order: 1,
      name: 1,
    },

    fields: [
      "name",
      "category",
      "proficiency",
      "icon",
      "order",
      "published",
    ],
  })
);

// ========================================
// 7. Services Routes
// ========================================

app.use(
  "/api/services",

  (req, res, next) => {
    if (
      req.headers.authorization?.startsWith("Bearer ")
    ) {
      return requireAdmin(req, res, next);
    }

    return next();
  },

  createCrudRouter(Service, {
    publicFilter: {
      published: true,
    },

    sort: {
      order: 1,
      createdAt: 1,
    },

    fields: [
      "title",
      "description",
      "icon",
      "order",
      "published",
    ],
  })
);

// ========================================
// 8. Contact Routes
// ========================================

app.use("/api/contact", contactRoutes);

// ========================================
// 9. Upload Routes
// ========================================

app.use("/api/upload", uploadRoutes);

// ========================================
// 10. 404 Handler
// ========================================

app.use(notFound);

// ========================================
// 11. Global Error Handler
// ========================================

app.use(errorHandler);

export default app;
