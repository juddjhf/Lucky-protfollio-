import { Router } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.mimetype)) {
      const error = new Error("Only JPEG, PNG, WebP, or AVIF images are allowed");
      error.code = "INVALID_IMAGE_TYPE";
      return callback(error);
    }
    return callback(null, true);
  }
});

router.post("/", requireAdmin, upload.single("image"), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: "An image file is required" });
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(503).json({ message: "Image uploads are not configured on this server" });
  }
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "lucky-portfolio/projects", resource_type: "image" }, (error, value) => {
        if (error) return reject(error);
        return resolve(value);
      });
      stream.end(req.file.buffer);
    });
    return res.status(201).json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) { return next(error); }
});

export default router;
