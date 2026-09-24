import { UserRole } from "../enums";
import { Permission, PERMISSION, ALL_PERMISSIONS } from "../permissions.constants";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: ALL_PERMISSIONS,
  [UserRole.STAFF]: [
    PERMISSION.EVENTS_VIEW,
    PERMISSION.EVENTS_CREATE,
    PERMISSION.EVENTS_UPDATE,
    PERMISSION.EVENTS_DELETE,

    PERMISSION.CATEGORIES_VIEW,
    PERMISSION.USERS_VIEW,
  ]
};

export function hasPermission(role: UserRole, permission: Permission) {
  const permissions = ROLE_PERMISSIONS[role];

  if (!permissions) return false;

  return permissions.includes(permission);
}