import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

try {
  const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Set MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before seeding");
  }
  if (ADMIN_PASSWORD.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  await mongoose.connect(MONGODB_URI);
  const email = ADMIN_EMAIL.toLowerCase().trim();
  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await Admin.findOneAndUpdate({ email }, { name: ADMIN_NAME, email, password }, { upsert: true, new: true, runValidators: true });
  console.log(`Admin account ready for ${email}`);
} catch (error) {
  console.error("Admin seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
