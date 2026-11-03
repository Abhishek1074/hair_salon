import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import { connectDatabase } from "./config/db";
import { User } from "./models/User";
import { Service } from "./models/Service";
import { Stylist } from "./models/Stylist";

async function seed() {
  await connectDatabase();
  const email = process.env.ADMIN_EMAIL || "admin@studionora.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({
      name: process.env.ADMIN_NAME || "Studio Nora Admin",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "admin"
    });
    console.log(`Admin created: ${email}`);
  } else console.log("Admin already exists");

  if (await Service.countDocuments() === 0) {
    await Service.insertMany([
      { name: "Cut & Style", description: "A tailored cut and beautifully finished style.", price: 65, durationMinutes: 60 },
      { name: "Colour & Balayage", description: "Bespoke colour with seamless, natural blending.", price: 95, durationMinutes: 150 },
      { name: "Highlights", description: "Foil and freehand highlights for dimension.", price: 85, durationMinutes: 120 },
      { name: "Blow-Dry", description: "A polished salon finish with lasting volume.", price: 40, durationMinutes: 45 },
      { name: "Keratin Treatment", description: "Smoothing treatment for softer, manageable hair.", price: 150, durationMinutes: 180 },
      { name: "Hair Extensions", description: "Consultation-led extensions tailored to you.", price: 200, durationMinutes: 180 }
    ]);
  }
  if (await Stylist.countDocuments() === 0) {
    await Stylist.insertMany([
      { name: "Nora James", specialty: "Colour & Balayage", bio: "Founder and colour specialist with an eye for effortless, dimensional colour.", experienceYears: 12 },
      { name: "Amelia Rose", specialty: "Cut & Style", bio: "Precision cuts and beautifully wearable styling.", experienceYears: 8 },
      { name: "Sofia Lane", specialty: "Texture & Treatments", bio: "Specialist in healthy hair, curls, and smoothing treatments.", experienceYears: 6 }
    ]);
  }
  console.log("Seed complete");
  process.exit(0);
}
seed().catch(error => { console.error(error); process.exit(1); });
