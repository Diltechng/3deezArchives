import { isNull } from "drizzle-orm";
import { permissions, rolePermissions } from "@/server/db/schema";
import { DbTransaction } from "@/server/db/types";
import { PERMISSION_CATEGORIES, PERMISSIONS } from "@/shared/constants/permissions.constants";
import { BACKFILL_ORGANISATION_ADMIN_ID, BACKFILL_ORGANISATION_MEMBER_ID } from "./roles";

export async function backfillRolePermissions(tx: DbTransaction) {
  const permissionList = await tx.select()
    .from(permissions)
    .where(isNull(permissions.deletedAt));

  const orgAdminPermissionList = permissionList.filter((permission) => {
    const allowedCategories = [
      PERMISSION_CATEGORIES.CATEGORIES,
      PERMISSION_CATEGORIES.EVENTS,
      PERMISSION_CATEGORIES.INVITATIONS,
      PERMISSION_CATEGORIES.ROLES,
      PERMISSION_CATEGORIES.USERS,
    ] as string[];

    const allowedNames = [
      PERMISSIONS.ORGANISATIONS_UPDATE
    ] as string[];

    return (
      allowedCategories.includes(permission.category) ||
      allowedNames.includes(permission.name)
    );
  });

  const orgMemberPermissionList = permissionList.filter((permission) => {
    const allowedNames = [
      PERMISSIONS.EVENTS_VIEW,
      PERMISSIONS.EVENTS_CREATE,
      PERMISSIONS.EVENTS_UPDATE,
      PERMISSIONS.EVENTS_DELETE,

      PERMISSIONS.CATEGORIES_VIEW,
      PERMISSIONS.USERS_VIEW,
    ] as string[];

    return allowedNames.includes(permission.name);
  });
  
  await tx.insert(rolePermissions)
    .values([
      ...orgAdminPermissionList.map((permission) => ({
        roleId: BACKFILL_ORGANISATION_ADMIN_ID,
        permissionId: permission.id,
        isAllowed: true,
      })),
      ...orgMemberPermissionList.map((permission) => ({
        roleId: BACKFILL_ORGANISATION_MEMBER_ID,
        permissionId: permission.id,
        isAllowed: true,
      })),
    ]
    );

  console.log("Permissions successfully assigned to backfilled roles");
}