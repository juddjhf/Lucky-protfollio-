import express from "express";
import { requireAdmin } from "../middleware/auth.js";

export function createCrudRouter(Model, { publicFilter = { published: true }, sort = { createdAt: -1 }, fields }) {
  const router = express.Router();
  router.get("/", async (req, res, next) => {
    try {
      const filter = req.admin ? {} : publicFilter;
      res.json(await Model.find(filter).sort(sort));
    } catch (error) { next(error); }
  });
  router.post("/", requireAdmin, async (req, res, next) => {
    try {
      const data = fields ? Object.fromEntries(fields.filter((key) => key in req.body).map((key) => [key, req.body[key]])) : req.body;
      res.status(201).json(await Model.create(data));
    } catch (error) { next(error); }
  });
  router.get("/:id", async (req, res, next) => {
    try {
      const filter = req.admin ? { _id: req.params.id } : { _id: req.params.id, ...publicFilter };
      const item = await Model.findOne(filter);
      if (!item) return res.status(404).json({ message: "Record not found" });
      return res.json(item);
    } catch (error) { return next(error); }
  });
  router.patch("/:id", requireAdmin, async (req, res, next) => {
    try {
      const data = fields ? Object.fromEntries(fields.filter((key) => key in req.body).map((key) => [key, req.body[key]])) : req.body;
      const item = await Model.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ message: "Record not found" });
      return res.json(item);
    } catch (error) { return next(error); }
  });
  router.delete("/:id", requireAdmin, async (req, res, next) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: "Record not found" });
      return res.json({ message: "Record deleted" });
    } catch (error) { return next(error); }
  });
  return router;
}
