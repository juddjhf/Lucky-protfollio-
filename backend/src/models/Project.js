import mongoose from "mongoose";

const httpUrl = {
  validator: (value) => !value || /^https?:\/\//i.test(value),
  message: "URL must use http or https"
};

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, required: true, maxlength: 5000 },
  shortDescription: { type: String, required: true, maxlength: 240 },
  image: { type: String, default: "", validate: httpUrl },
  technologies: [{ type: String, trim: true }],
  liveUrl: { type: String, default: "", validate: httpUrl },
  githubUrl: { type: String, default: "", validate: httpUrl },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
