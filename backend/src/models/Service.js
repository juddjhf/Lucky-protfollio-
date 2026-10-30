import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1000 },
  icon: { type: String, default: "" },
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);
