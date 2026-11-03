import mongoose, { Schema } from "mongoose";

const stylistSchema = new Schema({
  name: { type: String, required: true, trim: true },
  bio: { type: String, default: "" },
  specialty: { type: String, default: "Cut & Style" },
  experienceYears: { type: Number, default: 1 },
  imageUrl: { type: String, default: "" },
  workingDays: { type: [Number], default: [1, 2, 3, 4, 5, 6] },
  startTime: { type: String, default: "09:00" },
  endTime: { type: String, default: "19:00" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const Stylist = mongoose.model("Stylist", stylistSchema);
