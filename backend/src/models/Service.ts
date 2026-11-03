import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  durationMinutes: { type: Number, required: true, min: 15 },
  imageUrl: { type: String, default: "" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const Service = mongoose.model("Service", serviceSchema);
