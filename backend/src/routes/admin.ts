import { Router } from "express";
import { Appointment } from "../models/Appointment";
import { User } from "../models/User";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
router.get("/dashboard", requireAuth, requireAdmin, asyncHandler(async (_req, res) => {
  const [total, today, pending, confirmed, completed, customers, revenueRows] = await Promise.all([
    Appointment.countDocuments(),
    Appointment.countDocuments({ date: new Date().toISOString().slice(0, 10) }),
    Appointment.countDocuments({ status: "Pending" }),
    Appointment.countDocuments({ status: "Confirmed" }),
    Appointment.countDocuments({ status: "Completed" }),
    User.countDocuments({ role: "customer" }),
    Appointment.find({ status: "Completed" }).populate("service", "price")
  ]);
  const revenue = revenueRows.reduce((sum, a: any) => sum + (a.service?.price || 0), 0);
  res.json({ totalAppointments: total, todayAppointments: today, pending, confirmed, completed, customers, revenue });
}));
export default router;
