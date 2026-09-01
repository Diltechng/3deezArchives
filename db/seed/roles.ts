import { db } from "..";
import { roles } from "../schema";
import { PLATFORM_ORGANISATION_ID } from "./organisations";

export async function seedRoles() {
  await db.insert(roles)
    .values({
      name: "Super Administrator",
      code: "SUPER_ADMIN",
      description: "Full platform-level access across all organisations and system settings.",
      organisationId: PLATFORM_ORGANISATION_ID,
    })
    .onConflictDoNothing();

    console.log("Roles seeded successfully");
}