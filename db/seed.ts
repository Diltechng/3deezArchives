import { db } from ".";
import { users } from "./schema";
import bcrypt from "bcrypt";
import { UserRole } from "@/shared/constants/enums";

async function seed() {
  await db.insert(users).values({
    email: "ghalimusa53@gmail.com",
    passwordHash: await bcrypt.hash("3Deez@Jeerex.4", 10),
    name: "Ghali Musa",
    onboardingCompleted: true,
    role: UserRole.ADMIN,
    status: "active",
  });

  console.log("User created successfully.");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});