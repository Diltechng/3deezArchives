import { Permission } from "@/shared/constants/permissions.constants";
import { rolePermissions } from "../schema";
import { DbClient } from "../types";

export async function seedRolePermissions(
  db: DbClient,
  roleMap: Record<string, string>,
  permissionMap: Record<Permission, string>
) {
  const superAdminRoleId = roleMap["SUPER_ADMIN"];

  await db.insert(rolePermissions)
    .values(
      Object.entries(permissionMap)
        .map(([_, permissionId]) => ({
          roleId: superAdminRoleId,
          permissionId: permissionId,
          isAllowed: true,
        }))
    )
    .onConflictDoNothing();

  console.log("Role<->Permissions for SUPER_ADMIN seeded successfully");
}