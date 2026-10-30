import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  category: { type: String, required: true, trim: true, maxlength: 60 },
  proficiency: { type: Number, min: 0, max: 100, default: 75 },
  icon: { type: String, default: "" },
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Skill", skillSchema);
