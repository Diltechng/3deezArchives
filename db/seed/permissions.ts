import { Permission, PERMISSION_CATEGORY_MAP, PERMISSION_DESCRIPTION_MAP, ALL_PERMISSIONS } from "@/shared/constants/permissions.constants";
import { permissions } from "../schema";
import { DbClient } from "../types";

export async function seedPermissions(db: DbClient) {
  const permissionsData = ALL_PERMISSIONS.map(permission => ({
    name: permission,
    category: PERMISSION_CATEGORY_MAP[permission],
    description: PERMISSION_DESCRIPTION_MAP[permission],
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