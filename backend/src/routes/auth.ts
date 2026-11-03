import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8)
});
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

function tokenFor(user: { _id: unknown; role: string }) {
  return jwt.sign({ id: String(user._id), role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

router.post("/register", asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const email = data.email.toLowerCase();
  if (await User.findOne({ email })) return res.status(409).json({ message: "Email is already registered" });
  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await User.create({ ...data, email, passwordHash });
  res.status(201).json({
    token: tokenFor(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await User.findOne({ email: data.email.toLowerCase() });
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    return res.status(401).json({ message: "Email or password is incorrect" });
  }
  res.json({
    token: tokenFor(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
}));

router.get("/me", requireAuth, asyncHandler(async (req: AuthRequest, res) => {
  const user = await User.findById(req.user!.id).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
}));

export default router;
