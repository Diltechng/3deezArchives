import { db } from "..";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { UserRole } from "@/shared/constants/enums";

export async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME;

  if (!adminEmail || !adminPassword || !adminName)
    throw new Error("Missing or misconfigured admin credentials. Please configure them in your environment variables.");

  await db.insert(users).values({
    email: adminEmail,
    passwordHash: await bcrypt.hash(adminPassword, 10),
    name: adminName,
    onboardingCompleted: true,
    role: UserRole.ADMIN,
    status: "active",
  }).onConflictDoNothing();
  
  console.log("Admin seeded successfully.");
}
