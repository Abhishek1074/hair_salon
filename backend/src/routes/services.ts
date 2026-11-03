import { Router } from "express";
import { z } from "zod";
import { Service } from "../models/Service";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0),
  durationMinutes: z.number().int().min(15),
  imageUrl: z.string().url().optional().or(z.literal("")),
  active: z.boolean().optional()
});

router.get("/", asyncHandler(async (_req, res) => {
  res.json(await Service.find({ active: true }).sort({ name: 1 }));
}));
router.post("/", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const data = schema.parse(req.body);
  res.status(201).json(await Service.create(data));
}));
router.put("/:id", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const data = schema.partial().parse(req.body);
  const item = await Service.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: "Service not found" });
  res.json(item);
}));
router.delete("/:id", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const item = await Service.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!item) return res.status(404).json({ message: "Service not found" });
  res.json({ message: "Service disabled" });
}));
export default router;
