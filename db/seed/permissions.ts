import { PERMISSION_CATEGORY, PERMISSION_DESCRIPTIONS, PermissionValues } from "@/shared/constants/permissions";
import { permissions } from "../schema";
import { DbClient } from "../types";

export async function seedPermissions(db: DbClient) {
  const permissionsData = PermissionValues.map(permission => ({
    name: permission,
    category: PERMISSION_CATEGORY[permission],
    description: PERMISSION_DESCRIPTIONS[permission],
  }))

  await db.insert(permissions)
    .values(permissionsData)
    .onConflictDoNothing();

  console.log("Permissions seeded successfully");
}