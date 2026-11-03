import { Router } from "express";
import { Stylist } from "../models/Stylist";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
router.get("/", asyncHandler(async (_req, res) => res.json(await Stylist.find({ active: true }).sort({ name: 1 }))));
router.post("/", requireAuth, requireAdmin, asyncHandler(async (req, res) => res.status(201).json(await Stylist.create(req.body))));
router.put("/:id", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const item = await Stylist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: "Stylist not found" });
  res.json(item);
}));
router.delete("/:id", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const item = await Stylist.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!item) return res.status(404).json({ message: "Stylist not found" });
  res.json({ message: "Stylist disabled" });
}));
export default router;
