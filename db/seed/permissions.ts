import { Permission, PERMISSION_CATEGORY, PERMISSION_DESCRIPTIONS, PermissionValues } from "@/shared/constants/permissions";
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

  const result = await db.select({ id: permissions.id, name: permissions.name }).from(permissions);

  const permissionMap = Object.fromEntries(
    result.map(permission =>
      [permission.name, permission.id]
    )
  ) as Record<Permission, string>;

  return permissionMap;
}