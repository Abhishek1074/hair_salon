import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth";
import serviceRoutes from "./routes/services";
import stylistRoutes from "./routes/stylists";
import appointmentRoutes from "./routes/appointments";
import adminRoutes from "./routes/admin";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }), authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/stylists", stylistRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "Studio Nora API" }));

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err?.name === "ZodError") return res.status(400).json({ message: "Validation failed", errors: err.issues });
  if (err?.code === 11000) return res.status(409).json({ message: "A record with this value already exists" });
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
