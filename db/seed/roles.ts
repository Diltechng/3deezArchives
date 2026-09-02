import { roles } from "../schema";
import { PLATFORM_ORGANISATION_ID } from "./organisations";
import { DbClient } from "../types";

export async function seedRoles(db: DbClient) {
  await db.insert(roles)
    .values({
      name: "Super Administrator",
      code: "SUPER_ADMIN",
      description: "Full platform-level access across all organisations and system settings.",
      organisationId: PLATFORM_ORGANISATION_ID,
    })
    .onConflictDoNothing();

  console.log("Roles seeded successfully");

  const result = await db.select({ id: roles.id, code: roles.code }).from(roles);

  const roleMap = Object.fromEntries(result.map(role => [role.code, role.id]));

  return roleMap;
}