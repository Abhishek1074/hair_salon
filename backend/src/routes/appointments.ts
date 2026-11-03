import { Router } from "express";
import { randomUUID } from "crypto";
import { z } from "zod";
import { Appointment } from "../models/Appointment";
import { Service } from "../models/Service";
import { Stylist } from "../models/Stylist";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const createSchema = z.object({
  serviceId: z.string(),
  stylistId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  customerNotes: z.string().max(500).optional()
});
const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
const fromMinutes = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

router.get("/availability", asyncHandler(async (req, res) => {
  const { stylistId, serviceId, date } = req.query as Record<string, string>;
  if (!stylistId || !serviceId || !date) return res.status(400).json({ message: "stylistId, serviceId and date are required" });
  const stylist = await Stylist.findById(stylistId);
  const service = await Service.findById(serviceId);
  if (!stylist?.active || !service?.active) return res.status(404).json({ message: "Stylist or service not found" });

  const day = new Date(`${date}T12:00:00`).getDay();
  if (!stylist.workingDays.includes(day)) return res.json({ slots: [] });

  const existing = await Appointment.find({
    stylist: stylistId, date, status: { $in: ["Pending", "Confirmed"] }
  });
  const start = toMinutes(stylist.startTime);
  const end = toMinutes(stylist.endTime);
  const duration = service.durationMinutes;
  const slots: string[] = [];
  for (let t = start; t + duration <= end; t += 30) {
    const slotEnd = t + duration;
    const overlap = existing.some(a => t < toMinutes(a.endTime) && slotEnd > toMinutes(a.startTime));
    if (!overlap) slots.push(fromMinutes(t));
  }
  res.json({ slots });
}));

router.post("/", requireAuth, asyncHandler(async (req: AuthRequest, res) => {
  const data = createSchema.parse(req.body);
  const [service, stylist] = await Promise.all([
    Service.findById(data.serviceId),
    Stylist.findById(data.stylistId)
  ]);
  if (!service?.active || !stylist?.active) return res.status(404).json({ message: "Selected service or stylist is unavailable" });

  const day = new Date(`${data.date}T12:00:00`).getDay();
  if (!stylist.workingDays.includes(day)) return res.status(400).json({ message: "Stylist does not work on this day" });

  const start = toMinutes(data.startTime);
  const end = start + service.durationMinutes;
  if (start < toMinutes(stylist.startTime) || end > toMinutes(stylist.endTime)) {
    return res.status(400).json({ message: "Selected time is outside stylist working hours" });
  }
  const dateTime = new Date(`${data.date}T${data.startTime}:00`);
  if (Number.isNaN(dateTime.getTime()) || dateTime.getTime() <= Date.now()) {
    return res.status(400).json({ message: "Please select a future appointment time" });
  }

  const endTime = fromMinutes(end);
  const overlap = await Appointment.findOne({
    stylist: stylist._id,
    date: data.date,
    status: { $in: ["Pending", "Confirmed"] },
    startTime: { $lt: endTime },
    endTime: { $gt: data.startTime }
  });
  if (overlap) return res.status(409).json({ message: "That time has just been booked. Please choose another slot." });

  const appointment = await Appointment.create({
    bookingId: `SN-${randomUUID().slice(0, 8).toUpperCase()}`,
    customer: req.user!.id,
    service: service._id,
    stylist: stylist._id,
    date: data.date,
    startTime: data.startTime,
    endTime,
    customerNotes: data.customerNotes || ""
  });
  await appointment.populate(["service", "stylist"]);
  res.status(201).json(appointment);
}));

router.get("/mine", requireAuth, asyncHandler(async (req: AuthRequest, res) => {
  const items = await Appointment.find({ customer: req.user!.id }).populate("service stylist").sort({ date: -1, startTime: -1 });
  res.json(items);
}));

router.get("/", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.date) filter.date = req.query.date;
  const items = await Appointment.find(filter).populate("customer", "name email phone").populate("service stylist").sort({ date: 1, startTime: 1 });
  res.json(items);
}));

router.patch("/:id/status", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const status = z.enum(["Pending", "Confirmed", "Completed", "Cancelled"]).parse(req.body.status);
  const item = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("customer service stylist");
  if (!item) return res.status(404).json({ message: "Appointment not found" });
  res.json(item);
}));

router.delete("/:id", requireAuth, asyncHandler(async (req: AuthRequest, res) => {
  const item = await Appointment.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Appointment not found" });
  if (req.user!.role !== "admin" && String(item.customer) !== req.user!.id) return res.status(403).json({ message: "Not allowed" });
  if (item.status === "Completed") return res.status(400).json({ message: "Completed appointments cannot be cancelled" });
  item.status = "Cancelled";
  await item.save();
  res.json({ message: "Appointment cancelled" });
}));

export default router;
