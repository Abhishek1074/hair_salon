import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema({
  bookingId: { type: String, required: true, unique: true },
  customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  stylist: { type: Schema.Types.ObjectId, ref: "Stylist", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD in salon local time
  startTime: { type: String, required: true }, // HH:mm
  endTime: { type: String, required: true },
  customerNotes: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" }
}, { timestamps: true });

appointmentSchema.index({ stylist: 1, date: 1, startTime: 1, status: 1 });
export const Appointment = mongoose.model("Appointment", appointmentSchema);
