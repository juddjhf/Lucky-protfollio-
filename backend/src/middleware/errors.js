export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: `A record with that ${Object.keys(error.keyPattern).join(", ")} already exists` });
  }
  if (error.name === "CastError") return res.status(400).json({ message: "Invalid record identifier" });
  if (error.name === "MulterError") return res.status(400).json({ message: error.message });
  if (error.code === "INVALID_IMAGE_TYPE") return res.status(400).json({ message: error.message });
  console.error(error);
  return res.status(500).json({ message: "An unexpected server error occurred" });
}
