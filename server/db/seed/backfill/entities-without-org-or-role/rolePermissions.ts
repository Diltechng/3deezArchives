import { isNull } from "drizzle-orm";
import { permissions, rolePermissions } from "@/server/db/schema";
import { DbTransaction } from "@/server/db/types";
import { PERMISSION_CATEGORY, PERMISSION, PERMISSION_SCOPE } from "@/shared/constants/permissions.constants";
import { BACKFILL_ORGANISATION_ADMIN_ID, BACKFILL_ORGANISATION_MEMBER_ID } from "./roles";

export async function backfillRolePermissions(tx: DbTransaction) {
  const permissionList = await tx.select()
    .from(permissions)
    .where(isNull(permissions.deletedAt));

  const orgAdminPermissionList = permissionList.filter((permission) => {
    const allowedCategories = [
      PERMISSION_CATEGORY.CATEGORIES,
      PERMISSION_CATEGORY.EVENTS,
      PERMISSION_CATEGORY.INVITATIONS,
      PERMISSION_CATEGORY.ROLES,
      PERMISSION_CATEGORY.USERS,
    ] as string[];

    const allowedNames = [
      PERMISSION.ORGANISATIONS_UPDATE
    ] as string[];

    return (
      allowedCategories.includes(permission.category) ||
      allowedNames.includes(permission.name)
    );
  });

  const orgMemberPermissionList = permissionList.filter((permission) => {
    const allowedNames = [
      PERMISSION.EVENTS_VIEW,
      PERMISSION.EVENTS_CREATE,
      PERMISSION.EVENTS_UPDATE,
      PERMISSION.EVENTS_DELETE,

      PERMISSION.CATEGORIES_VIEW,
      PERMISSION.USERS_VIEW,
    ] as string[];

    return allowedNames.includes(permission.name);
  });
  
  await tx.insert(rolePermissions)
    .values([
      ...orgAdminPermissionList.map((permission) => ({
        roleId: BACKFILL_ORGANISATION_ADMIN_ID,
        permissionId: permission.id,
        isAllowed: true,
        scope: PERMISSION_SCOPE.ORGANISATION
      })),
      ...orgMemberPermissionList.map((permission) => ({
        roleId: BACKFILL_ORGANISATION_MEMBER_ID,
        permissionId: permission.id,
        isAllowed: true,
        scope: PERMISSION_SCOPE.OWN
      })),
    ]);

  console.log("Permissions successfully assigned to backfilled roles");
}