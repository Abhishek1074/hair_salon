import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: "" },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
