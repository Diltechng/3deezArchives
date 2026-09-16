import { users } from "../schema";
import bcrypt from "bcrypt";
import { UserRole } from "@/shared/constants/enums";
import { DbClient } from "../types";
import { env } from "@/server/lib/env";

export async function seedAdmin(db: DbClient) {
  const adminEmail = env.SUPER_ADMIN_EMAIL;
  const adminPassword = env.SUPER_ADMIN_PASSWORD;
  const adminName = env.SUPER_ADMIN_NAME;

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
